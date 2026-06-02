Equipo:
Backend/API

Tarea completada:
TASK-017 - Preparacion API local completada; ejecucion contra Azure SQL existente queda bloqueada por falta de conexion segura configurada.

Archivos cambiados:
- api/package-lock.json
- api/node_modules/ *(local, ignorado por git)*
- api/package.json
- api/README.md
- api/scripts/smoke-test.js
- tasks/TASK-017-HANDOFF.md

Verificacion ejecutada:
- `npm install` dentro de `api/`: dependencias instaladas, 0 vulnerabilidades reportadas.
- `npm test`: 7 pruebas pasaron.
- Comprobada presencia de variables sin imprimir valores:
  - `SQL_CONNECTION_STRING`: no presente en el entorno actual.
  - `PILOT_COMPANY_ID`: no presente en el entorno actual.
- No se ejecuto `database/schema.sql` ni `database/seed.sql` contra Azure SQL porque TASK-016 no entrega credencial/connection string y no se deben guardar secretos.
- No se ejecuto `npm run smoke` porque no hay API levantada con conexion SQL real.
- No se levanto API contra SQL real porque falta `SQL_CONNECTION_STRING`.

Resultado:
API local queda preparada para ambiente QA en cuanto se configure conexion segura:
- Dependencias instaladas.
- Comandos documentados en `api/README.md`.
- Smoke test HTTP agregado con `npm run smoke`.

Comandos de prueba sin secretos:
```powershell
cd api
npm test
```

Cuando existan `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID=1`:
```powershell
cd api
npm start
```

En otra terminal, con la API corriendo:
```powershell
cd api
$env:API_BASE_URL="http://localhost:7071/api"
$env:PILOT_COMPANY_ID="1"
npm run smoke
```

Riesgos o pendientes:
- Bloqueado para SQL real hasta que se configure `SQL_CONNECTION_STRING` de forma segura o el usuario entregue una forma interactiva aprobada para conectarse.
- Falta confirmacion explicita para aplicar `database/schema.sql` y `database/seed.sql` en `sql-db-puntoclub`.
- Falta crear/usar usuario runtime SQL con permisos minimos.
- Falta instalar/verificar Azure Functions Core Tools si se va a levantar local con `func start`.
- No se debe commitear `local.settings.json`, connection strings ni passwords.

Siguiente recomendado:
Product/Infra debe autorizar y ejecutar una de estas rutas:
1. Configurar `api/local.settings.json` localmente con `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID=1`, sin commitearlo.
2. Pasar una sesion/terminal ya configurada con esas variables.
3. Aplicar schema/seed desde Azure Data Studio, SSMS o `sqlcmd` con credencial operator/admin temporal.

Luego Backend/API puede levantar `npm start` y ejecutar `npm run smoke` para entregar URL local verificable a QA.
