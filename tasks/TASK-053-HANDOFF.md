Equipo: QA

Tarea completada: TASK-053 - Revalidar flujo publicado cliente + compra + redencion despues del deploy

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-05
- Navegador: Chrome headless/CDP contra la URL publicada.

Resultado:
- Aprobado.
- La URL publicada ya refleja TASK-050.
- No hay P0/P1 abiertos para el flujo cliente + compra + redencion cubierto por esta tarea.
- Listo para PO Test del flujo cliente + compra + redencion.

Archivos cambiados:
- `tasks/TASK-053-HANDOFF.md`

Verificacion ejecutada:
- Leido `tasks/TASK-053-assignment.md`.
- Leido `codex-project-templates/QA.md`.
- Leido `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Revisado `tasks/TASK-050-HANDOFF.md` y `tasks/TASK-051-HANDOFF.md`.
- Validado JS publicado:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/app.js`
- Ejecutada prueba real de navegador desktop contra la URL publicada.
- Ejecutada prueba real de navegador mobile basica contra la URL publicada.

Checks ejecutados:
- JS publicado:
  - `StatusCode = 200`;
  - contiene `redemption-form`;
  - contiene accion `data-action="redemption"`;
  - contiene texto `Redimir puntos`;
  - contiene integracion `createRedemption`;
  - contiene `purchase-form`;
  - no contiene `loadCustomers("")`.
- Carga inicial desktop `1366x900`:
  - fuente `API real`;
  - texto inicial `Busque por telefono, nombre o email para atender al cliente.`;
  - `0` filas de clientes al abrir;
  - `purchase-form` existe e inicia oculto;
  - `redemption-form` existe e inicia oculto;
  - texto `Redimir puntos` existe en la pagina;
  - sin overflow horizontal.
- Busqueda cliente existente:
  - busqueda `QA` devolvio 15 resultados;
  - primer resultado: `QA Smoke 1780430104689`;
  - tarjeta muestra `Puntos 173`;
  - acciones visibles: `Registrar compra` y `Redimir puntos`;
  - no aparece boton antiguo `Detalle`.
- Crear cliente nuevo:
  - cliente creado: `Task 053 Cliente 94757456`;
  - telefono: `+50694757456`;
  - email: `task053-94757456@example.com`;
  - mensaje visible: `Cliente registrado: Task 053 Cliente 94757456. Ahora puede registrar la compra.`;
  - formularios de compra y redencion quedaron visibles para ese cliente.
- Registrar compra:
  - factura: `T053-P-94757456`;
  - monto: `2000`;
  - mensaje visible: `Compra registrada. Puntos ganados: 100.`;
  - tarjeta de compra y tarjeta de redencion muestran `Puntos actuales 100`.
- Redimir puntos validos:
  - puntos redimidos: `25`;
  - nota: `Canje QA TASK-053`;
  - mensaje visible: `Canje registrado. Puntos redimidos: 25.`;
  - saldo visible actualizado a `Puntos actuales 75`;
  - fila del cliente actualizada a `Puntos 75`.
- Saldo insuficiente:
  - intento de canje: `999999` puntos;
  - mensaje visible: `El cliente no tiene puntos suficientes para este canje.`;
  - saldo visible se mantuvo en `75`.
- Validaciones de redencion:
  - fecha vacia + puntos `0`:
    - general `Revise los campos marcados.`;
    - fecha `La fecha de canje es requerida.`;
    - puntos `Los puntos a redimir deben ser un entero mayor que 0.`;
  - puntos requeridos:
    - general `Revise los campos marcados.`;
    - puntos `Los puntos a redimir deben ser un entero mayor que 0.`;
  - puntos negativos `-1`:
    - general `Revise los campos marcados.`;
    - puntos `Los puntos a redimir deben ser un entero mayor que 0.`;
- Mobile `390x780`:
  - carga inicial sin clientes automaticos;
  - busqueda `QA` devolvio 15 resultados;
  - primer resultado muestra puntos, `Registrar compra` y `Redimir puntos`;
  - al seleccionar `Redimir puntos`, el formulario de redencion queda visible;
  - foco en `redemption-points`;
  - sin overflow horizontal.

Hallazgos:

P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo observado en el alcance de TASK-053.

Evidencia:
- La publicacion ya no reproduce el P1 de TASK-051: el JS publicado contiene `redemption-form`, `data-action="redemption"`, `Redimir puntos` y `createRedemption`.
- Compra real registrada para `Task 053 Cliente 94757456` con factura `T053-P-94757456`, puntos ganados `100`.
- Canje real registrado para el mismo cliente por `25` puntos, dejando saldo visible `75`.
- Error de saldo insuficiente visible y saldo conservado en `75`.
- Validaciones negativas de redencion visibles y bloqueantes para fecha requerida, puntos requeridos, puntos `0` y puntos negativos.
- El flujo de compra de TASK-049/TASK-050 sigue funcionando en la misma pantalla.

Riesgos o pendientes:
- La prueba crea datos reales de QA en la empresa piloto; el cliente, compra y canje quedan como evidencia funcional.
- No se validaron permisos/auth porque el MVP publicado actual opera con empresa piloto fija.
- No se validaron redenciones fuera del flujo normal de UI.
- Riesgo operativo de API/SAS reportado en TASK-052 sigue fuera del alcance de esta prueba funcional.

Siguiente recomendado:
- Product / Architect / Release puede procesar este handoff y habilitar PO Test del flujo cliente + compra + redencion en la URL publicada.
