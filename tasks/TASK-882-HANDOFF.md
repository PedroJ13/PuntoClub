# TASK-882 - Handoff

Equipo: QA

Tarea validada: TASK-882 - Revalidar smoke autenticado staging phase 1

Ambiente: Web staging `https://calm-coast-0fabaec0f.7.azurestaticapps.net`; API staging `https://func-puntoclub-stg-br-001.azurewebsites.net/api`; fecha de ejecucion: 2026-07-09. Referencias revisadas: `tasks/TASK-880-HANDOFF.md` y `tasks/TASK-881-HANDOFF.md`.

Resultado: bloqueado

Checks ejecutados:
- Se reviso TASK-880: smoke publico/API seguro quedo ejecutado, pero autenticado/admin positivo quedo pendiente.
- Se reviso TASK-881: Infra confirmo que `INTERNAL_ADMIN_TOKEN` staging existe y es distinto del productivo, pero la entrega de valores sensibles quedo pendiente por canal seguro externo.
- Se abrio Web staging `/app` en navegador interno.
- Se confirmo que no hay sesion staging activa en navegador interno: `/app` redirige a `/login`.
- Se abrio `/admin-companies` en navegador interno.
- Se confirmo que no hay token admin staging cargado en UI: la pantalla solicita `Token interno` y no carga empresas.
- Se confirmo que no se ejecutaron compras, canjes, campanas, envios reales, migraciones, limpiezas ni cambios de datos.
- Se confirmo que no se expusieron passwords, tokens, cookies ni secretos en evidencia.

Hallazgos:
- `/app` staging muestra `Sesion no iniciada` y formulario `ACCESO DE EMPRESA`.
- `/admin-companies` staging muestra panel interno, solicita token y mensaje `Ingresa el token interno para cargar empresas por activar`.
- No hay evidencia de sesion QA staging ni token admin staging disponible para ejecutar el alcance positivo de TASK-882.
- TASK-881 indica que los accesos deben entregarse por canal seguro externo; no estan disponibles en el repo ni en el chat, correctamente por politica de secretos.

P0/P1:
- Sin P0/P1 de producto confirmados en esta revalidacion.
- Bloqueo de cobertura: no se pudo validar login/logout positivo, refresh autenticado de `/app`, Mi empresa solo lectura, Reportes solo lectura, Comunicaciones autenticado sin envio, ni admin empresas positivo solo lectura por falta de sesion QA/token staging en navegador o canal seguro.

P2/P3:
- P2: staging phase 1 sigue apuntando temporalmente a SQL productiva segun TASK-877/TASK-881; cualquier prueba autenticada con escritura debe permanecer bloqueada salvo alcance explicitamente aprobado.
- P2: no hay marca visual `STAGING` en la UI, riesgo ya identificado en TASK-880.

Evidencia:
- Navegador `/app` -> URL final `https://calm-coast-0fabaec0f.7.azurestaticapps.net/login`; visible `Sesion no iniciada`, `ACCESO DE EMPRESA`, campos `Correo` y `Contrasena`.
- Navegador `/admin-companies` -> visible `Panel interno`, `Acceso interno temporal`, `Token interno`, `Ingresa el token interno para cargar empresas por activar`.
- TASK-881 confirma flags seguros de staging:
  - `PROMOTIONAL_EMAIL_SEND_ENABLED=false`
  - `COMPANY_REGISTRATION_REVIEW_ENABLED=false`
  - `COMPANY_INVITATION_MANAGEMENT_ENABLED=false`
  - `COMPANY_PASSWORD_RESET_ENABLED=false`
  - ACS Email sin connection string/senders configurados.

Uso DB cloud: No directo en esta tarea. Se abrio Web staging y se validaron estados visibles sin sesion. No se ejecutaron endpoints autenticados ni escrituras. Staging phase 1 permanece configurado con SQL productiva temporal segun handoffs previos.

Riesgos o pendientes:
- Requiere que Product Owner/Infra inicie sesion QA staging en el navegador interno o entregue usuario/password por canal seguro externo, sin pegarlos en chat.
- Requiere `INTERNAL_ADMIN_TOKEN` staging por canal seguro externo para validar admin positivo solo lectura.
- Pendiente validar: login/logout, refresh de `/app`, Mi empresa solo lectura, Reportes solo lectura, Comunicaciones sin envio real, admin empresas positivo solo lectura.
- Mantener prohibido ejecutar compras/canjes/campanas reales mientras staging use SQL productiva, salvo aprobacion explicita y datos QA controlados.

Siguiente recomendado:
- Product Owner puede abrir la sesion QA staging en el navegador interno y avisar `sesion lista`, sin compartir credenciales.
- Infra/PO puede cargar el token staging directamente en la UI o entregarlo por canal seguro externo; QA no debe recibirlo por chat ni guardarlo en archivos.
- Reintentar TASK-882 una vez exista sesion/token disponible, manteniendo alcance read-only y sin envios reales.
