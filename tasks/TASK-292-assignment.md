# TASK-292 - Corregir seleccion y mensaje duplicado en Atender cliente

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 33
Depende de: TASK-291
Estado: Assigned

## Objetivo

Corregir dos problemas visibles en `Atender cliente`:

1. El mensaje de cliente duplicado es incorrecto.
2. El boton `Atender` no llena la ficha del cliente ni permite continuar.

## Contexto

Product Owner probo con empresa autenticada `DEMO 1`.

Hallazgos:

- Al intentar registrar un cliente que ya existe, la UI muestra:

```text
No se pudo registrar el cliente. Intente de nuevo.
```

Pero el cliente si existe y ya aparece en resultados. El mensaje correcto debe guiar al usuario.

- Al presionar `Atender` en un resultado, la fila queda seleccionada visualmente, pero `Ficha del cliente` no muestra informacion ni acciones.

## Alcance

1. Leer:
   - `tasks/TASK-291-HANDOFF.md`
2. Corregir manejo de cliente duplicado en registro dentro de `Atender cliente`.
3. Si API devuelve `DUPLICATE_CUSTOMER`, la UI debe:
   - mostrar mensaje claro;
   - buscar/seleccionar el cliente existente si es posible;
   - poblar `Ficha del cliente`;
   - permitir continuar con acciones.
4. Corregir boton `Atender`:
   - debe seleccionar cliente;
   - debe poblar ficha;
   - debe cargar resumen de puntos si aplica;
   - debe cargar resumen/acciones de membresia si aplica;
   - debe mostrar acciones validas.
5. Publicar Web en Azure Static Web Apps.

## Copy esperado

Para duplicado:

```text
Este cliente ya estaba registrado. Lo seleccionamos para continuar la atencion.
```

Si no se puede seleccionar automaticamente:

```text
Este cliente ya estaba registrado. Busquelo y presione Atender para continuar.
```

## Reglas

- No mostrar mensaje generico para duplicado si el error trae codigo identificable.
- No obligar a buscar de nuevo si la UI puede seleccionar el cliente existente.
- No mostrar acciones operativas sin cliente seleccionado.
- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Cliente duplicado muestra copy correcto.
- Boton `Atender` llena `Ficha del cliente`.
- Ficha muestra datos del cliente.
- Si puntos esta habilitado, muestra seccion/acciones de puntos.
- Si membresias esta habilitado, muestra seccion/acciones de membresia.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-292-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de duplicado corregido.
- Evidencia de boton `Atender` poblando ficha.
- Riesgos o notas para QA.
