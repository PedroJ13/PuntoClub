Equipo: QA

Tarea validada: TASK-181 - Validar operacion publicada con empresa autenticada

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-09
- Round: 2

Resultado: no aprobado / bloqueado por cambios no publicados y falta de sesion real

Flujos probados:
- Lectura de `tasks/TASK-181-assignment.md`.
- Lectura de `tasks/TASK-179-HANDOFF.md`.
- Lectura de `tasks/TASK-180-HANDOFF.md`.
- Validacion API publicada sin secretos:
  - `GET /api/me` sin sesion.
  - `GET /api/companies/1/customers` sin sesion.
  - `GET /api/companies/999/customers` sin sesion.
  - `GET /api/companies/1/customers` con cookie sintetica invalida.
- Revision de bundle Web publicado `/src/customerApi.js` para llamadas operativas y `credentials: "include"`.

Hallazgos:
- P1: La Web publicada no parece contener el ajuste operativo de TASK-180.
  - Las funciones publicadas `searchCustomers`, `createCustomer`, `getCustomerBalance`, `getCustomerActivity`, `createPurchase`, `createRedemption`, `getActivityReport`, `getAuditEvents`, `getCompanySettings` y `updateCompanySettings` no muestran `credentials: "include"` en el bundle revisado.
  - Esto impide validar que las operaciones viajen con cookie de sesion desde el navegador publicado.
- P1: La API publicada no parece contener o no aplica la regla de TASK-179 para cookie invalida.
  - Con cookie sintetica invalida en `GET /api/companies/1/customers`, la API respondio `200` con items.
  - TASK-179 esperaba que una cookie invalida no hiciera fallback silencioso y devolviera `401 UNAUTHORIZED`.
- P1: No se pudo validar operacion con empresa autenticada porque no hay sesion real/credenciales QA disponibles en esta ejecucion.
- `GET /api/me` sin sesion responde `401 UNAUTHORIZED`, esperado.
- `GET /api/companies/999/customers` sin sesion responde `404 COMPANY_NOT_FOUND`, consistente con fallback piloto acotado.
- `GET /api/companies/1/customers` sin sesion tuvo timeout a 30s en una corrida; no se clasifica como regresion confirmada porque el endpoint respondio en otras variantes, pero conviene monitorear latencia.

P0/P1:
- P1 abierto: Web publicada no envia cookies de sesion en operaciones privadas, contrario a TASK-180.
- P1 abierto: API publicada acepta cookie invalida y cae a comportamiento operativo/fallback, contrario a TASK-179.
- P1 abierto: validacion E2E con empresa autenticada queda bloqueada por falta de usuario/sesion QA y/o deploy publicado correcto.
- No se detectaron P0.

P2/P3:
- P2: Latencia/timeout observado en una llamada `GET /api/companies/1/customers` sin sesion; monitorear si se repite.

Evidencia redaccionada:
- Dependencias:
  - TASK-179: Backend local deberia derivar `companyId` desde sesion y rechazar cookie invalida con `401`.
  - TASK-180: Web local deberia enviar `credentials: "include"` en endpoints operativos privados.
- API publicada:
  - `GET /api/me` sin sesion: `401 UNAUTHORIZED`.
  - `GET /api/companies/999/customers` sin sesion: `404 COMPANY_NOT_FOUND`.
  - `GET /api/companies/1/customers` con cookie sintetica invalida: `200`, body con `items`.
  - `GET /api/companies/1/customers` sin sesion: timeout 30s en esta corrida.
- Web publicada:
  - `/src/customerApi.js` revisado.
  - Operaciones revisadas sin `credentials: "include"` en el bundle publicado:
    - `searchCustomers`;
    - `createCustomer`;
    - `getCustomerBalance`;
    - `getCustomerActivity`;
    - `createPurchase`;
    - `createRedemption`;
    - `getActivityReport`;
    - `getAuditEvents`;
    - `getCompanySettings`;
    - `updateCompanySettings`.
- No se pego token, cookie real, password ni link completo.

Pendientes o bloqueos:
- Backend/API debe confirmar deploy publicado de TASK-179 y revalidar que cookie invalida devuelve `401`.
- Web Dev/Release debe confirmar deploy publicado de TASK-180 y revalidar que operaciones privadas usan `credentials: "include"`.
- Product/QA debe proveer sesion real o credenciales QA por canal seguro para validar:
  - empresa/correo visible;
  - buscar/registrar cliente;
  - registrar compra;
  - redimir puntos;
  - historial/resumen;
  - reportes/auditoria;
  - logout;
  - UI coherente sin sesion.
- Reintentar TASK-181 cuando API/Web publicados reflejen TASK-179/TASK-180 y exista sesion QA controlada.

Siguiente recomendado:
- Reabrir con Backend/API y Web Dev para confirmar deploy publicado de TASK-179/TASK-180.
- Revalidar primero dos señales:
  - bundle operativo contiene `credentials: "include"`;
  - API con cookie invalida responde `401`.
- Luego ejecutar E2E autenticado con credenciales/sesion QA seguras.

Confirmacion de seguridad:
- No se uso `INTERNAL_ADMIN_TOKEN`.
- No se pego token de invitacion.
- No se pego link completo.
- No se pego password.
- No se pego cookie ni token de sesion.
- No se modifico codigo ni Azure.
