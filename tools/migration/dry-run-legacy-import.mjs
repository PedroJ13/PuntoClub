import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CUSTOMER_KEYS = ["legacy_customer_id", "phone", "email"];
const CANONICAL_MOVEMENT_TYPES = new Set([
  "purchase",
  "redemption",
  "points_adjustment_positive",
  "points_adjustment_negative",
  "legacy_balance_import",
  "legacy_balance_reconciliation",
]);
const MOVEMENT_TYPE_ALIASES = new Map([
  ["redeem", "redemption"],
  ["balance_snapshot", "legacy_balance_import"],
]);
const NEGATIVE_POINTS_ALLOWED_TYPES = new Set([
  "points_adjustment_negative",
  "legacy_balance_reconciliation",
]);

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);

const cli = parseArgs(process.argv.slice(2));

if (cli.help || (!cli.customers && !cli.movements && !cli.compact)) {
  printHelp();
  process.exit(cli.help ? 0 : 1);
}

const importBatchId = randomUUID();
const outDir = path.resolve(cli.out ?? "tools/migration/output/latest");
const sourceSystem = cli["source-system"] ?? "legacy";
const scenario = cli.scenario ?? inferScenario(cli);
const messages = [];
const customers = [];
const movements = [];
const seen = {
  legacyCustomerIds: new Map(),
  phones: new Map(),
  emails: new Map(),
  movementIds: new Map(),
};

await mkdir(outDir, { recursive: true });

if (cli.customers) {
  const rows = await loadTabularFile(cli.customers, "customers");
  validateCustomers(rows, cli.customers, false);
}

if (cli.compact) {
  const rows = await loadTabularFile(cli.compact, "compact");
  validateCustomers(rows, cli.compact, true);
}

if (cli.movements) {
  const rows = await loadTabularFile(cli.movements, "movements");
  validateMovements(rows, cli.movements);
}

const summary = buildSummary();
await writeOutputs(summary);

const outputLine = [
  `legacy import dry-run batch=${importBatchId}`,
  `scenario=${scenario}`,
  `customers=${summary.counts.customers.accepted}/${summary.counts.customers.total}`,
  `movements=${summary.counts.movements.accepted}/${summary.counts.movements.total}`,
  `errors=${summary.validation.errors}`,
  `warnings=${summary.validation.warnings}`,
  `out=${outDir}`,
].join(" ");

console.log(outputLine);

if (summary.validation.errors > 0) {
  console.error(
    "Dry-run completed with validation errors. Review summary.md and validation-messages.jsonl.",
  );
  process.exit(1);
}

function parseArgs(args) {
  const result = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }

    const key = arg.slice(2);
    if (key === "help") {
      result.help = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    result[key] = value;
    index += 1;
  }

  return result;
}

function printHelp() {
  console.log(`Usage:
node tools/migration/dry-run-legacy-import.mjs --customers <file.csv> [--movements <file.csv>] [--compact <file.csv>] [--out <dir>]

Options:
  --customers       Legacy customer CSV.
  --movements       Legacy movement CSV.
  --compact         Compact customer + balance CSV.
  --scenario        full_history | compact_balance | partial_history_with_adjustment | mixed_files.
  --source-system   Source system label for staging metadata. Defaults to legacy.
  --out             Output folder. Defaults to tools/migration/output/latest.

CSV is supported without dependencies. XLSX files are detected and rejected with a clear message in this local version.`);
}

