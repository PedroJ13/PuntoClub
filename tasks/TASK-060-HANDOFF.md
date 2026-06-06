Equipo: QA

Tarea completada: TASK-060 - Revalidar UI publicada con menu lateral de paneles despues del deploy

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API usada por frontend: API real
- Fecha QA: 2026-06-05
- Navegador: Chrome headless/CDP contra la URL publicada.

Resultado:
- Aprobado.
- La URL publicada ya refleja TASK-058.
- No hay P0/P1 abiertos para el flujo con menu/paneles cubierto por esta tarea.
- Listo para PO Test del flujo cliente + compra + redencion con navegacion por paneles.

Archivos cambiados:
- `tasks/TASK-060-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-060-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Revisado `tasks/TASK-058-HANDOFF.md`.
- Revisado `tasks/TASK-059-HANDOFF.md`.
- Validado HTML/JS publicado.
- Ejecutada prueba real de navegador desktop contra la URL publicada.
- Ejecutada prueba real de navegador mobile basica contra la URL publicada.

Checks ejecutados:
- HTML/JS publicado:
  - `index.html` respondio `200`;
  - `src/app.js` respondio `200`;
  - contiene `data-panel`;
  - contiene logica de panel activo;
  - contiene `aria-pressed`;
  - contiene `Ir a redimir puntos`;
  - contiene labels `Registrar cliente`, `Registrar compra`, `Redimir puntos`.
- Desktop `1366x900` carga inicial:
  - fuente `API real`;
  - boton activo `Registrar cliente`;
  - `aria-pressed="true"` en `Registrar cliente`;
  - `aria-pressed="false"` en `Registrar compra` y `Redimir puntos`;
  - panel visible unico: `customer`;
  - paneles `purchase` y `redemption` ocultos;
  - `0` filas de clientes al abrir;
  - texto inicial `Busque por telefono, nombre o email para atender al cliente.`;
  - sin overflow horizontal.
- Registrar cliente nuevo:
  - cliente creado: `Task 060 Cliente 01925779`;
  - telefono: `+50601925779`;
  - email: `task060-01925779@example.com`;
  - mensaje visible: `Cliente registrado: Task 060 Cliente 01925779. Puede registrar compra desde el menu.`;
  - panel activo se mantiene en `Registrar cliente`;
  - panel visible unico: `customer`;
  - paneles de compra/redencion no quedan visibles/apilados;
  - cliente queda en lista con `Puntos 0`.
- Cliente duplicado:
  - se intento registrar otra vez el mismo cliente;
  - mensaje visible: `Ya existe un cliente con ese telefono o email. Abrimos su registro de compra.`;
  - cliente existente seleccionado;
  - cambio automatico a `Registrar compra`;
  - panel visible unico: `purchase`;
  - formulario de compra visible;
  - foco en `purchase-invoice-number`;
  - puntos actuales `0`.
- Registrar compra:
  - factura: `T060-P-01925779`;
  - monto: `2000`;
  - mensaje visible: `Compra registrada. Puntos ganados: 100.`;
  - panel activo sigue `Registrar compra`;
  - panel visible unico: `purchase`;
  - puntos actuales `100`;
  - boton/accion `Ir a redimir puntos` existe.
- Ir a redimir puntos desde compra:
  - al usar `Ir a redimir puntos`, boton activo cambia a `Redimir puntos`;
  - panel visible unico: `redemption`;
  - formulario de redencion visible;
  - foco en `redemption-points`;
  - cliente seleccionado se conserva;
  - puntos actuales `100`.
- Redimir puntos:
  - puntos redimidos: `25`;
  - nota: `Canje QA TASK-060`;
  - mensaje visible: `Canje registrado. Puntos redimidos: 25.`;
  - panel activo sigue `Redimir puntos`;
  - saldo visible actualizado a `Puntos actuales 75`;
  - fila del cliente actualizada a `Puntos 75`.
- Mobile `390x780`:
  - fuente `API real`;
  - control superior/tabs visibles con las tres opciones;
  - los tres botones aparecen en la misma zona superior;
  - default `Registrar cliente`;
  - panel visible unico inicial: `customer`;
  - al seleccionar `Registrar compra`, panel visible unico: `purchase`;
  - al seleccionar `Redimir puntos`, panel visible unico: `redemption`;
  - sin overflow horizontal.

Hallazgos:

P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo observado en el alcance de TASK-060.

Evidencia:
- La publicacion ya no reproduce el P1 de TASK-059: existe navegacion por paneles con `aria-pressed` y `data-panel`.
- Solo queda un panel operativo visible por vez:
  - inicial: `customer`;
  - duplicado/compra: `purchase`;
  - redencion: `redemption`.
- El usuario no necesita buscar compra/redencion entre formularios apilados; el cambio de panel es explicito por menu/tabs.
- Compra y redencion siguen funcionando contra API real con el cliente `Task 060 Cliente 01925779`.

Riesgos o pendientes:
- La prueba crea datos reales de QA en la empresa piloto; el cliente, compra y canje quedan como evidencia funcional.
- No se cambiaron codigo, Azure ni secretos.

Siguiente recomendado:
- Product / Architect / Release puede procesar este handoff y habilitar PO Test del flujo cliente + compra + redencion con menu/paneles en la URL publicada.
