Equipo:
QA

Tarea validada:
TASK-067 - Validar ajuste de layout web por zonas en ambiente publicado.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API esperada por configuracion publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Resultado:
No aprobado.

Resumen:
La URL publicada todavia no refleja el ajuste de layout esperado por TASK-066. El HTML publicado sigue mostrando los labels visibles `Zona 1`, `Zona 2`, `Zona 3` y `Zona 4`, por lo que no cumple el primer criterio de TASK-067 ni el boceto solicitado por PO Test.

Checks ejecutados:
- Lectura HTTP de la URL publicada con `Invoke-WebRequest`.
- Confirmacion de respuesta `200`.
- Revision del HTML publicado para detectar labels de zona y textos principales.
- Revision del CSS referenciado por el HTML publicado.

Hallazgos:
P0/P1:
- P1: El frontend publicado conserva labels visibles `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4`. Esto bloquea la aprobacion del ajuste visual solicitado por PO y confirma que TASK-066 no esta desplegada en la URL publicada o que el despliegue esta sirviendo una version anterior.

P2/P3:
- No se identificaron hallazgos P2/P3 adicionales porque la prueba se detuvo al confirmar el P1 de version publicada incorrecta.

Evidencia:
- URL `https://calm-dune-075dc5c0f.7.azurestaticapps.net` respondio `200`.
- Scripts referenciados por el HTML publicado:
  - `./app-config.js`
  - `./src/app.js`
- Textos encontrados en el HTML publicado:
  - `Zona 1`
  - `Zona 2`
  - `Zona 3`
  - `Zona 4`
  - `Buscar cliente`
  - `Registrar cliente`
  - `Resultados`
  - `Operacion`
- Conteo de labels `Zona [0-9]` en HTML publicado: `4`.
- CSS publicado revisado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/styles.css`.

Checks no ejecutados por bloqueo:
- Validacion desktop de posicionamiento final:
  - busqueda arriba izquierda;
  - resultados debajo de busqueda;
  - registro a la derecha y mas angosto;
  - registro alineado en altura a busqueda + resultados;
  - panel operativo inferior.
- Validacion mobile de orden buscar, resultados, registrar, operacion.
- Flujo funcional completo de busqueda, alta, duplicado, compra y redencion en la version ajustada.
- Nota explicita sobre resultado multiple: no ejecutado en esta ronda porque el publicado no contiene la version visual objetivo; validar resultados multiples sobre esta version anterior no daria evidencia util de TASK-066.

Riesgos o pendientes:
- Puede haber un deploy pendiente o fallido de TASK-066.
- El worktree local contiene cambios de TASK-066, pero QA de TASK-067 requiere validar la URL publicada.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Web Dev / Release debe confirmar commit y deploy de TASK-066 a Static Web Apps.
- Reintentar TASK-067 cuando la URL publicada ya no muestre `Zona 1`, `Zona 2`, `Zona 3`, `Zona 4`.
