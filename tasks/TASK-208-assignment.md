# TASK-208 - Revalidar panel interno de empresas publicado

Equipo responsable: QA

## Contexto

TASK-204 quedo no aprobado porque API/Web publicados no contenian los cambios locales de TASK-201/TASK-203.

Desde entonces:

- TASK-205 aprobo que la API publicada ya contiene `GET /api/company-registration-requests` y responde `403` sin token/token sintetico.
- TASK-206 aprobo que la Web publicada ya contiene `Admin empresas`, usa `x-puntoclub-admin-token` como header y no usa `localStorage`/`sessionStorage`.
- TASK-207 queda diferida por decision Product Owner. Se asume OK para no frenar y la prueba completa con token real se hara despues.

## Objetivo

Cerrar QA del panel interno de administracion de empresas publicado validando publicacion, negativos, seguridad y regresion basica sin depender de PO Test.

## Alcance

- Leer handoffs TASK-205 y TASK-206.
- Validar publicado sin token y con token sintetico invalido:
  - listado interno protegido con `403`;
  - approve/reject/resend protegidos con `403`.
- Confirmar que la Web publicada contiene el panel admin y no persiste token en `localStorage`/`sessionStorage`.
- Confirmar que no se muestran token raw, hash, link completo de invitacion, cookies, passwords ni secretos.
- No usar token interno real en esta tarea, salvo que Product Owner lo entregue por canal seguro y pida expresamente validacion positiva.
- Si no hay token real, no bloquear por falta de flujo positivo: documentar como pendiente diferido para prueba completa posterior.
- Ejecutar regresion basica:
  - solicitud publica de empresa;
  - invitacion/crear acceso con token sintetico;
  - login/me sin sesion;
  - operacion autenticada protegida;
  - Mi empresa/logo protegido.

## Entregable

Crear o actualizar `tasks/TASK-208-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendiente diferido de flujo positivo con token real, si aplica.
