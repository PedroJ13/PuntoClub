# TASK-876 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Staging / Release policy
Fecha: 2026-07-09

## Estado

Completada.

No se crearon recursos, no se cambio configuracion, no se cambio codigo, no se uso Azure SQL y no se enviaron correos.

## Insumos revisados

- `AGENTS.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/STAGING_ENVIRONMENT_PHASE1.md`
- `tasks/TASK-872-HANDOFF.md`
- `tasks/TASK-873-HANDOFF.md`
- `tasks/TASK-874-HANDOFF.md`
- `tasks/TASK-875-HANDOFF.md`

## Decision

Se aprueba la politica inicial de promocion staging -> produccion para Punto Club phase 1.

Staging phase 1 sera un ambiente obligatorio de validacion Web/API para cambios de riesgo antes de publicar a produccion. En esta fase se duplican Web y API, se separan app settings y se mantiene SQL productiva solo bajo guardrails estrictos. SQL staging queda como phase 2.

## Cambios que requieren staging obligatorio

Antes de produccion deben pasar por staging:

- Auth, login, logout, sesiones, cookies, CORS, dominios API/Web o `app-config.js`.
- Admin interno, tokens internos, invitaciones, reset de password y aprobacion de empresas.
- Campanas, correos, remitentes, ACS, pacing, reintentos, historial de envios o cualquier flujo que pueda enviar email.
- Cambios que escriben datos: clientes, compras, canjes, puntos, membresias, beneficios, reportes o KPIs.
- Cambios API contractuales, validadores, permisos, multiempresa o aislamiento por `companyId`.
- Cambios de Storage/logo/assets privados.
- Cambios de app settings, feature flags, secretos, workflows de deploy o infraestructura.
- Cambios SQL o migraciones. Nota: staging phase 1 no valida migraciones de forma suficiente; estas siguen requiriendo proceso SQL productivo separado hasta phase 2.

## Cambios que pueden saltar staging con decision explicita

Pueden ir de local/QA local a produccion solo si Product / Architect / Release lo autoriza explicitamente:

- Copy menor sin cambio de comportamiento.
- Ajuste visual pequeno sin API ni persistencia.
- Correccion de CSS/layout sin tocar auth, datos, campanas, correos ni rutas criticas.
- Documentacion, handoffs o scripts no ejecutados.

Aunque salten staging, requieren smoke publicado corto despues del deploy.

## Aprobacion para pasar a produccion

La promocion a produccion requiere:

1. Handoff del equipo implementador.
2. QA staging aprobado, salvo excepcion documentada para cambios menores.
3. Decision de Product / Architect / Release.
4. Aprobacion PO Test cuando el cambio afecte flujo visible, campanas reales, registro de empresas, login o datos operativos sensibles.
5. Confirmacion de que no hay P0/P1 abiertos.

Si hay P2, Product / Architect / Release decide si se publica con riesgo aceptado o si se corrige antes.

## Smoke minimo en staging

Antes de autorizar produccion:

- Confirmar URL Web staging y API staging.
- Confirmar que Web staging consume API staging, no API productiva.
- Confirmar `/api/me` sin sesion con 401 controlado.
- Login/logout con empresa/cuenta QA autorizada.
- Refresh de `/app` con sesion activa.
- Ruta publica `/`, `/company-registration`, `/company-invitations/accept`, `/company-password-reset` y `/admin-companies`.
- Verificar CORS/cookies con `credentials`.
- Confirmar que correos/campanas reales estan bloqueados, mockeados o autorizados explicitamente.
- Confirmar que no se ejecutaron migraciones, limpiezas ni pruebas masivas.

Si staging apunta temporalmente a SQL productiva, cualquier prueba con escritura debe usar datos QA controlados y quedar documentada.

## Smoke minimo post-produccion

Despues de publicar a produccion:

- Confirmar home/producto.
- Confirmar `app-config.js` productivo apunta a `https://api.puntoclubcr.com`.
- Confirmar login/logout con cuenta autorizada.
- Confirmar `/app` y menu principal.
- Confirmar el modulo afectado por el release.
- Confirmar que no hay llamadas a API staging.
- Confirmar que no se habilitaron correos/campanas reales salvo decision explicita.
- Confirmar workflows GitHub relevantes en success.

## Rollback esperado

Cada release debe registrar:

- Commit/tag ultimo bueno o workflow anterior estable.
- Archivos/app settings cambiados.
- Workflows ejecutados y resultado.
- Si hubo migracion SQL o no.
- Si hubo datos QA creados y si requieren limpieza.

Rollback Web:

- Revertir o redeployar ultimo commit bueno de Web.
- Verificar `app-config.js` y assets.

Rollback API:

- Redeployar paquete/commit API anterior estable.
- Revisar app settings si fueron cambiados.

Rollback app settings:

- Restaurar valores previos documentados.
- No exponer secretos en handoffs.

Rollback SQL:

- No se improvisa. Toda migracion SQL debe tener plan propio, evidencia previa y decision SQL DEV/Product.
- Mientras phase 1 no tenga SQL staging, las migraciones siguen fuera del smoke normal de staging.

## Guardrails de staging phase 1

- No usar secrets productivos como si fueran staging.
- `INTERNAL_ADMIN_TOKEN` staging debe ser distinto al productivo.
- Cookie de sesion staging debe tener nombre distinto al productivo.
- No usar wildcard CORS con credentials.
- `PROMOTIONAL_EMAIL_SEND_ENABLED=false` por defecto.
- Correos operativos/promocionales deshabilitados o restringidos por decision explicita.
- No ejecutar `npm run smoke` contra staging si apunta a SQL productiva, porque crea datos.
- No pruebas de carga.
- No limpiezas de datos desde staging.
- No aprobar/reemitir invitaciones reales desde staging sin decision explicita.

## Criterio para avanzar a phase 2 con SQL staging

Se debe avanzar a phase 2 y crear SQL staging separada antes de:

- Probar migraciones de schema.
- Ejecutar QA repetitivo que cree/modifique datos.
- Probar importaciones legacy o cargas masivas.
- Probar campanas/correos con volumen.
- Hacer pruebas de carga/performance.
- Validar cambios de puntos, compras, canjes o membresias con escenarios amplios.
- Permitir pruebas frecuentes de PO/QA sin riesgo sobre datos productivos.

Phase 2 debe usar schema separado, datos falsos o redaccionados, y plan de costos aprobado.

## Riesgos aceptados

- Staging phase 1 reduce riesgo de Web/API/configuracion, pero no elimina riesgo de datos si API staging apunta a SQL productiva.
- No valida migraciones SQL de forma segura.
- No sustituye QA publicada final.
- Requiere disciplina de flags para no enviar correos reales desde staging.

## Siguiente recomendado

Crear una tarea Infra para aplicar phase 1 de staging con recursos separados, URLs temporales, settings separados y correos/campanas bloqueados por defecto.

Despues de Infra, crear tareas focales para:

- Backend/API: smoke seguro y settings staging definitivos.
- Web Dev: publicar Web staging apuntando a API staging.
- QA: ejecutar checklist staging phase 1.
- Product / Architect / Release: decidir si staging queda listo para ser puerta obligatoria de releases.

## Uso Azure SQL

No se uso Azure SQL en esta tarea.

## Secretos

No se leyeron, copiaron ni expusieron secretos.
