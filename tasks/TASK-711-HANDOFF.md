Equipo: QA
Tarea validada: TASK-711 - Validar separacion Crear/Editar vs Enviar campana
Ambiente: Local/mock en http://127.0.0.1:4181/login servido con app-config temporal `PUNTO_CLUB_USE_MOCK_API=true`. Playwright headless. Fecha QA: 2026-07-02.
Resultado: aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, tasks/TASK-708.md, tasks/TASK-708-HANDOFF.md, tasks/TASK-709-HANDOFF.md, tasks/TASK-710-HANDOFF.md.
- Nota de contexto: tasks/TASK-711.md no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Se creo servidor local temporal para servir `app/` con mock API, sin modificar app-config.js de producto.
- Login mock con `owner@mock.test` / password mock local definido en customerApi.js.
- Abrir `Enviar campañas`.
- Confirmar panel `Crear/Editar campaña` separado del panel `Enviar campañas`.
- Confirmar que el panel `Enviar campañas` no contiene boton `Nueva campaña` / crear campaña.
- Crear campaña nueva sin imagen y confirmar que queda disponible en panel de gestion/listas sin imagen.
- Crear campaña nueva con imagen PNG controlada y confirmar que la imagen queda asociada a la campaña gestionada, no a otra seleccionada para envío.
- Confirmar que las campañas nuevas aparecen en el selector del panel Enviar sin autoseleccionarse.
- Reemplazar imagen de la campaña gestionada con JPG controlado.
- Eliminar imagen de la campaña gestionada.
- Restaurar imagen para validar preview con imagen.
- Seleccionar en panel Enviar la campaña sin imagen y confirmar preview sin `<img>`.
- Seleccionar en panel Enviar la campaña con imagen y confirmar preview con `<img>` visible.
- Seleccionar destinatarios elegibles desde panel Enviar y confirmar que el boton queda asociado a la campaña seleccionada.
- Verificacion estatica:
  - `node --check app/src/app.js`
  - `node --check app/src/customerApi.js`
  - `npx prettier --check app/index.html app/src/app.js app/styles.css`
- No se enviaron correos reales.

Hallazgos:
- No se detectaron P0/P1/P2/P3 en el alcance local/mock validado.
- Observacion QA: la edicion de texto de campañas existentes sigue limitada por contrato Backend/API ausente, tal como ya documento TASK-709. La validacion de TASK-711 cubrio creacion de texto nuevo y gestion de imagen en campaña editable; no se valida actualizacion persistente de texto de campaña existente porque no hay endpoint.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo.

Evidencia:
- Script temporal QA ejecutado: `tmp/task711-qa.mjs`.
- Resultado Playwright local/mock:
  - paneles separados visibles;
  - panel Enviar sin boton Crear/Nueva campaña;
  - campaña sin imagen creada y seleccionable;
  - campaña con imagen creada y seleccionable;
  - selector de Enviar no adopta automaticamente la campaña recien creada;
  - reemplazo y eliminacion de imagen operan sobre campaña gestionada;
  - preview sin imagen: `count=0`, `hasVisibleImage=false`;
  - preview con imagen: `count=1`, `hasVisibleImage=true`, `srcKind=blob`, `naturalWidth=1`, `naturalHeight=1`;
  - selección de destinatarios: `2 destinatarios seleccionados para este envío`;
  - boton de envío: `Enviar a 2`;
  - campaña seleccionada para envío: `QA711 con imagen ...`.
- Archivos de imagen usados:
  - `tmp/task676/qa-campaign.png`
  - `tmp/task676/qa-replace.jpg`

Uso DB cloud: No. Validacion local/mock; no se uso Azure SQL, no se consulto API publicada y no se enviaron correos reales.

Riesgos o pendientes:
- Pendiente futuro si Product lo requiere: endpoint Backend/API para editar contenido de campañas existentes; hoy la UI informa que el contenido existente es de solo lectura hasta contar con endpoint de actualizacion.
- Pendiente QA publicada posterior con sesion real/controlada para confirmar el mismo comportamiento contra API/Blob reales, sin envio real salvo autorizacion explicita.

Siguiente recomendado:
- Product / Release puede aceptar la separacion local Crear/Editar vs Enviar para pasar a publicacion controlada. Luego ejecutar QA publicado focal de imagen/campaña con sesion real y sin envio real.
