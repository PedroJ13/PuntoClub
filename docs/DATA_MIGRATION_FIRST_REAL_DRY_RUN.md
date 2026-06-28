# Condiciones para primer dry-run real legacy

## Decision

El primer dry-run real de migracion legacy se hara con CSV, no con Excel nativo.

Si el proveedor entrega `.xlsx`, se debe convertir a CSV antes del dry-run. No se agregara parser `.xlsx` en este paso porque TASK-485 aprobo el paquete local con la limitacion conocida y controlada de convertir Excel a CSV.

## Objetivo del primer dry-run real

Validar la calidad y compatibilidad del primer archivo real legacy contra el contrato de migracion, sin cargar datos a Azure SQL ni modificar datos productivos.

El resultado esperado es un reporte redaccionado que permita decidir:

- si el archivo esta listo para staging controlado;
- si requiere limpieza/correccion;
- si falta una regla de mapeo;
- si se necesita soporte `.xlsx` nativo en una tarea posterior.

## Precondiciones obligatorias

Antes de ejecutar cualquier dry-run real:

1. TASK-485 debe estar aprobado localmente sin P0/P1 abiertos.
2. Product Owner debe identificar la empresa destino.
3. Product Owner debe confirmar el `source_system` del sistema viejo.
4. Product Owner debe indicar el escenario esperado:
   - `customers_only`;
   - `compact_balance`;
   - `full_history`;
   - `partial_history_with_reconciliation`;
   - `mixed_files`.
5. El archivo debe estar en CSV UTF-8 o convertido a CSV.
6. El archivo debe tener encabezados.
7. El archivo debe estar fuera del repo Git.
8. El responsable debe confirmar que el archivo no contiene passwords, tarjetas, documentos sensibles no necesarios ni datos de otras empresas.
9. Debe existir una carpeta temporal segura para outputs fuera del repo o dentro de una ruta ignorada y limpiada al final.

## Ubicacion de archivos reales

Preferido:

```text
C:\Work\SecureInputs\PuntoClub\legacy\<empresa>\<batch>\
```

Si se usa otra ruta, debe cumplir:

- fuera de `C:\Work\Productos Digitales\PuntoClub`;
- sin sincronizacion publica;
- no agregada a Git;
- accesible solo para el responsable local.

No guardar archivos reales en:

- `tools/migration/fixtures`;
- `tools/migration/templates`;
- `tasks/`;
- `docs/`;
- cualquier carpeta trackeada por Git.

## Outputs permitidos

Los outputs reales pueden generarse temporalmente, pero no deben commitearse.

Permitido temporal:

- `summary.json`
- `summary.md`
- `validation-messages.jsonl`
- `staging-customers.jsonl`
- `staging-movements.jsonl`

No permitido en repo:

- archivos CSV reales;
- outputs con nombres, telefonos, correos o referencias reales;
- capturas de pantalla con datos personales;
- muestras completas de filas reales.

## Evidencia permitida en handoff

El handoff puede incluir:

- conteos totales;
- escenario;
- numero de archivos;
- cantidad de errores por tipo;
- cantidad de warnings por tipo;
- decision sugerida;
- ejemplos redaccionados sin PII.

El handoff no debe incluir:

- nombres reales;
- telefonos reales;
- correos reales;
- IDs legacy reales si permiten identificar personas;
- referencias de factura reales;
- rutas completas si contienen nombres de clientes.

## Criterio de resultado del dry-run

### Apto para siguiente paso

Un batch puede pasar a revision para staging si:

- no tiene P0/P1;
- todos los errores estan en cero;
- warnings P2 estan explicados y son aceptables;
- el escenario coincide con el archivo;
- el reporte permite reconciliar clientes/movimientos/saldos.

### Requiere limpieza

Requiere limpieza si:

- hay columnas faltantes;
- hay tipos de movimiento desconocidos;
- hay clientes sin identificador de match;
- hay movimientos sin cliente;
- hay fechas invalidas;
- hay saldos negativos no aprobados;
- hay duplicados masivos.

### Requiere decision Product Owner

Requiere decision si:

- el archivo trae saldo compacto pero se esperaba historico;
- el archivo trae historico parcial y saldo final;
- hay ajustes negativos;
- hay clientes sin telefono/correo pero con legacy ID;
- hay posibles duplicados por nombre solamente;
- hay datos de varias empresas mezclados.

## Comando base esperado

Clientes + movimientos:

```powershell
npm run migration:dry-run -- --customers "<ruta-segura>\clientes.csv" --movements "<ruta-segura>\movimientos.csv" --scenario full_history --source-system "<sistema-legacy>" --out "<ruta-segura>\output"
```

Saldo compactado:

```powershell
npm run migration:dry-run -- --compact "<ruta-segura>\saldo.csv" --scenario compact_balance --source-system "<sistema-legacy>" --out "<ruta-segura>\output"
```

## Limpieza posterior

Despues del dry-run:

1. Revisar el resumen local.
2. Redactar handoff sin PII.
3. Confirmar si los outputs con datos reales deben conservarse temporalmente o borrarse.
4. No commitear outputs.
5. No subir archivos reales a GitHub, chat, docs ni tareas.

## Siguiente paso despues del dry-run

Si el dry-run real queda apto:

- crear tarea separada para staging controlado, todavia sin aplicar a tablas operativas.

Si no queda apto:

- pedir correccion del archivo o crear tarea de mapeo/normalizacion adicional.

Si el proveedor solo puede entregar `.xlsx`:

- crear tarea separada para evaluar/agregar parser `.xlsx` local aprobado.

