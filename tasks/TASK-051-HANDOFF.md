Equipo: QA

Tarea completada: TASK-051 - Validar flujo publicado cliente + compra + redencion

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-05
- Navegador: Chrome headless/CDP contra la URL publicada.

Resultado:
- No aprobado.
- La URL publicada todavia no refleja TASK-050.
- No queda listo para PO Test del flujo cliente + compra + redencion.

Archivos cambiados:
- `tasks/TASK-051-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-051-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Revisado `tasks/TASK-050-assignment.md` y `tasks/TASK-050-HANDOFF.md`.
- Validado JS publicado:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/app.js`
- Ejecutada revision de navegador real desktop y mobile contra la URL publicada.

Checks ejecutados:
- JS publicado:
  - `StatusCode = 200`;
  - no contiene `redemption-form`;
  - no contiene accion `data-action="redemption"`;
  - no contiene texto `Redimir puntos`;
  - no contiene integracion `createRedemption`;
  - si contiene `purchase-form`;
  - no contiene `loadCustomers("")`.
- Desktop `1366x900`:
  - fuente `API real`;
  - carga inicial sin clientes automaticos;
  - `purchase-form` existe;
  - `redemption-form` no existe;
  - texto `Redimir puntos` no existe;
  - sin overflow horizontal en carga inicial.
- Mobile `390x780`:
  - fuente `API real`;
  - carga inicial sin clientes automaticos;
  - busqueda `QA` devolvio 15 clientes;
  - primera tarjeta mostro puntos visibles y boton `Registrar compra`;
  - no mostro boton `Redimir puntos`;
  - `redemption-form` no existe;
  - sin overflow horizontal.

Hallazgos:

P0/P1:
- P1: La URL publicada no incluye el flujo de redencion/canje de puntos de TASK-050.
  - Pasos reproducibles:
    1. Abrir `https://calm-dune-075dc5c0f.7.azurestaticapps.net`.
    2. Confirmar que la pantalla muestra `API real`.
    3. Buscar `QA`.
    4. Observar que las tarjetas muestran `Puntos` y `Registrar compra`.
    5. Observar que no existe boton `Redimir puntos`.
    6. Observar que no existe panel/formulario de canje.
  - Evidencia tecnica:
    - `src/app.js` publicado no contiene `redemption-form`.
    - `src/app.js` publicado no contiene `data-action="redemption"`.
    - `src/app.js` publicado no contiene `Redimir puntos`.
    - `src/app.js` publicado no contiene `createRedemption`.
  - Impacto:
    - Bloquea redimir puntos validos.
    - Bloquea confirmar saldo actualizado despues de redimir.
    - Bloquea validar saldo insuficiente.
    - Bloquea validar errores de redencion.
    - Bloquea el objetivo central de TASK-051.

P2/P3:
- Ninguno adicional. Las validaciones de redencion no se pudieron ejecutar porque el formulario no esta publicado.

Evidencia:
- La URL publicada conserva el flujo de compra de TASK-049: tarjetas con puntos visibles y boton `Registrar compra`.
- La URL publicada no muestra ningun elemento de redencion esperado por TASK-050.
- En mobile, la busqueda `QA` devolvio clientes reales y el primer resultado fue:
  - `QA Smoke 1780430104689`
  - `Puntos 173`
  - accion visible `Registrar compra`
  - sin accion `Redimir puntos`.

Riesgos o pendientes:
- No se crearon clientes, compras ni redenciones durante TASK-051 porque el frontend publicado no tiene el flujo de redencion.
- Se requiere commit/deploy real de TASK-050 a Static Web Apps antes de repetir QA.
- No se validaron redenciones por API directa; el alcance de TASK-051 es el flujo publicado de UI.

Siguiente recomendado:
- Web Dev / Infra debe confirmar que los cambios de TASK-050 fueron subidos y desplegados en Static Web Apps.
- Repetir TASK-051 cuando el JS publicado contenga `redemption-form`, `data-action="redemption"` y `createRedemption`.
