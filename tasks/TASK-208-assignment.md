# TASK-208 - Revalidar panel interno de empresas publicado

Equipo responsable: QA

## Contexto

TASK-204 quedo no aprobado porque API/Web publicados no contenian los cambios locales de TASK-201/TASK-203.

Esta revalidacion depende de:

- TASK-205: API publicada con endpoint de listado interno.
- TASK-206: Web publicada con panel `Admin empresas`.
- TASK-207: evidencia PO si se requiere token real para flujo positivo.

## Objetivo

Cerrar QA del panel interno de administracion de empresas publicado, validando negativos, seguridad y evidencia positiva sin secretos.

## Alcance

- Leer handoffs TASK-205, TASK-206 y TASK-207 si existe.
- Validar publicado sin token y con token sintetico invalido:
  - listado interno protegido con `403`;
  - approve/reject/resend protegidos con `403`.
- Confirmar que la Web publicada contiene el panel admin y no persiste token en `localStorage`/`sessionStorage`.
- Confirmar que no se muestran token raw, hash, link completo de invitacion, cookies, passwords ni secretos.
- Si QA no usa token real, revisar evidencia redaccionada de TASK-207 para cerrar flujo positivo.
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
- Riesgos o pendientes.