function handleFatalError(error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

function inferScenario(input) {
  if (input.compact && !input.movements) {
    return "compact_balance";
  }

  if (input.customers && input.movements && !input.compact) {
    return "full_history";
  }

  return "mixed_files";
}

async function loadTabularFile(filePath, fileKind) {
  const resolvedPath = path.resolve(filePath);
  const extension = path.extname(resolvedPath).toLowerCase();

  if (extension === ".xlsx") {
    throw new Error(
      `XLSX_UNSUPPORTED_WITHOUT_PARSER: ${filePath}. Convert to CSV for this dry-run tool or add an approved XLSX parser in a later task.`,
    );
  }

  if (extension !== ".csv") {
    throw new Error(
      `UNSUPPORTED_FILE_TYPE: ${filePath}. Only CSV is supported in this local version.`,
    );
  }

  const text = await readFile(resolvedPath, "utf8");
  const parsed = parseCsv(text);
  if (parsed.length === 0) {
    addMessage(
      "error",
      fileKind,
      filePath,
      0,
      "EMPTY_FILE",
      "The CSV has no rows.",
    );
    return [];
  }

  const headers = parsed[0].map((header) => normalizeHeader(header));
  const rows = parsed.slice(1).filter(hasNonEmptyCells);

  return rows.map((cells, rowIndex) => {
    const raw = {};
    headers.forEach((header, cellIndex) => {
      raw[header] = cells[cellIndex]?.trim() ?? "";
    });

    return {
      fileKind,
      sourceFile: filePath,
      rowNumber: rowIndex + 2,
      raw,
    };
  });
}

function parseCsv(text) {
  const delimiter = detectDelimiter(text);
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(hasNonEmptyCells);
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const semicolons = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  return semicolons > commas ? ";" : ",";
}

function hasNonEmptyCells(cells) {
  return cells.some((cell) => cell.trim().length > 0);
}

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function validateCustomers(rows, sourceFile, compactMode) {
  const requiredHeaders = compactMode
    ? ["customer_name", "current_points_balance", "balance_as_of"]
    : ["customer_name"];
  validateHeaders(
    rows,
    sourceFile,
    compactMode ? "compact" : "customers",
    requiredHeaders,
    CUSTOMER_KEYS,
  );

  rows.forEach((row) => {
    const normalized = normalizeCustomer(row.raw);
    const customerErrorsBefore = countErrors();

    if (!row.raw.customer_name) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "MISSING_CUSTOMER_NAME",
        "Customer name is required.",
      );
    }

    if (!hasAnyIdentifier(row.raw)) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "MISSING_CUSTOMER_IDENTIFIER",
        "At least one identifier is required: legacy_customer_id, phone, or email.",
      );
    }

    if (row.raw.email && !isValidEmail(normalized.email)) {
      addMessage(
        "warning",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "INVALID_EMAIL_FORMAT",
        "Email does not look valid.",
      );
    }

    checkDuplicate(
      seen.legacyCustomerIds,
      normalized.legacyCustomerId,
      "DUPLICATE_LEGACY_CUSTOMER_ID",
      row,
    );
    checkDuplicate(
      seen.phones,
      normalized.phone,
      "DUPLICATE_PHONE",
      row,
      "warning",
    );
    checkDuplicate(
      seen.emails,
      normalized.email,
      "DUPLICATE_EMAIL",
      row,
      "warning",
    );

    if (compactMode) {
      if (!isIntegerLike(row.raw.current_points_balance)) {
        addMessage(
          "error",
          row.fileKind,
          sourceFile,
          row.rowNumber,
          "INVALID_CURRENT_POINTS_BALANCE",
          "Current points balance must be an integer.",
        );
      }

      if (Number(row.raw.current_points_balance) < 0) {
        addMessage(
          "error",
          row.fileKind,
          sourceFile,
          row.rowNumber,
          "NEGATIVE_CURRENT_POINTS_BALANCE",
          "Current points balance cannot be negative.",
        );
      }

      if (!isValidDate(row.raw.balance_as_of)) {
        addMessage(
          "error",
          row.fileKind,
          sourceFile,
          row.rowNumber,
          "INVALID_BALANCE_DATE",
          "Balance date is invalid.",
        );
      }
    }

    customers.push({
      import_batch_id: importBatchId,
      source_system: sourceSystem,
      source_file: sourceFile,
      source_row_number: row.rowNumber,
      legacy_customer_id: row.raw.legacy_customer_id ?? "",
      customer_name: row.raw.customer_name ?? "",
      phone: row.raw.phone ?? "",
      email: row.raw.email ?? "",
      customer_status: row.raw.customer_status ?? "active",
      created_at_raw: row.raw.created_at ?? "",
      current_points_balance_raw: row.raw.current_points_balance ?? "",
      balance_as_of_raw: row.raw.balance_as_of ?? "",
      notes: row.raw.notes ?? "",
      normalized_legacy_customer_id: normalized.legacyCustomerId,
      normalized_name: normalized.name,
      normalized_phone: normalized.phone,
      normalized_email: normalized.email,
      source_hash: hashPayload(row.raw),
      raw_payload: row.raw,
      import_status:
        countErrors() === customerErrorsBefore ? "accepted" : "rejected",
    });
  });
}

