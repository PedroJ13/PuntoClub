Equipo: QA
Tarea validada: TASK-842 - Validar envios promocionales con fallos parciales y retry
Ambiente: Local/API con tests mock; Web publicada https://puntoclubcr.com con sesion real/controlada de Aurisbel; API publicada https://func-puntoclub-prod-br-001.azurewebsites.net/api para smoke seguro sin sesion.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto minimo: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-840-HANDOFF.md` y `tasks/TASK-841-HANDOFF.md`.
- `node --check api/src/functions/promotionalCampaigns.js`: OK.
- `node --check api/src/lib/repository.js`: OK.
- `node --check api/src/lib/validators.js`: OK.
- `node --check api/test/promotional-campaigns.test.js`: OK.
- `git diff --check`: OK, solo advertencias de CRLF en archivos ya modificados.
- `npm test -- --test-name-pattern=promotional` desde `api/`: 183/183 OK.
- Revision focal de pruebas locales:
  - retry transitorio de ACS antes de exito: OK.
  - agotamiento de retry con razon segura `acs_email_throttled_retry_exhausted`: OK.
  - `retryFailedOnly: true` reintenta solo fallidos y no llama `replacePromotionalCampaignRecipients`: OK.
  - payload `retryFailedOnly` no se mezcla con `customerIds`: cubierto por validador.
  - envio con multiples destinatarios y conteos `selected/sent/skipped`: OK.
- Web publicada con sesion Aurisbel:
  - modulo `Enviar campanas` carga con empresa visible Aurisbel Pasteleria.
  - historial publicado muestra campana `Promo frappe` con resultados parciales reales: filas `Enviado` y `Fallido`.
  - no se presiono `Enviar campana`, no se seleccionaron destinatarios para envio real y no se cambio ningun flag.
- API publicada sin sesion:
  - `POST /api/companies/6/promotional-campaigns/24/send` con payload invalido/controlado respondio `401 UNAUTHORIZED` / `Authentication is required.`

Hallazgos:
- El comportamiento backend local de retry queda validado con mocks: errores transitorios se reintentan, los errores agotados se sanitizan, y el modo `retryFailedOnly` prepara solo destinatarios fallidos sin reabrir enviados.
- En publicado existe evidencia visual de envios parciales en historial (`Enviado` y `Fallido`), pero no se ejecuto retry real porque implicaria enviar correos reales a destinatarios fallidos.
- El cliente Web publicado todavia no muestra boton/flujo dedicado para `Reintentar fallidos`; esto coincide con el pendiente declarado por Backend/API en TASK-840.

P0/P1:
- Ninguno abierto.

P2/P3:
- P2: no hay flujo Web dedicado visible para reintentar solo fallidos desde historial/resultado; el retry queda validado por API local/mock, no como accion operativa publicada.
- P3: la suite local valida retry fallido y conteos con omitidos, pero no tiene un unico caso de campana completa con resumen mixto `sent > 0` y `failed > 0` en el mismo resultado.

Evidencia:
- `npm test -- --test-name-pattern=promotional`: `# tests 183`, `# pass 183`, `# fail 0`.
- Tests relevantes observados en `api/test/promotional-campaigns.test.js`:
  - `promotional send retries transient ACS throttling before recording success`.
  - `promotional send records safe throttling reason after retry exhaustion`.
  - `promotional send retries only failed recipients without replacing sent recipients`.
- Web publicada:
  - empresa visible: Aurisbel Pasteleria, `Datos reales`.
  - KPIs visibles: Operativos 3, Suscritos 17, Bajas 0, Promociones Activas.
  - Historial visible para `Promo frappe` con estados combinados `Enviado` y `Fallido`.
- API publicada sin sesion:
  - respuesta segura: `401 UNAUTHORIZED`, mensaje `Authentication is required.`

Uso DB cloud: Si, motivo y alcance: solo lectura/smoke en ambiente publicado con sesion real/controlada para confirmar UI/historial de Aurisbel y un POST anonimo bloqueado por autenticacion. No se ejecuto SQL directo, no se modificaron datos y no se enviaron correos reales.

Riesgos o pendientes:
- Para validar retry publicado end-to-end haria falta una ventana autorizada de envio real controlado o un mecanismo publicado de mock/staging; no se ejecuto por la regla de no enviar correos reales sin autorizacion explicita.
- Si Product quiere retry operable por usuarios, falta tarea Web para boton/flujo `Reintentar fallidos` y confirmacion visual de conteos post-retry.
- La cadena sensible pegada previamente por el usuario fue ignorada; no se uso ni se guardo.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff como aprobado con observaciones. Recomiendo abrir tarea Web para exponer `retryFailedOnly` en historial/resultado y una tarea QA posterior con mock/staging o autorizacion PO acotada para validar retry publicado end-to-end sin envio masivo.
