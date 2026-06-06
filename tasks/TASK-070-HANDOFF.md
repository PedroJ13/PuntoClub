Equipo:
QA

Tarea validada:
TASK-070 - Revalidar copy sin referencia a zonas.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable esperada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewport probado: desktop `1280x800`

Resultado:
No aprobado.

Resumen:
La URL publicada todavia muestra el copy anterior en el estado sin resultados: `Sin resultados. Registre el cliente en la zona 2.`. Por tanto, TASK-069 no esta desplegada en Static Web Apps o la URL sigue sirviendo una version anterior de `src/app.js`.

Checks ejecutados:
- Lectura HTTP del HTML publicado.
- Lectura HTTP de `src/app.js` publicado.
- Lectura HTTP de `styles.css` publicado.
- Busqueda estatica de `zona|Zona` en HTML/JS/CSS publicados.
- Apertura de pantalla publicada en Chrome headless.
- Ejecucion de busqueda sin resultado.
- Confirmacion de mensaje visible y foco posterior.

Hallazgos:
P0/P1:
- P1: En ambiente publicado sigue visible `Sin resultados. Registre el cliente en la zona 2.`. Esto incumple el objetivo de TASK-070: no debe aparecer ninguna referencia visible a zonas, incluyendo `zona 2` o `zona`.

P2/P3:
- No se identificaron hallazgos P2/P3 adicionales. La prueba se detuvo por P1.

Evidencia estatica:
- HTML publicado:
  - referencias `zona|Zona`: `0`
- CSS publicado:
  - referencias `zona|Zona`: `0`
- JS publicado:
  - referencias `zona|Zona`: `1`
- Copy viejo encontrado:
  - `Sin resultados. Registre el cliente en la zona 2.`
- Copy esperado por TASK-069 no encontrado:
  - `Sin resultados. Complete el registro para crear este cliente.`

Evidencia en navegador:
- Busqueda ejecutada:
  - `NORESULT-T070-62857497`
- Mensaje superior:
  - `No encontramos ese cliente. Complete el registro para crearlo.`
- Estado visible de resultados:
  - `Sin resultados. Registre el cliente en la zona 2.`
- Foco posterior:
  - `customer-name`
- DOM visible:
  - `bodyHasOldCopy: true`
  - `bodyHasNewCopy: false`
  - coincidencias visibles de `zona|Zona`: `["zona"]`

Checks no ejecutados por bloqueo:
- Registrar cliente nuevo desde ese estado.
- Confirmar cliente en resultados.
- Smoke corto de acciones `Compra` y `Redimir`.

Motivo:
- Al existir un P1 directo sobre el criterio principal de TASK-070, crear nuevos datos QA y ejecutar compra/redencion no cambia el resultado de aprobacion. Se recomienda repetir esos checks cuando el copy corregido este publicado.

Riesgos o pendientes:
- Puede haber commit/deploy pendiente o fallido de TASK-069.
- La URL publicada aun no refleja el copy local reportado por Web Dev.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Web Dev / Release debe confirmar commit y deploy de TASK-069 a Static Web Apps.
- Reintentar TASK-070 cuando `src/app.js` publicado ya no contenga `zona`.