function validateMovements(rows, sourceFile) {
  validateHeaders(
    rows,
    sourceFile,
    "movements",
    ["transaction_date", "type", "points"],
    CUSTOMER_KEYS,
  );

  rows.forEach((row) => {
    const movementErrorsBefore = countErrors();
    const normalizedCustomer = normalizeCustomer(row.raw);

    if (!hasAnyIdentifier(row.raw)) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "MISSING_MOVEMENT_CUSTOMER_IDENTIFIER",
        "Movement needs a legacy_customer_id, phone, or email.",
      );
    }

    if (!isValidDate(row.raw.transaction_date)) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "INVALID_TRANSACTION_DATE",
        "Transaction date is missing or invalid.",
      );
    } else if (new Date(row.raw.transaction_date) > new Date()) {
      addMessage(
        "warning",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "FUTURE_TRANSACTION_DATE",
        "Date is in the future.",
      );
    }

    const movementTypeRaw = row.raw.type?.trim() ?? "";
    const movementType = normalizeMovementType(movementTypeRaw);
    if (!CANONICAL_MOVEMENT_TYPES.has(movementType)) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "INVALID_MOVEMENT_TYPE",
        `Movement type is not supported. Use one of: ${Array.from(CANONICAL_MOVEMENT_TYPES).join(", ")}.`,
      );
    }

    if (!isIntegerLike(row.raw.points)) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "INVALID_POINTS",
        "Points must be an integer.",
      );
    }

    if (
      Number(row.raw.points) < 0 &&
      !NEGATIVE_POINTS_ALLOWED_TYPES.has(movementType)
    ) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "NEGATIVE_POINTS_FOR_TYPE",
        "Negative points require points_adjustment_negative or legacy_balance_reconciliation.",
      );
    }

    if (
      movementType === "purchase" &&
      row.raw.amount &&
      !isNumericLike(row.raw.amount)
    ) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "INVALID_AMOUNT",
        "Purchase amount must be numeric when present.",
      );
    }

    if (movementType === "purchase" && !row.raw.amount) {
      addMessage(
        "warning",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "MISSING_PURCHASE_AMOUNT",
        "Purchase amount is recommended.",
      );
    }

    checkDuplicate(
      seen.movementIds,
      row.raw.legacy_transaction_id,
      "DUPLICATE_LEGACY_TRANSACTION_ID",
      row,
    );

    if (!matchesKnownCustomer(normalizedCustomer)) {
      addMessage(
        "error",
        row.fileKind,
        sourceFile,
        row.rowNumber,
        "MOVEMENT_WITHOUT_CUSTOMER",
        "Movement does not match any accepted customer in this dry-run batch.",
      );
    }

    movements.push({
      import_batch_id: importBatchId,
      source_system: sourceSystem,
      source_file: sourceFile,
      source_row_number: row.rowNumber,
      legacy_transaction_id: row.raw.legacy_transaction_id ?? "",
      legacy_customer_id: row.raw.legacy_customer_id ?? "",
      transaction_date_raw: row.raw.transaction_date ?? "",
      type: movementType ?? "",
      source_type_raw: movementTypeRaw,
      amount_raw: row.raw.amount ?? "",
      points_raw: row.raw.points ?? "",
      description: row.raw.description ?? "",
      normalized_customer_key: firstIdentifier(normalizedCustomer),
      source_hash: hashPayload(row.raw),
      raw_payload: row.raw,
      import_status:
        countErrors() === movementErrorsBefore ? "accepted" : "rejected",
    });
  });
}

function validateHeaders(
  rows,
  sourceFile,
  fileKind,
  requiredHeaders,
  alternativeHeaders,
) {
  const headers = new Set(rows[0] ? Object.keys(rows[0].raw) : []);
  const missingRequired = requiredHeaders.filter(
    (header) => !headers.has(header),
  );
  const hasAlternative = alternativeHeaders.some((header) =>
    headers.has(header),
  );

  missingRequired.forEach((header) => {
    addMessage(
      "error",
      fileKind,
      sourceFile,
      1,
      "MISSING_REQUIRED_HEADER",
      `Missing required header: ${header}.`,
    );
  });

  if (!hasAlternative) {
    addMessage(
      "error",
      fileKind,
      sourceFile,
      1,
      "MISSING_IDENTIFIER_HEADER",
      `At least one identifier header is required: ${alternativeHeaders.join(", ")}.`,
    );
  }
}

function normalizeCustomer(raw) {
  return {
    legacyCustomerId: (raw.legacy_customer_id ?? "").trim(),
    name: normalizeText(raw.customer_name ?? ""),
    phone: normalizePhone(raw.phone ?? ""),
    email: normalizeEmail(raw.email ?? ""),
  };
}

function normalizeMovementType(value) {
  const normalized = value.trim().toLowerCase();
  return MOVEMENT_TYPE_ALIASES.get(normalized) ?? normalized;
}

