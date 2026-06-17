# TASK-292 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Estado: Completed
Fecha: 2026-06-15

## Resultado

Se corrigieron los dos problemas reportados en `Atender cliente`:

- El duplicado de cliente ya no muestra mensaje generico.
- El boton `Atender` ahora llena la `Ficha del cliente` y deja acciones disponibles para continuar.

La Web fue publicada en Azure Static Web Apps.

URL publicada:

- https://calm-dune-075dc5c0f.7.azurestaticapps.net

## Handoff leido

- `tasks/TASK-291-HANDOFF.md`

## Cambios realizados

- Se amplio la deteccion de error duplicado con `isDuplicateCustomerError()`.
- Si el registro devuelve duplicado y la UI puede encontrar el cliente existente:
  - busca por telefono, email y nombre;
  - selecciona el cliente;
  - llena la ficha;
  - muestra el copy esperado: `Este cliente ya estaba registrado. Lo seleccionamos para continuar la atencion.`
- Si no puede seleccionarlo automaticamente, muestra:
  - `Este cliente ya estaba registrado. Busquelo y presione Atender para continuar.`
- `selectCustomer()` ahora es async y asegura balance antes de renderizar la ficha.
- El click de `Atender` muestra estado de carga y selecciona el cliente sin depender de una busqueda posterior.
- Se corrigio una condicion de alerta de membresia que podia leer `expirationAlert` sobre `null` e impedir que la ficha se renderizara.
- La carga secundaria de membresias ya no debe bloquear la ficha base del cliente.

## Archivos tocados

- `app/src/app.js`

No se cambio API.
No se cambio SQL.

## Evidencia de checks

- `node --check .\app\src\app.js`: OK
- `node --check .\app\src\customerApi.js`: OK
- Busqueda de prohibidos sin resultados:
  - `window.confirm`
  - `localStorage`
  - `sessionStorage`
  - `Buscar cliente para puntos`
  - `Operacion de puntos`

## Evidencia local - Boton Atender

Validacion con navegador local usando mock API:

- Busqueda: `Maria`
- Resultado: `Maria Soto`
- Click en `Atender`
- `#selected-customer-card.hidden`: `false`
- `Ficha del cliente`: visible
- Texto de ficha contiene:
  - `Maria Soto`
  - `+50688887777`
  - `maria@example.com`
  - `PTS. ACTUALES`
  - `MEMBRESIA`
  - `Registrar compra`
  - `Ver historial`
  - `Pagar membresia`
- Acciones visibles:
  - compra: true
  - historial: true
  - membresia/pago: true

## Evidencia local - Duplicado

Validacion con navegador local usando mock API:

- Registro intentado:
  - nombre: `Maria Soto`
  - telefono: `+50688887777`
  - email: `maria@example.com`
- Resultado:
  - `#form-error.hidden`: true
  - mensaje visible: `Este cliente ya estaba registrado. Lo seleccionamos para continuar la atencion.`
  - `#selected-customer-card.hidden`: false
  - ficha contiene `Maria Soto`
  - acciones visibles:
    - compra: true
    - membresia/pago: true

## Evidencia publicada

Deploy completado con SWA CLI:

- `swa deploy --env production`: OK

Status publicados:

- `/`: 200
- `/styles.css`: 200
- `/src/app.js`: 200
- `/src/customerApi.js`: 200

Markers publicados presentes:

- `Este cliente ya estaba registrado. Lo seleccionamos para continuar la atencion.`: True
- `Este cliente ya estaba registrado. Busquelo y presione Atender para continuar.`: True
- `isDuplicateCustomerError`: True
- `async function selectCustomer`: True
- `membershipExpirationAlert`: True
- `Atender cliente`: True
- `Ficha del cliente`: True

Markers prohibidos publicados ausentes:

- `window.confirm`: False
- `localStorage`: False
- `sessionStorage`: False
- `Buscar cliente para puntos`: False
- `Operacion de puntos`: False

## Riesgos o notas para QA

- La prueba local uso mock API para no depender de sesion real ni crear datos en Azure.
- QA debe revalidar con `DEMO 1`:
  - registrar un cliente existente;
  - confirmar copy de duplicado;
  - confirmar que el cliente queda seleccionado;
  - buscar cliente y presionar `Atender`;
  - confirmar que la ficha muestra datos, puntos y membresias segun flags de empresa.
