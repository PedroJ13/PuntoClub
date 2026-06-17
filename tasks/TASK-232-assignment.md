# TASK-232 - Revalidar ajustes visuales publicados de empresa y admin

Equipo responsable: QA

## Contexto

TASK-229 no aprobo porque API/Web publicados no contenian los cambios de TASK-225/TASK-226/TASK-227/TASK-228.

TASK-230 y TASK-231 deben confirmar deploy publicado.

## Objetivo

Revalidar en publicado los ajustes visuales y de flujo de registro de empresa, admin interno y logo/identidad visual.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-229-HANDOFF.md`, `tasks/TASK-230-HANDOFF.md` y `tasks/TASK-231-HANDOFF.md`.
- Validar en publicado:
  - `/company-registration` abre registro publico directamente;
  - solicitud con y sin logo funciona segun contrato;
  - despues de registrar, el formulario no queda visible por defecto;
  - mensajes/copy visuales mejorados aparecen;
  - correos relevantes tienen formato/texto actualizado segun evidencia segura;
  - `Admin empresas` esta separado visualmente;
  - token interno colapsa cuando esta activo;
  - aprobar existe desde resumen y detalle;
  - detalle abre como drawer/panel derecho;
  - confirmacion de aprobacion es in-app, no nativa del navegador;
  - logo/fallback aparece en operacion de empresa activa;
  - no se exponen tokens, passwords, cookies, hashes ni links tokenizados.
- Ejecutar regresion corta publicada:
  - login empresa o evidencia PO redaccionada;
  - cliente/compra/redencion si hay sesion real disponible;
  - negativos sin token/sin sesion.

## Entregable

Crear o actualizar `tasks/TASK-232-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Regresion ejecutada.
- Riesgos o pendientes.
