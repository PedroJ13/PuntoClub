# TASK-421 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API

Tarea completada:
- API de cambio y reset de password publicada despues de la migracion SQL de TASK-420.
- El workflow oficial de API ejecuto tests, empaqueto y desplego Azure Functions correctamente.

Commit/push:
- Commit: `f7a0064` (`Publish company password reset flow`)
- Push: `main -> origin/main`

Workflow/run:
- Workflow: `Deploy Punto Club API`
- Run: `27959276135`
- URL: https://github.com/PedroJ13/PuntoClub/actions/runs/27959276135
- Resultado: `success`

Endpoints publicados:
- `POST /api/company-auth/password`
- `POST /api/company-password-resets`
- `GET /api/company-password-resets/validate`
- `POST /api/company-password-resets/complete`

Validacion publicada:
- `POST /api/company-auth/password` sin sesion real respondio `401 UNAUTHORIZED`.
- `POST /api/company-password-resets` con email invalido respondio `400 VALIDATION_ERROR`.
- `GET /api/company-password-resets/validate?token=<token-inexistente>` respondio `200` con `valid:false` y `reason:"invalid"`.
- `POST /api/company-password-resets/complete` con token inexistente respondio `404 PASSWORD_RESET_NOT_FOUND`.
- No se enviaron correos reales.
- No se cambiaron passwords reales.
- No se imprimieron tokens raw, passwords, hashes, cookies ni links completos.

Verificacion local previa:
- `node --check` en funciones/librerias principales de password.
- `node --check` en `app/src/app.js` y `app/src/customerApi.js`.
- `npm test` en `api/`: 137/137 tests pasando, incluyendo `test/company-password-resets.test.js`.

Datos sensibles expuestos: No

Uso DB cloud: Si, motivo: smoke publicado no destructivo contra Azure Functions y Azure SQL, alcance: validacion de endpoint de reset con token inexistente y respuestas negativas controladas.

Riesgos o pendientes:
- Validacion positiva con correo real y reset completo queda para QA/PO con evidencia segura si se requiere.
- GitHub Actions mostro advertencia no bloqueante sobre deprecacion de Node.js 20 en acciones usadas por terceros.

Siguiente recomendado:
- Ejecutar TASK-422 para confirmar Web publicada con login, reset, cambio de password en `Mi empresa` y accion admin reset.
