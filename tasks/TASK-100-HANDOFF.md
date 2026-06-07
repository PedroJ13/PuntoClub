Equipo:
Web Dev

Tarea completada:
TASK-100 - Agregar consulta operativa de auditoria.

Cambios realizados:
- Agregue acceso `Auditoria` en el encabezado.
- Agregue seccion `Auditoria operativa` sin carga automatica inicial.
- Agregue filtros:
  - fecha desde;
  - fecha hasta;
  - ultimos eventos: 10, 25, 50;
  - boton `Consultar auditoria`.
- Agregue tabla de eventos con:
  - fecha/hora;
  - tipo de evento;
  - cliente si aplica;
  - entidad;
  - resumen legible.
- Agregue estado inicial, estado vacio, loading y error.
- Extendi mock local para generar eventos de auditoria desde:
  - cliente creado;
  - compra registrada;
  - canje registrado;
  - cliente duplicado;
  - factura duplicada;
  - saldo insuficiente.
- La vista HTTP queda preparada para consultar `GET /api/companies/{companyId}/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=N`.

Archivos modificados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-100-HANDOFF.md`

Evidencia local:
- Validacion local en `http://127.0.0.1:4180` con `Mock local` inyectado solo para prueba.
- Cliente usado: `Task 100 Cliente 39948251`, telefono `+50610948251`.
- Se registro compra:
  - factura `T100-P-39948251`;
  - monto `2000`.
- Se registro redencion:
  - nota `Canje TASK-100 39948251`;
  - puntos `25`.

Eventos visibles:
- Consulta de auditoria para `2026-06-07` mostro:
  - `Auditoria cargada: 3 eventos.`
  - `Canje registrado`, cliente `Task 100 Cliente 39948251`, entidad `Canje`, `ID 70`, resumen `Canje registrado por 25 pts.`
  - `Compra registrada`, cliente `Task 100 Cliente 39948251`, entidad `Compra`, `ID 50`, resumen `Compra registrada por CRC 2 000,00. Factura T100-P-39948251.`
  - `Cliente creado`, cliente `Task 100 Cliente 39948251`, entidad `Cliente`, `ID 12`, resumen `Cliente registrado.`

Estado inicial:
- Al abrir la app, la auditoria no carga automaticamente.
- Estado inicial mostrado:
  - `Consulte un rango de fechas para ver eventos recientes.`
  - tabla oculta.

Estado vacio:
- Consulta con rango `1999-01-01` a `1999-01-01` mostro:
  - `Sin eventos para el rango seleccionado.`

Estado error:
- Consulta con `fecha desde=2026-06-10` y `fecha hasta=2026-06-01` mostro:
  - `La fecha hasta debe ser igual o posterior a fecha desde.`
- La UI tambien maneja error de API con:
  - `No se pudo consultar auditoria. Si el endpoint aun no esta disponible, intente despues del deploy.`

Pruebas responsive:
- Desktop con tabla visible:
  - `overflowX=false`.
- Mobile con tabla visible:
  - `clientWidth=390`;
  - `scrollWidth=390`;
  - `overflowX=false`;
  - tabla con scroll interno: `wrapScrollWidth=760`, `wrapClientWidth=336`.

Pruebas ejecutadas:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Servidor local: `python -m http.server 4180 --bind 127.0.0.1` desde `app`.
- Chrome headless local via DevTools Protocol.
- Flujo validado:
  - estado inicial sin carga automatica;
  - registro de cliente;
  - compra;
  - redencion;
  - consulta de auditoria con eventos;
  - estado vacio;
  - error de filtro;
  - responsive desktop/mobile.

Notas de dependencia:
- TASK-099 implemento escritura de auditoria, pero no dejo contrato formal ni Azure Function HTTP para consulta de eventos.
- No modifique backend/API, SQL, auth, Azure ni contratos.
- La ruta HTTP usada por frontend queda preparada para una consulta si Backend/API la expone: `/audit/events`.
- Si Backend/API decide otra ruta o forma de respuesta, Web Dev debe ajustar el adaptador `getAuditEvents`.

Resultado:
Completado localmente. La UI tiene una consulta operativa de auditoria funcional en mock local y estados claros para ausencia/error de endpoint.

Riesgos o pendientes:
- Pendiente definir/exponer contrato de lectura de auditoria en Backend/API si se requiere validacion publicada real.
- Pendiente deploy de frontend despues de confirmar endpoint.
- QA TASK-101 debe validar contra ambiente publicado cuando migracion, API y UI esten desplegadas.

Siguiente recomendado:
Backend/API o Product/Release debe confirmar contrato de lectura de auditoria; luego desplegar API/frontend y ejecutar TASK-101.
