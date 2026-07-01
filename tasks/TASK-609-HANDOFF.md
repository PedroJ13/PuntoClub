Equipo: Web Dev
Tarea completada: TASK-609 - Crear pantalla de historial de correos operativos

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

SQL agregado o modificado:
- Ninguno.

Pantalla/flujo implementado:
- En `Mi empresa > Comunicaciones` se agrego el bloque `Historial de correos operativos`.
- Permite consultar correos operativos con filtros:
  - desde;
  - hasta;
  - tipo: todos, bienvenida, compra, canje;
  - estado: todos, enviado, fallido, omitido, pendiente;
  - busqueda por nombre o correo.
- Muestra:
  - tipo;
  - fecha;
  - cliente;
  - email destino;
  - estado;
  - motivo sanitizado.
- No incluye accion de reenvio en MVP.

Integracion API:
- Se agrego `listOperationalEmailHistory(filters)` en `customerApi`.
- HTTP:
  - llama `GET /api/companies/{companyId}/operational-email-history`
  - usa `credentials: include`
  - usa empresa activa del flujo autenticado.
- Mock:
  - agrega historial local con caso `sent` y caso `skipped`.
  - permite validar UI sin Azure SQL.

UX:
- El historial vive dentro del panel de Comunicaciones de Mi empresa, junto a la configuracion de correos operativos.
- Los motivos visibles no muestran errores crudos ni payloads tecnicos.
- Estados vacio, cargando, exito y error quedan cubiertos.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `node --check api\src\functions\operationalEmailHistory.js`
- `node --check api\src\lib\repository.js`
- `node --test test\operational-email-history.test.js test\operational-emails.test.js`
- `npm test` en `api/`

Resultado:
- Checks sintacticos aprobados.
- Suite API completa aprobada: 159 tests pass.
- No se habilito reenvio.
- No se habilito envio real adicional.

Uso Azure SQL:
- No.
- Motivo: la UI se valido con mock/local y checks; no requeria datos reales.

Riesgos o pendientes:
- Falta QA visual/browser local para confirmar layout final en desktop/mobile.
- Falta validar contra API local levantada cuando TASK-608 se pruebe end-to-end.
- Falta publicacion en tarea posterior si Product/Release lo aprueba.

Siguiente recomendado:
- QA local de `Mi empresa > Comunicaciones` con mock y luego con API local autenticada.
