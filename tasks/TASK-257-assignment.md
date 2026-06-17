# TASK-257 - Implementar UI para activar membresia a cliente

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

TASK-256 implementa API para activar y consultar membresias de cliente.

Esta tarea agrega la experiencia Web para activar membresia a un cliente desde la seccion `Membresias`.

No incluye registrar usos de beneficios todavia.

## Objetivo

Permitir que una empresa active una membresia a un cliente desde la Web publicada.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-243-HANDOFF.md`, `tasks/TASK-248-HANDOFF.md` y `tasks/TASK-256-HANDOFF.md`.
- En `Membresias`, agregar flujo `Activar membresia`:
  - buscar/seleccionar cliente existente usando patrones ya existentes;
  - seleccionar plan activo;
  - mostrar duracion, precio y fecha de vencimiento calculada o esperada;
  - confirmar activacion;
  - mostrar estado exitoso `Membresia activada.`
- Mostrar membresias del cliente:
  - activa;
  - vencida;
  - cancelada si aparece en API.
- Mostrar alerta interna de vencimiento si API la devuelve.
- Si el cliente ya tiene membresia activa, mostrar error controlado.
- No registrar usos de beneficios todavia.
- No implementar correo de vencimiento.
- No romper operaciones de puntos, reportes, Mi empresa, login, registro de empresa ni admin separado.
- No usar `localStorage` ni `sessionStorage`.

## Entregable

Crear o actualizar `tasks/TASK-257-HANDOFF.md` con:

- Resultado.
- Pantallas/secciones agregadas.
- Integracion API.
- Estados validados.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA.
