Equipo: Diseno / UX
Modo de ejecucion: Promociones / Flujo de envio
Tarea completada: TASK-594 - Disenar UX de seleccion de campana y destinatarios al enviar

Resultado:
- Se definio y aplico el criterio UX para separar campana guardada de envio promocional.
- La campana se presenta como plantilla reutilizable: nombre interno, asunto, mensaje e incluir puntos.
- El envio se presenta como accion puntual: elegir campana, revisar preview, seleccionar destinatarios y confirmar envio.
- Se elimina la confusion de "guardar destinatarios" como paso previo.

Flujo definido:
1. Usuario entra a `Enviar campanas`.
2. Ve una lista de `Campanas guardadas`.
3. Selecciona una campana/plantilla.
4. Revisa o edita contenido y preview.
5. Ve la lista de clientes para ese envio.
6. Selecciona destinatarios con checks.
7. Puede usar acciones rapidas:
   - `Seleccionar elegibles`.
   - `Con puntos`.
   - `Limpiar seleccion`.
8. Confirma el envio real desde el boton `Enviar a N`.

Reglas UX:
- La seleccion de destinatarios vive en el momento del envio, no como dato permanente de la campana.
- Los dados de baja se muestran visibles, pero inhabilitados.
- Los no aptos muestran motivo:
  - no tiene correo valido;
  - dado de baja de promociones;
  - correo suprimido;
  - no apto para este envio.
- El contador muestra `N seleccionado(s) de 5`.
- El boton de envio solo se habilita con campana elegida y 1 a 5 destinatarios seleccionados.
- La confirmacion previa aclara que no se enviara a clientes no seleccionados ni dados de baja.

Archivos impactados por la aplicacion UX:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`

Uso Azure SQL:
- No.
- Motivo: definicion y aplicacion UX local; no se consulto ni modifico DB real.

Uso ACS / correos reales:
- No.
- Motivo: no se hizo prueba de envio real.

Riesgos o pendientes:
- Requiere QA local visual/funcional para confirmar que no queda confusion entre guardar campana y enviar.
- Requiere publicacion posterior si Product/Release aprueba el paquete.
