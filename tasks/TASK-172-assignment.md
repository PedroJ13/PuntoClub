# TASK-172 - Corregir login invalido y estrategia cookie cross-site

Equipo responsable: Backend API

## Contexto

TASK-171 encontro dos bloqueos publicados:

- `POST /api/company-auth/login` con credenciales invalidas tuvo timeout y luego `500 INTERNAL_ERROR`, en vez de `401 UNAUTHORIZED` controlado.
- La sesion real aun no puede aprobarse hasta confirmar una estrategia compatible entre Static Web Apps y Azure Functions.

La Web publicada y API publicada estan en dominios distintos:

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

## Objetivo

Diagnosticar y corregir el `500`/timeout de login invalido y confirmar si la cookie de sesion debe usar `SameSite=None; Secure` para funcionar con `fetch(..., credentials: "include")` entre dominios publicados.

## Alcance

- Revisar `tasks/TASK-169-HANDOFF.md`, `tasks/TASK-171-HANDOFF.md`.
- Revisar App Insights para `companyAuthLogin`, sin recuperar payloads sensibles.
- Corregir cualquier excepcion en `POST /api/company-auth/login` para credenciales invalidas.
- Revisar `buildSessionCookie` y `buildClearSessionCookie`.
- Si la estrategia publicada es cross-site con credentials, ajustar cookie a `SameSite=None; Secure` en produccion o documentar bloqueo si requiere decision de arquitectura/proxy.
- Ejecutar pruebas.
- No imprimir passwords, cookies, token de sesion ni payloads reales.

## Entregable

Crear o actualizar `tasks/TASK-172-HANDOFF.md` con:

- Resultado.
- Causa raiz del 500/timeout o diagnostico.
- Cambios realizados o bloqueo.
- Estrategia final de cookie para entorno publicado.
- Pruebas ejecutadas.
- Pendientes para Infra/Web/QA.
