Equipo: QA

Tarea completada: TASK-049 - Revalidar flujo publicado clientes + registrar compra despues del deploy

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-05
- Navegador: Chrome headless/CDP contra la URL publicada.

Resultado:
- Aprobado.
- La URL publicada ya refleja TASK-047.
- No hay P0/P1 abiertos para el flujo cliente + compra cubierto por esta tarea.
- Listo para PO Test del flujo cliente + compra.

Archivos cambiados:
- `tasks/TASK-049-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-049-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Revisado contexto puntual de `tasks/TASK-047-HANDOFF.md` y `tasks/TASK-048-HANDOFF.md`.
- Validado JS publicado `https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/app.js`.
- Ejecutada prueba real de navegador desktop contra la URL publicada.
- Ejecutada prueba real de navegador mobile basica contra la URL publicada.

Checks ejecutados:
- Carga inicial desktop:
  - fuente `API real`;
  - texto inicial `Busque por telefono, nombre o email para atender al cliente.`;
  - `0` filas de clientes al abrir;
  - formulario `purchase-form` existe pero inicia oculto;
  - sin overflow horizontal.
- Carga inicial mobile `390x780`:
  - fuente `API real`;
  - texto inicial `Busque por telefono, nombre o email para atender al cliente.`;
  - `0` filas de clientes al abrir;
  - formulario `purchase-form` existe pero inicia oculto;
  - sin overflow horizontal.
- JS publicado:
  - `StatusCode = 200`;
  - contiene `renderSearchPrompt()`;
  - contiene `purchase-form`;
  - contiene accion de compra `data-action="purchase"`;
  - no contiene `loadCustomers("")`.
- Busqueda cliente existente:
  - busqueda `QA` devolvio 15 resultados;
  - primera tarjeta mostro datos de cliente, badge `Puntos` y boton `Registrar compra`;
  - no mostro boton antiguo `Detalle`.
- Crear cliente nuevo:
  - cliente creado: `Task 049 Cliente 80771917`;
  - telefono: `+50680771917`;
  - email: `task049-80771917@example.com`;
  - mensaje visible: `Cliente registrado: Task 049 Cliente 80771917. Ahora puede registrar la compra.`;
  - formulario de compra quedo visible para ese cliente.
- Registrar compra despues de crear cliente:
  - factura: `T049-NEW-80771917`;
  - monto: `2000`;
  - resultado visible: cliente con `Puntos actuales 100`.
- Cliente duplicado:
  - al reintentar crear `Task 049 Cliente 80771917`, la UI mostro `Ya existe un cliente con ese telefono o email. Abrimos su registro de compra.`;
  - el formulario de compra quedo abierto para el cliente existente.
- Registrar compra para cliente existente:
  - cliente existente usado: `Task 049 Cliente 80771917`;
  - factura: `T049-EX2-80913442`;
  - monto: `1234.56`;
  - mensaje visible: `Compra registrada. Puntos ganados: 62.`;
  - puntos visibles pasaron de `Puntos actuales 100` a `Puntos actuales 162`.
- Errores de compra:
  - factura duplicada `T049-EX2-80913442`: `Ya existe una compra con esa factura o comprobante.`;
  - factura vacia: `La factura o comprobante es requerido y debe tener 80 caracteres o menos.`;
  - monto `0`: `El monto debe ser mayor que 0.`;
  - error general: `Revise los campos marcados.`

Hallazgos:

P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo observado en el alcance de TASK-049.

Evidencia:
- La publicacion ya no reproduce el fallo de TASK-048: no carga/lista clientes automaticamente y ya no muestra tarjetas con `Detalle`.
- El frontend publicado usa el flujo nuevo de TASK-047: prompt inicial manual, puntos visibles, boton `Registrar compra`, panel de compra y manejo de duplicado hacia compra del existente.
- Compra real registrada para cliente existente con factura `T049-EX2-80913442`, puntos ganados `62` y saldo visible actualizado a `162`.
- Compra real registrada despues de crear cliente nuevo con factura `T049-NEW-80771917`, saldo visible `100`.
- Validaciones negativas de compra visibles y bloqueantes para factura requerida, monto mayor que cero y factura duplicada.

Riesgos o pendientes:
- La prueba crea datos reales de QA en la empresa piloto; las facturas y cliente quedan como evidencia funcional.
- No se validaron redenciones porque estan fuera de alcance.
- No se validaron permisos/auth porque el MVP publicado actual opera con empresa piloto fija.

Siguiente recomendado:
- Product / Architect / Release puede procesar este handoff y habilitar PO Test del flujo cliente + compra en la URL publicada.
