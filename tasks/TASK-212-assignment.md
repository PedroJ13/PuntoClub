# TASK-212 - Revalidar login exitoso despues del deploy Web

Equipo responsable: QA

## Contexto

TASK-210 no aprobo porque el fix de TASK-209 no estaba publicado y faltaba evidencia positiva segura. TASK-211 debe confirmar deploy del fix Web.

## Objetivo

Revalidar en publicado que el login exitoso o una sesion activa llevan al panel operativo y no dejan al usuario atrapado en `/login`.

## Alcance

- Leer `tasks/TASK-211-HANDOFF.md`.
- Confirmar que el bundle publicado contiene el fix `showMainApp`.
- Validar con cuenta real solo si Product Owner entrega credenciales por canal seguro o aporta evidencia redaccionada.
- Si QA no tiene credenciales reales, validar negativos y aceptar evidencia PO redaccionada para el positivo:
  - login exitoso lleva a Operaciones/panel principal;
  - refresh con sesion activa conserva acceso al panel;
  - logout vuelve a login.
- Regresion segura:
  - `/api/me` sin sesion responde `401`;
  - operaciones privadas siguen protegidas sin sesion;
  - solicitud publica de empresa sigue disponible;
  - pantalla de invitacion sigue renderizando.
- No registrar passwords, cookies, tokens ni secretos.

## Entregable

Crear o actualizar `tasks/TASK-212-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
