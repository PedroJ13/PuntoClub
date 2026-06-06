Equipo:
QA

Tarea validada:
TASK-071 - Revalidar copy publicado despues del deploy.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewport probado: desktop `1280x800`

Resultado:
Aprobado.

Resumen:
El `src/app.js` publicado ya no contiene referencias a `zona`/`Zona`, el copy viejo ya no aparece y el estado sin resultados muestra el copy nuevo esperado. El flujo desde busqueda sin resultado hacia registro, alta de cliente, compra y redencion funciona sin P0/P1.

Checks ejecutados:
- Lectura HTTP de HTML publicado.
- Lectura HTTP de `src/app.js` publicado.
- Lectura HTTP de `styles.css` publicado.
- Busqueda estatica de `zona|Zona` en HTML/JS/CSS publicados.
- Confirmacion de ausencia del copy viejo.
- Confirmacion de presencia del copy nuevo en JS publicado.
- Apertura de pantalla publicada en Chrome headless.
- Busqueda sin resultado.
- Confirmacion de foco a registro.
- Registro de cliente nuevo desde ese estado.
- Confirmacion de cliente en resultados.
- Smoke corto de compra.
- Smoke corto de redencion despues de generar puntos.

Hallazgos:
P0/P1:
- Ninguno.

P2/P3:
- Ninguno nuevo.

Evidencia estatica:
- HTML publicado:
  - coincidencias `zona|Zona`: `0`
- JS publicado:
  - coincidencias `zona|Zona`: `0`
- CSS publicado:
  - coincidencias `zona|Zona`: `0`
- Copy viejo:
  - `Sin resultados. Registre el cliente en la zona 2.`
  - coincidencias: `0`
- Copy nuevo:
  - `Sin resultados. Complete el registro para crear este cliente.`
  - coincidencias: `1`

Evidencia en navegador:
- Estado inicial:
  - foco `customer-search`
  - coincidencias visibles `zona|Zona`: `[]`
  - copy viejo visible: `false`
- Busqueda sin resultado:
  - termino `NORESULT-T071-63492617`
  - mensaje superior `No encontramos ese cliente. Complete el registro para crearlo.`
  - resultados `Sin resultados. Complete el registro para crear este cliente.`
  - foco `customer-name`
  - coincidencias visibles `zona|Zona`: `[]`
- Cliente creado:
  - nombre `Task 071 Cliente 63492617`
  - telefono `+50671492617`
  - email `task071-63492617@example.com`
  - mensaje `Cliente registrado: Task 071 Cliente 63492617.`
  - resultado `Task 071 Cliente 63492617 +50671492617 task071-63492617@example.com PTS. 0 Compra`
  - foco `customer-search`
- Compra:
  - panel `Registrar compra`
  - foco `purchase-invoice-number`
  - factura `T071-P-63492617`
  - monto `2000`
  - mensaje `Compra registrada. Pts. ganados: 100.`
  - resultado actualizado `PTS. 100 Compra Redimir`
  - foco `customer-search`
- Redencion:
  - panel `Redimir puntos`
  - foco `redemption-points`
  - puntos redimidos `25`
  - mensaje `Canje registrado. Pts. redimidos: 25.`
  - resultado actualizado `PTS. 75 Compra Redimir`
  - foco `customer-search`
- Durante compra/redencion:
  - coincidencias visibles `zona|Zona`: `[]`

Riesgos o pendientes:
- Las pruebas crean datos reales de QA en la empresa piloto.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el bloqueo de copy reportado en TASK-068/TASK-070.