function normalizeText(value) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizePhone(value) {
  return value.trim().replace(/[()\s-]/g, "");
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function hasAnyIdentifier(raw) {
  return CUSTOMER_KEYS.some((key) => (raw[key] ?? "").trim().length > 0);
}

function firstIdentifier(normalized) {
  return (
    normalized.legacyCustomerId || normalized.phone || normalized.email || ""
  );
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function isIntegerLike(value) {
  return /^-?\d+$/.test(String(value ?? "").trim());
}

function isNumericLike(value) {
  return /^-?\d+(\.\d+)?$/.test(String(value ?? "").trim());
}

function checkDuplicate(map, value, code, row, severity = "error") {
  if (!value) {
    return;
  }

  if (map.has(value)) {
    addMessage(
      severity,
      row.fileKind,
      row.sourceFile,
      row.rowNumber,
      code,
      `Duplicate value already seen at row ${map.get(value)}.`,
    );
    return;
  }

  map.set(value, row.rowNumber);
}

function matchesKnownCustomer(normalized) {
  const acceptedCustomers = customers.filter(
    (customer) => customer.import_status === "accepted",
  );

  return acceptedCustomers.some((customer) => {
    return (
      (normalized.legacyCustomerId &&
        customer.normalized_legacy_customer_id ===
          normalized.legacyCustomerId) ||
      (normalized.phone && customer.normalized_phone === normalized.phone) ||
      (normalized.email && customer.normalized_email === normalized.email)
    );
  });
}

function hashPayload(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function addMessage(severity, fileKind, sourceFile, rowNumber, code, message) {
  messages.push({
    severity,
    file_kind: fileKind,
    source_file: sourceFile,
    source_row_number: rowNumber,
    code,
    message,
  });
}

function countErrors() {
  return messages.filter((message) => message.severity === "error").length;
}

function buildSummary() {
  const customerAccepted = customers.filter(
    (customer) => customer.import_status === "accepted",
  ).length;
  const movementAccepted = movements.filter(
    (movement) => movement.import_status === "accepted",
  ).length;

  return {
    import_batch_id: importBatchId,
    source_system: sourceSystem,
    scenario,
    generated_at: new Date().toISOString(),
    counts: {
      customers: {
        total: customers.length,
        accepted: customerAccepted,
        rejected: customers.length - customerAccepted,
      },
      movements: {
        total: movements.length,
        accepted: movementAccepted,
        rejected: movements.length - movementAccepted,
      },
    },
    validation: {
      errors: messages.filter((message) => message.severity === "error").length,
      warnings: messages.filter((message) => message.severity === "warning")
        .length,
      messages,
    },
    output_files: {
      staging_customers: "staging-customers.jsonl",
      staging_movements: "staging-movements.jsonl",
      validation_messages: "validation-messages.jsonl",
      summary_json: "summary.json",
      summary_md: "summary.md",
    },
  };
}

async function writeOutputs(summary) {
  const customerJsonl = customers.map((row) => JSON.stringify(row)).join("\n");
  const movementJsonl = movements.map((row) => JSON.stringify(row)).join("\n");
  const messageJsonl = messages
    .map((message) => JSON.stringify(message))
    .join("\n");

  await writeFile(
    path.join(outDir, "staging-customers.jsonl"),
    customerJsonl ? `${customerJsonl}\n` : "",
    "utf8",
  );
  await writeFile(
    path.join(outDir, "staging-movements.jsonl"),
    movementJsonl ? `${movementJsonl}\n` : "",
    "utf8",
  );
  await writeFile(
    path.join(outDir, "validation-messages.jsonl"),
    messageJsonl ? `${messageJsonl}\n` : "",
    "utf8",
  );
  await writeFile(
    path.join(outDir, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(outDir, "summary.md"),
    buildSummaryMarkdown(summary),
    "utf8",
  );
}

function buildSummaryMarkdown(summary) {
  const topMessages = summary.validation.messages
    .slice(0, 20)
    .map((message) => {
      return `- ${message.severity.toUpperCase()} ${message.code} ${message.source_file}:${message.source_row_number} - ${message.message}`;
    })
    .join("\n");

  return `# Legacy import dry-run summary

Batch: ${summary.import_batch_id}
Source system: ${summary.source_system}
Scenario: ${summary.scenario}
Generated at: ${summary.generated_at}

## Counts

| Entity | Total | Accepted | Rejected |
| --- | ---: | ---: | ---: |
| Customers | ${summary.counts.customers.total} | ${summary.counts.customers.accepted} | ${summary.counts.customers.rejected} |
| Movements | ${summary.counts.movements.total} | ${summary.counts.movements.accepted} | ${summary.counts.movements.rejected} |

## Validation

- Errors: ${summary.validation.errors}
- Warnings: ${summary.validation.warnings}

${topMessages || "No validation messages."}
`;
}
