Equipo: QA
Tarea validada: TASK-848 - Validar pacing de envios promocionales y plan sender
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; pruebas unitarias/API con mocks; revision documental de handoff Infra. Sin Azure SQL, sin ACS real, sin DNS/Cloudflare y sin envio de correos reales.
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto minimo: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`.
- Lectura de dependencias:
  - `tasks/TASK-846-HANDOFF.md`.
  - `tasks/TASK-847-HANDOFF.md`.
- Revision focal de `api/src/functions/promotionalCampaigns.js`.
- Revision focal de `api/test/promotional-campaigns.test.js`.
- `node --check api/src/functions/promotionalCampaigns.js`: OK.
- `node --check api/test/promotional-campaigns.test.js`: OK.
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`: OK.
- `git diff --check`: OK, solo advertencias CRLF en archivos modificados.
- `npm --prefix api test -- --test-name-pattern=promotional`: 185/185 OK.

Hallazgos:
- Pacing API validado localmente:
  - default `PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS` = 750 ms.
  - valor configurado aceptado, por ejemplo 1250 ms.
  - valor excesivo acotado a 10000 ms.
  - valor invalido vuelve al default.
  - el envio no espera antes del primer destinatario elegible.
  - aplica pausa entre destinatarios elegibles.
  - no aplica pausa por destinatarios omitidos antes de enviar.
  - mantiene conteos `selected/sent/failed/skipped`.
- Retry y anti-duplicado siguen cubiertos:
  - retry transitorio ACS antes de exito sigue OK.
  - agotamiento de retry guarda motivo seguro.
  - `retryFailedOnly: true` reintenta solo fallidos y no llama `replacePromotionalCampaignRecipients`.
  - seleccion duplicada sigue bloqueada antes de envio.
  - destinatarios no elegibles se bloquean antes de correo.
- No se ejecutaron envios reales ni ACS real.
- Plan sender de TASK-847 revisado:
  - recomienda `mail.puntoclubcr.com`.
  - remitentes MVP: `operaciones@mail.puntoclubcr.com` y `campanas@mail.puntoclubcr.com`.
  - no se aplicaron cambios en Azure, ACS, DNS, Cloudflare, secretos ni app settings.
  - DNS exacto final debe copiarse desde Azure al iniciar/verificar dominio; no debe inventarse.
  - costos esperados: ACS cobra por email enviado y MB transferido; no se identifico costo separado por custom domain/sender usernames/DNS; posibles costos nuevos por buzones reales/alias pagos, DMARC externo opcional y mayor tiempo de Azure Functions por pacing.

P0/P1:
- Ninguno abierto.

P2/P3:
- P3: el pacing actual es una pausa secuencial dentro de la Function, no una cola persistente. Para cientos/miles de destinatarios, sigue pendiente decision de cola real con reanudacion.

Evidencia:
- `TASK-846-HANDOFF.md` declara pacing sin recursos cloud nuevos y sin cambios SQL/DNS/sender/flags.
- `TASK-847-HANDOFF.md` declara plan sender sin aplicar cambios reales y recomienda subdominio dedicado.
- Tests observados:
  - `promotional send pacing delay is configurable and bounded`: OK.
  - `promotional send paces eligible recipients without delaying skipped recipients`: OK.
  - `promotional send retries only failed recipients without replacing sent recipients`: OK.
  - `promotional send blocks duplicate selected recipients before sending email`: OK.
- Resultado suite: `# tests 185`, `# pass 185`, `# fail 0`.

Uso DB cloud: No.

Riesgos o pendientes:
- No se valido ACS real ni entregabilidad real; por instruccion de la tarea no se enviaron correos reales.
- Antes de aplicar sender propio, Product/Infra debe confirmar `mail.puntoclubcr.com` vs apex, remitentes finales, si habra buzones reales o solo sender/Reply-To, y ventana para DNS.
- Si se configura `PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS` en Azure, validar timeout esperado de Function segun volumen maximo de destinatarios.
- Para volumen alto, evaluar cola persistente real (Azure Queue/Service Bus + worker) antes de escalar campanas.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff como aprobado. Siguiente paso: decidir publicacion/configuracion de pacing y abrir tarea Infra apply solo si se aprueba dominio sender, DNS y remitentes finales.
