# TASK-176 - Confirmar deploy API de fix login/cookie

Equipo responsable: Backend API

## Contexto

TASK-172 corrigio localmente:

- cache de conexion SQL fallida en `getPool()`;
- mapeo de errores SQL transitorios a `503 SERVICE_UNAVAILABLE`;
- cookie de sesion productiva `SameSite=None; Secure`.

Pruebas locales Backend: 82/82 pass. Falta confirmar deploy publicado.

## Objetivo

Confirmar que API publicada ya contiene el fix de TASK-172.

## Checks requeridos

- Verificar workflow/deploy API posterior al commit que incluya TASK-172.
- Validar `POST /api/company-auth/login` con credenciales invalidas:
  - esperado con DB disponible: `401 UNAUTHORIZED` controlado;
  - esperado si SQL no disponible: `503 SERVICE_UNAVAILABLE` controlado, no timeout/500.
- Validar `POST /api/company-auth/logout` sin sesion:
  - `200` y `Set-Cookie` con estrategia esperada en publicado.
- Validar que cookie de limpieza/sesion publicada usa `SameSite=None; Secure` cuando aplique.

## Seguridad

- No usar password real.
- No pegar cookie completa si contiene valores sensibles; si se documenta, redaccionar valor.
- No usar token real de invitacion.
- No imprimir secretos.

## Entregable

Crear o actualizar `tasks/TASK-176-HANDOFF.md` con resultado, evidencia redaccionada y pendientes.
