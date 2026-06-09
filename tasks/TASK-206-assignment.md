# TASK-206 - Confirmar deploy Web del panel interno de empresas

Equipo responsable: Web Dev

## Contexto

TASK-203 completo en codigo local el panel `Admin empresas`. QA TASK-204 no aprobo porque la Web publicada no contenia la seccion, funciones admin ni el header `x-puntoclub-admin-token`.

El token interno debe vivir solo en memoria de la pestana. No usar `localStorage` ni `sessionStorage`.

## Objetivo

Confirmar que la Web publicada contiene el panel interno de empresas y conserva las reglas de seguridad UX definidas en TASK-202/TASK-203.

## Alcance

- Confirmar deploy publicado de los cambios de TASK-203.
- Validar que el bundle publicado contiene:
  - seccion o copy `Admin empresas` o equivalente;
  - flujo `Acceso interno temporal` o equivalente;
  - funciones para listar, aprobar, rechazar y reenviar;
  - header `x-puntoclub-admin-token` enviado solo como header.
- Confirmar que no hay persistencia del token en `localStorage` ni `sessionStorage`.
- Confirmar que no se muestran tokens raw, hashes, links completos de invitacion, cookies ni passwords.
- No usar ni registrar el valor real del token interno.
- No implementar funcionalidad nueva salvo fix minimo si el deploy revela un problema del panel.

## Entregable

Crear o actualizar `tasks/TASK-206-HANDOFF.md` con:

- Resultado.
- URL publicada revisada.
- Checks ejecutados.
- Seguridad UX confirmada.
- P0/P1/P2/P3 o bloqueos.
