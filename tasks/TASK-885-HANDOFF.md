# TASK-885 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Staging / Release closure
Fecha: 2026-07-09

## Estado

Completada.

Staging phase 1 queda aprobado como puerta inicial Web/API antes de produccion, con restricciones documentadas.

No se crearon recursos, no se cambio configuracion, no se cambio codigo, no se uso Azure SQL directamente y no se enviaron correos.

## Insumos revisados

- `tasks/TASK-883-HANDOFF.md`
- `tasks/TASK-884-HANDOFF.md`

## Decision

Se aprueba staging phase 1 como puerta inicial para validar:

- Web staging publicada.
- API staging publicada.
- `app-config.js` apuntando a API staging.
- Rutas publicas y fallback SPA.
- Auth basica con login asistido por PO.
- Persistencia de sesion al refrescar `/app`.
- Logout.
- CORS/cookies basicos.
- Mi empresa en modo lectura.
- Reportes en modo lectura.
- Comunicaciones en modo lectura sin envio real.

Staging phase 1 no queda aprobado como ambiente completo de QA de datos, porque aun usa SQL productiva temporalmente.

## Ambiente aprobado

Web staging:

```txt
https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

API staging:

```txt
https://func-puntoclub-stg-br-001.azurewebsites.net/api
```

Config Web staging esperada:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "6";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

## Restricciones obligatorias

Mientras no exista SQL staging phase 2:

- Staging debe operar read-only por defecto.
- No ejecutar compras, canjes, campanas, envios, membresias, limpiezas, migraciones ni pruebas masivas salvo tarea explicita.
- Toda escritura aprobada debe usar datos `QA-STAGING-*` o empresa/cuenta QA controlada.
- Correos/campanas reales deben permanecer bloqueados por defecto.
- No ejecutar `npm run smoke` contra staging porque crea cliente, compra y canje.
- No exponer credenciales, tokens, cookies ni secretos en handoffs.

## Observaciones aceptadas

P2 aceptados para phase 1:

- Staging usa SQL productiva temporalmente.
- Admin empresas positivo queda pendiente hasta cargar `INTERNAL_ADMIN_TOKEN` staging por canal seguro.
- Mi empresa > Logo muestra `Logo configurado, pero no pudimos cargar la imagen` en staging.
- No hay marca visual `STAGING`.
- No existe workflow formal de deploy staging; el deploy Web staging fue manual desde copia temporal.
- No existe endpoint `/api/health` sin SQL.
- No existe flag global unico de bloqueo de emails staging.

## Politica de uso inmediata

Staging phase 1 debe usarse antes de produccion para:

- Cambios Web/API que puedan romper rutas, login, sesion, CORS/cookies o app-config.
- Cambios de UI que requieran validacion integrada con API.
- Cambios de API que puedan validarse con smoke seguro o lectura autenticada.
- Validacion previa de release sin tocar produccion.

Staging phase 1 no debe usarse para:

- Validar migraciones SQL.
- QA masiva de datos.
- Pruebas de carga.
- Campanas/correos reales.
- Limpieza de datos.
- Importaciones legacy.

## Tareas siguientes recomendadas

1. Infra/Web: formalizar workflow de deploy staging y generacion de `app-config.js` por ambiente.
2. Web Dev: agregar marca visual discreta `STAGING` solo en ambiente staging.
3. Infra/Web: revisar comportamiento de logo en staging y decidir si se usa container staging, fallback controlado o lectura productiva solo read-only.
4. Backend/API: agregar `GET /api/health` sin SQL.
5. Backend/API: agregar flag global de bloqueo de emails en staging, por ejemplo `EMAIL_SEND_MODE=disabled`.
6. Product/Infra/SQL DEV: planear phase 2 con SQL staging separada antes de QA de datos, migraciones o importaciones.

## Cierre

Staging phase 1 queda disponible como ambiente intermedio de validacion Web/API con alcance controlado.

La puerta de release queda activa para cambios de riesgo Web/API, pero cualquier release que toque SQL, datos reales, correos/campanas o escritura operativa debe seguir requiriendo decision explicita y/o phase 2.

## Uso Azure SQL

No se uso Azure SQL directamente en esta tarea.

La validacion autenticada de TASK-884 uso Web/API staging contra SQL productiva de forma indirecta y read-only, segun phase 1.

## Secretos

No se leyeron, copiaron ni expusieron secretos.
