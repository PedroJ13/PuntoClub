# Tooling local

Comandos locales para QA visual, accesibilidad y copy de Punto Club.

## Requisitos

- Ejecutar desde la raiz del repo.
- Instalar dependencias con `npm install` si `node_modules/` no existe.
- No requiere Azure SQL, Azure cloud, API real ni datos reales.

## Comandos

```powershell
npm run copy:check
npm run test:e2e
npm run qa:check
npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/happy-movements.csv --scenario full_history --source-system synthetic --out tools/migration/output/happy
```

Comandos auxiliares:

```powershell
npm run test:e2e:list
npm run lint
npm run format:check
npm run stylelint
```

## Que valida

- `copy:check`: busca remanentes conocidos de copy/iconografia en `app/index.html` y `app/src/app.js`.
- `test:e2e`: levanta `app/` en `http://127.0.0.1:5173` y ejecuta smoke Playwright desktop/mobile.
- `test:e2e:raw`: ejecuta Playwright directamente; util para depurar configuracion, pero en Windows puede dejar el servidor vivo si el cierre del `webServer` se atasca.
- `migration:dry-run`: valida CSV legacy local, normaliza clientes/movimientos y genera archivos intermedios sin conectar con Azure SQL ni usar secretos.
- El smoke cubre home publica, registro de empresa, login y ruta anonima `/app`.
- Axe corre dentro del smoke para detectar problemas basicos de accesibilidad en rutas publicas.

## Limites

- No reemplaza QA manual visual ni lector de pantalla real.
- No valida flujos autenticados con datos reales.
- No bloquea deploy todavia; se usa como tooling local previo a QA.
- No debe despertar Azure SQL.
- La herramienta legacy soporta CSV en esta version. `.xlsx` se detecta y se rechaza con mensaje claro; convertir a CSV antes del dry-run.

## Artefactos

Playwright puede generar:

- `playwright-report/`
- `test-results/`
- `tools/migration/output/`

Ambos estan ignorados por Git.
