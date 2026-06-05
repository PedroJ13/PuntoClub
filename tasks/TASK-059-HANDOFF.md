Equipo: QA

Tarea completada: TASK-059 - Validar UI publicada con menu lateral de paneles

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API usada por frontend: API real
- Fecha QA: 2026-06-05
- Navegador: Chrome headless/CDP contra la URL publicada.

Resultado:
- No aprobado.
- La URL publicada todavia no refleja la reorganizacion de TASK-058.
- No queda listo para PO Test del flujo con menu lateral/paneles.

Archivos cambiados:
- `tasks/TASK-059-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-059-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-058-assignment.md`.
- Leido `tasks/TASK-058-HANDOFF.md`.
- Revisado HTML/JS publicado.
- Ejecutada revision de navegador real desktop y mobile contra la URL publicada.

Checks ejecutados:
- HTML/JS publicado:
  - `index.html` respondio `200`;
  - `src/app.js` respondio `200`;
  - no se encontro evidencia de panel activo/navegacion por paneles;
  - no se encontro `Ir a redimir puntos`;
  - no se encontro logica publicada tipo `setActivePanel` / `activePanel`;
  - siguen existiendo secciones/paneles de compra y redencion como UI anterior.
- Desktop `1366x900`:
  - fuente `API real`;
  - carga inicial sin clientes automaticos;
  - formulario `Registrar cliente` visible;
  - `purchase-form` y `redemption-form` existen pero estan ocultos hasta seleccionar cliente;
  - no existe menu lateral o navegacion equivalente por paneles;
  - no hay botones/tabs visibles con `aria-pressed` o `data-panel`;
  - no existe boton/accion `Ir a redimir puntos`;
  - busqueda `QA` devolvio 18 clientes;
  - primera tarjeta mostro `Puntos`, `Registrar compra` y `Redimir puntos`;
  - no hay overflow horizontal.
- Mobile `390x780`:
  - fuente `API real`;
  - carga inicial sin clientes automaticos;
  - formulario `Registrar cliente` aparece abajo, con top aproximado `673px`;
  - no existe control superior/tabs de tres opciones;
  - no existe navegacion por paneles;
  - no existe boton/accion `Ir a redimir puntos`;
  - busqueda `QA` devolvio 18 clientes;
  - primera tarjeta mostro `Puntos`, `Registrar compra` y `Redimir puntos`;
  - no hay overflow horizontal.

Hallazgos:

P0/P1:
- P1: La URL publicada no incluye el menu lateral/tabs ni la navegacion por paneles de TASK-058.
  - Pasos reproducibles:
    1. Abrir `https://calm-dune-075dc5c0f.7.azurestaticapps.net`.
    2. Confirmar que la pantalla muestra `API real`.
    3. Observar que no existe menu lateral con opciones `Registrar cliente`, `Registrar compra`, `Redimir puntos`.
    4. En mobile, observar que no existe control superior/tabs equivalente.
    5. Buscar `QA`.
    6. Observar que las tarjetas aun muestran acciones directas `Registrar compra` y `Redimir puntos`, pero no hay panel activo guiado ni boton `Ir a redimir puntos` desde compra.
  - Impacto:
    - No resuelve el hallazgo UX de PO Test sobre paneles/formularios largos fuera de pantalla.
    - Bloquea validar opcion default `Registrar cliente` como item activo de menu.
    - Bloquea validar cambio automatico de duplicado a panel `Registrar compra`.
    - Bloquea validar accion desde compra hacia panel `Redimir puntos`.
    - Bloquea el objetivo central de TASK-059.

P2/P3:
- Ninguno adicional. Las pruebas funcionales de compra/redencion no se repitieron porque la navegacion de TASK-058 no esta publicada.

Evidencia:
- Desktop inicial:
  - `hasOperationalNav = false`;
  - `hasIrRedimir = false`;
  - botones detectados `Registrar compra` y `Redimir puntos` existen en DOM pero no estan visibles como menu/panel activo.
- Mobile inicial:
  - `hasOperationalNav = false`;
  - `hasIrRedimir = false`;
  - no hay tabs/control superior de tres opciones.
- Busqueda `QA`:
  - `rows = 18`;
  - primer resultado `QA Smoke 1780430104689`;
  - acciones directas visibles `Registrar compra` y `Redimir puntos`;
  - sin navegacion por paneles.
- TASK-058-HANDOFF indica que localmente si existia menu lateral, panel activo y boton `Ir a redimir puntos`, por lo que el bloqueo observado es de publicacion/deploy o version servida.

Riesgos o pendientes:
- No se crearon clientes, compras ni redenciones en TASK-059 para evitar ensuciar datos cuando el requisito principal no esta publicado.
- Se requiere commit/deploy real de TASK-058 a Static Web Apps o confirmar cache/version publicada.
- La UI publicada conserva el flujo cliente + compra + redencion anterior aprobado por TASK-053, pero no la reorganizacion UX pedida.

Siguiente recomendado:
- Web Dev / Infra debe confirmar que los cambios de TASK-058 fueron commiteados, pusheados y desplegados en Static Web Apps.
- Repetir TASK-059 cuando la URL publicada muestre menu lateral/tabs, panel activo y boton `Ir a redimir puntos`.
