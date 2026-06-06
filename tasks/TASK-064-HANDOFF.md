Equipo: QA

Tarea completada: TASK-064 - Validar pantalla web por zonas

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API usada por frontend: API real
- Fecha QA: 2026-06-06
- Navegador: Chrome headless/CDP contra la URL publicada.

Resultado:
- No aprobado.
- La URL publicada todavia no refleja el redisenio por zonas de TASK-063.
- No queda listo para PO Test de la pantalla web por zonas.

Archivos cambiados:
- `tasks/TASK-064-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-064-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Leido `tasks/TASK-063-assignment.md`.
- Leido `tasks/TASK-063-HANDOFF.md`.
- Revisado HTML/JS publicado.
- Ejecutada revision de navegador real desktop y mobile contra la URL publicada.

Checks ejecutados:
- HTML/JS publicado:
  - `index.html` respondio `200`;
  - `src/app.js` respondio `200`;
  - no se encontro zona/titulo `Resultados`;
  - no se encontro zona/titulo `Operacion`;
  - sigue existiendo `panel-nav`;
  - sigue existiendo `data-panel`;
  - no se encontro formato `Pts.` esperado por TASK-063;
  - sigue apareciendo texto `Puntos` de la UI anterior.
- Desktop `1366x900`:
  - fuente `API real`;
  - encabezados visibles: `Registro`, `Nuevo cliente`, `Compra`, `Registrar compra`, `Canje`, `Redimir puntos`, `Clientes`, `Buscar cliente`;
  - zonas detectadas:
    - busqueda: si;
    - registro: si;
    - resultados: no;
    - operacion: no;
  - menu/tabs siguen visibles:
    - `Registrar cliente` con `aria-pressed="true"`;
    - `Registrar compra` con `aria-pressed="false"`;
    - `Redimir puntos` con `aria-pressed="false"`;
  - existe `.panel-nav`;
  - existe `[data-panel]`;
  - no hay foco default en `customer-search` al abrir;
  - sin overflow horizontal.
- Mobile `390x780`:
  - fuente `API real`;
  - zonas detectadas:
    - busqueda: si;
    - registro: si;
    - resultados: no;
    - operacion: no;
  - tabs superiores siguen visibles con `Registrar cliente`, `Registrar compra`, `Redimir puntos`;
  - existe `.panel-nav`;
  - existe `[data-panel]`;
  - no hay foco default en `customer-search` al abrir;
  - sin overflow horizontal.

Hallazgos:

P0/P1:
- P1: La URL publicada sigue sirviendo la UI con menu/tabs de TASK-060 y no la pantalla unica por zonas de TASK-063.
  - Pasos reproducibles:
    1. Abrir `https://calm-dune-075dc5c0f.7.azurestaticapps.net`.
    2. Confirmar que la pantalla muestra `API real`.
    3. Observar que siguen visibles los tabs/menu `Registrar cliente`, `Registrar compra`, `Redimir puntos`.
    4. Observar que no existen las 4 zonas esperadas como pantalla unica: `Buscar cliente`, `Registrar cliente`, `Resultados`, `Operacion`.
    5. Observar que no aparece `Pts.` en resultados porque no esta publicada la lista compacta de TASK-063.
  - Impacto:
    - Bloquea validar el objetivo principal de TASK-064.
    - Bloquea validar foco default en buscar del nuevo diseno.
    - Bloquea validar busqueda sin resultado pasando a registro.
    - Bloquea validar registro nuevo/duplicado en la pantalla por zonas.
    - Bloquea validar compra/redencion desde resultados usando panel operativo inferior.

P2/P3:
- Ninguno adicional. Las pruebas funcionales de cliente/compra/redencion no se repitieron porque el diseno por zonas no esta publicado.

Evidencia:
- `TASK-063-HANDOFF.md` indica que localmente ya existian las zonas `Buscar cliente`, `Registrar cliente`, `Resultados` y `Operacion`, y que no existia `.panel-nav`.
- En la URL publicada se observa lo contrario:
  - `hasPanelNav = true`;
  - `hasDataPanel = true`;
  - zona `Resultados = false`;
  - zona `Operacion = false`;
  - `hasPts = false`;
  - tabs/menu con `aria-pressed` siguen presentes.

Riesgos o pendientes:
- No se crearon clientes, compras ni redenciones en TASK-064 para evitar ensuciar datos cuando el cambio principal no esta publicado.
- Se requiere commit/deploy real de TASK-063 a Static Web Apps o revisar cache/version publicada.
- La UI publicada conserva el flujo con menu/paneles aprobado en TASK-060, pero no el nuevo diseno por zonas.

Siguiente recomendado:
- Web Dev / Infra debe confirmar que los cambios de TASK-063 fueron commiteados, pusheados y desplegados en Static Web Apps.
- Repetir TASK-064 cuando la URL publicada ya no tenga `.panel-nav` y muestre las zonas `Buscar cliente`, `Registrar cliente`, `Resultados` y `Operacion`.
