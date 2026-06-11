# TASK-210 - Handoff QA

Equipo: QA

Tarea validada: TASK-210 - Validar transicion despues de login exitoso

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Fecha QA: 2026-06-11

## Resultado

No aprobado / bloqueado por cambio no publicado y falta de evidencia positiva segura.

El bundle Web publicado no contiene el fix descrito en `tasks/TASK-209-HANDOFF.md`:

- No contiene `function showMainApp`.
- No se observa llamada a `showMainApp()` despues del login.
- No se observa transicion publicada que reemplace `/login` por `/` despues de entrar.
- No se observa `showMainApp()` en la hidratacion de `/api/me` para sesion activa.

Ademas, QA no recibio cuenta/password validos ni evidencia redaccionada de Product Owner para confirmar el flujo positivo de login exitoso. Por seguridad, QA no debe pedir ni registrar passwords, cookies ni tokens.

## Checks ejecutados

### Dependencia revisada

Se reviso `tasks/TASK-209-HANDOFF.md`.

Resumen relevante:

- Web Dev corrigio localmente la transicion posterior a login exitoso.
- Agrego `showMainApp()` para ocultar login/invitacion y mostrar panel principal.
- Login exitoso debe activar `Operaciones`, limpiar password y reemplazar `/login` por `/`.
- Si `/api/me` devuelve sesion activa cargando `/login`, la UI debe pasar al panel principal.
- Pendiente QA publicado en TASK-210.

### Web publicada

Se revisaron:

- `/`
- `/login`
- `/company-invitations/accept?token=<synthetic-redacted>`
- `/src/app.js`

Resultado:

- `/` carga Punto Club.
- `/login` responde `200` y contiene pantalla/formulario de login.
- `/company-invitations/accept?token=<synthetic-redacted>` responde `200` y renderiza pantalla de invitacion.
- `/src/app.js` publicado no contiene `function showMainApp`.
- La rebanada publicada de login no contiene llamada a `showMainApp()`.
- La rebanada publicada de login no evidencia reemplazo de historia a `/` despues de login.
- La rebanada publicada de hidratacion de auth no contiene `showMainApp()`.
- No se observo uso de `localStorage` ni `sessionStorage`.

Resultado QA: no aprobado para el objetivo principal porque el fix de TASK-209 no parece estar publicado.

### API / regresion segura

- `GET /api/me` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- Endpoint operativo con cookie sintetica invalida:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- Solicitud publica de empresa con payload invalido:
  - Observado: `400 VALIDATION_ERROR`.
  - Resultado: aprobado como check negativo seguro.

- Invitacion/crear acceso con token sintetico:
  - `GET /api/company-invitations/validate?token=<synthetic-redacted>`
  - Observado: `200` con `valid=false`, `reason=invalid`.
  - Resultado: aprobado.

- Login invalido con cuenta sintetica:
  - Observado: `401 UNAUTHORIZED`.
  - Mensaje: `Invalid email or password.`
  - Resultado: aprobado como check negativo seguro.

- `Mi empresa` / logo sin sesion:
  - `GET /api/my-company/logo`
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

## No ejecutado

No se pudo ejecutar sin credenciales/evidencia segura:

- Login con correo/password valido.
- Transicion al panel operativo despues de login exitoso.
- Refresh con sesion activa.
- Cerrar sesion desde sesion real.
- Volver a login despues de logout.

## Hallazgos

### P1 - Fix de transicion post-login no esta publicado

El bundle publicado no contiene `showMainApp()` ni las llamadas esperadas por TASK-209 para salir de `/login` y mostrar el panel operativo.

Impacto: el hallazgo reportado por Product Owner no queda cerrado en ambiente publicado.

### P1 - Falta evidencia positiva segura de login exitoso publicado

QA no recibio cuenta/password validos ni evidencia PO redaccionada para validar login exitoso, transicion, refresh y logout/login.

Impacto: no se puede aprobar el flujo critico solicitado.

## P0/P1

- P1: El fix de transicion despues de login exitoso no aparece en el bundle publicado.
- P1: Falta evidencia positiva segura para cerrar el flujo de login exitoso en publicado.

## P2/P3

Ninguno nuevo.

## Evidencia redaccionada

- Bundle Web publicado:
  - `function showMainApp`: no encontrado.
  - llamada `showMainApp()` despues de login: no encontrada.
  - `showMainApp()` en hidratacion de `/api/me`: no encontrado.
  - `localStorage` / `sessionStorage`: no encontrados.

- Rutas publicadas:
  - `/`: carga Punto Club.
  - `/login`: `200`, pantalla de login presente.
  - `/company-invitations/accept?token=<synthetic-redacted>`: `200`, pantalla de invitacion presente.

- API/regresion:
  - `/api/me` sin sesion: `401`.
  - operacion con cookie sintetica invalida: `401`.
  - solicitud publica invalida: `400`.
  - invitacion con token sintetico: `valid=false`.
  - login invalido sintetico: `401`.
  - logo sin sesion: `401`.

## Riesgos o pendientes

- Web Dev debe publicar el cambio de TASK-209 o confirmar el deploy que contiene `showMainApp()`.
- Luego QA debe revalidar con cuenta de empresa o evidencia PO redaccionada:
  - login correcto;
  - transicion al panel operativo;
  - refresh con sesion activa;
  - logout;
  - regreso a login.

## Siguiente recomendado

Confirmar deploy Web de TASK-209 y reintentar TASK-210. Si QA no debe manejar credenciales, Product Owner puede aportar evidencia redaccionada sin password, cookie ni token.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token real.
- No se imprimieron secretos.
- Solo se usaron cuenta/token/cookie sinteticos para pruebas negativas.
