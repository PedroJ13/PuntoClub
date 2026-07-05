Equipo: QA
Tarea validada: TASK-746 - Validar subnavegacion local de campanas promocionales
Ambiente: Local/mock en `http://127.0.0.1:4188/login`, app servida desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Fecha/hora QA: 2026-07-02 17:54:06 -06:00.
Resultado: no aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md y tasks/TASK-745-HANDOFF.md.
- Nota de contexto: `tasks/TASK-746.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Revision focal de estructura:
  - `app/index.html`
  - `app/src/app.js`
  - `app/styles.css`
- Smoke local Playwright en desktop `1366x900`.
- Smoke responsive basico en mobile `390x844`.
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`

Hallazgos:
- P1: La subnavegacion local de Comunicaciones sigue mostrando solo tres opciones: `Enviar campañas`, `Clientes`, `Historial`. Falta el subnav requerido `Crear / actualizar campañas`.
- P1: El panel `Crear/Editar campaña` sigue dentro de la vista `Enviar campañas`, junto con el panel de envio, preview y seleccion de destinatarios. Esto mantiene mezclados los flujos que TASK-746/TASK-745 buscaban separar.
- P1: No existe boton visible `Ir a Enviar campañas` / `Enviar esta campaña` dentro de gestion de campanas porque la vista nueva no existe.

P0/P1:
- P1 abierto: falta el cuarto subnav `Crear / actualizar campañas`.
- P1 abierto: `Crear/Editar campaña` no fue movido fuera de `Enviar campañas`.
- P1 abierto: falta accion para navegar desde gestion a `Enviar campañas` con la campana creada/editada.

P2/P3:
- No evaluados; el alcance principal queda bloqueado por P1.

Evidencia:
- Desktop local:
  - tabs detectados:
    - `Enviar campañas` (`data-communication-view=send`);
    - `Clientes` (`data-communication-view=customers`);
    - `Historial` (`data-communication-view=history`).
  - no se detecto `Crear / actualizar campañas`.
  - paneles visibles al entrar en `Enviar campañas`:
    - `Crear/Editar campaña`;
    - `Enviar campañas`;
    - `Preview`;
    - `Seleccionar destinatarios`.
  - `hasGoToSendButton=false`.
- Mobile local `390x844`:
  - tabs detectados:
    - `Enviar campañas`;
    - `Clientes`;
    - `Historial`.
  - no se pudo validar comportamiento responsive del cuarto tab porque no existe.
- Sintaxis:
  - `node --check app/src/app.js` OK.
  - `node --check app/src/customerApi.js` OK.
- No se ejecutaron envios ni se tocaron flags.

Uso DB cloud: No

Riesgos o pendientes:
- No se validaron crear/editar, imagen, preview duplicado en gestion, boton hacia envio ni conservacion de seleccion porque la subnavegacion requerida no esta implementada.
- No se enviaron correos reales.
- Requiere tarea Web Dev de implementacion antes de reintentar QA.

Siguiente recomendado:
- Web Dev debe implementar la subnavegacion de cuatro vistas y mover `Crear/Editar campaña` a `Crear / actualizar campañas`, agregando preview propio y boton `Ir a Enviar campañas`. Luego repetir QA local con desktop/mobile.
