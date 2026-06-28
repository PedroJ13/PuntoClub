# Plan de migracion de datos legacy

## Objetivo

Preparar a Punto Club para recibir datos desde un sistema anterior en Excel o CSV, sin asumir todavia el formato final.

El proceso debe permitir revisar, limpiar, validar y aprobar los datos antes de cargarlos en tablas operativas. Ningun dato real debe cargarse sin dry-run, reporte de validacion y aprobacion explicita del Product Owner.

## Principios

- La migracion debe ser reproducible por batch.
- Todo archivo debe conservar trazabilidad de origen, archivo y fila.
- La carga real debe ser idempotente o tener controles claros contra doble importacion.
- Los datos legacy no deben tocar tablas productivas directamente.
- Primero se hace staging y reporte; luego, si se aprueba, aplicacion controlada.
- No se deben guardar secretos ni archivos reales sensibles en el repo.
- Azure SQL no debe usarse para pruebas repetitivas; usar datos sinteticos/locales hasta tener aprobacion de carga real.

## Escenarios soportados

### Escenario A: clientes solamente

El archivo trae clientes sin saldo ni historico.

Uso esperado:

- Crear o actualizar clientes.
- No generar compras, redenciones ni puntos.
- El saldo inicial queda en cero.

Riesgo:

- Si la empresa espera saldos, este escenario no sirve para continuidad operativa.

### Escenario B: clientes + saldo inicial compactado

El archivo trae una fila por cliente con saldo final de puntos, pero no trae compras/redenciones historicas.

Uso esperado:

- Crear o actualizar clientes.
- Crear un movimiento de ajuste/saldo inicial por cliente aprobado.
- Mantener referencia clara de que el saldo viene de migracion compactada, no de una compra real.

Regla:

- El movimiento debe quedar marcado como `legacy_balance_import` o equivalente.
- No inventar compras historicas si el sistema viejo no las entrega.

### Escenario C: clientes + historico completo de movimientos

El archivo trae clientes y todos los movimientos historicos, o archivos separados de clientes y movimientos.

Uso esperado:

- Crear o actualizar clientes.
- Importar compras/redenciones historicas con fecha y referencia legacy.
- Calcular saldo por suma/resta como hace el MVP.

Regla:

- Cada movimiento debe tener identificador legacy o clave idempotente derivada.
- Los movimientos repetidos deben quedar bloqueados antes de aplicar.

### Escenario D: historico parcial + saldo de ajuste

El archivo trae algunos movimientos, pero no todo el historico. Tambien trae saldo final por cliente.

Uso esperado:

- Importar movimientos disponibles.
- Calcular diferencia contra saldo final.
- Generar ajuste de migracion solo si la diferencia esta aprobada.

Regla:

- El ajuste debe indicar `legacy_balance_reconciliation`.
- Si la diferencia es negativa o inconsistente, debe quedar como warning o error segun tolerancia definida por Product Owner.

### Escenario E: archivos mixtos o separados

El proveedor entrega multiples archivos, por ejemplo:

- `clientes.csv`
- `movimientos.csv`
- `saldos.csv`
- `ventas.xlsx`
- `redenciones.xlsx`

Uso esperado:

- Cada archivo se procesa dentro del mismo `import_batch_id`.
- El reporte debe consolidar errores por archivo y por cliente.
- No se aplica nada hasta que el batch completo pase validacion minima.

## Formatos aceptados

Preferido:

- CSV UTF-8 con encabezados.
- Separador coma o punto y coma, documentado.
- Fechas en `YYYY-MM-DD` o `YYYY-MM-DD HH:mm:ss`.
- Montos decimales con punto o coma normalizable.

Aceptable:

- Excel `.xlsx` con una hoja por entidad o una hoja unica con columnas claras.

No aceptable sin conversion previa:

- PDF.
- Imagen.
- Excel con celdas combinadas complejas.
- Archivos con macros.
- Archivos sin encabezados.
- Archivos con multiples empresas mezcladas sin columna de empresa o sin separacion externa.

## Plantilla de clientes

Encabezados recomendados:

```csv
legacy_customer_id,customer_name,phone,email,status,created_at,notes
```

Campos requeridos:

- `customer_name`
- al menos uno entre `phone`, `email` o `legacy_customer_id`

Campos opcionales:

- `status`
- `created_at`
- `notes`

Reglas:

- `email` se normaliza con `trim` y lowercase.
- `phone` se normaliza quitando espacios, guiones y parentesis cuando aplique.
- `customer_name` se conserva para mostrar, pero el matching puede usar version normalizada sin acentos ni mayusculas.
- Si no hay telefono ni correo, `legacy_customer_id` se vuelve obligatorio para poder identificar al cliente.

## Plantilla de movimientos

Encabezados recomendados:

```csv
legacy_transaction_id,legacy_customer_id,phone,email,transaction_date,type,amount,points,reference,description
```

Campos requeridos:

- `transaction_date`
- `type`
- al menos uno entre `legacy_customer_id`, `phone` o `email`
- `points` para movimientos de puntos
- `amount` para compras cuando exista monto

Tipos soportados inicialmente:

- `purchase`
- `redemption`
- `points_adjustment_positive`
- `points_adjustment_negative`
- `legacy_balance_import`
- `legacy_balance_reconciliation`

Reglas:

- `purchase` puede mapear a `Purchases` si tiene monto y puntos ganados.
- `redemption` puede mapear a `Redemptions` si tiene puntos redimidos.
- Ajustes compactados no deben fingir facturas reales.
- `points` debe ser entero despues de normalizacion.
- `amount` debe tener 2 decimales despues de normalizacion cuando aplique.

## Plantilla compacta cliente + saldo

Encabezados recomendados:

```csv
legacy_customer_id,customer_name,phone,email,status,current_points_balance,balance_as_of,notes
```

Campos requeridos:

- `customer_name`
- `current_points_balance`
- `balance_as_of`
- al menos uno entre `phone`, `email` o `legacy_customer_id`

Reglas:

- `current_points_balance` no puede ser negativo salvo aprobacion explicita.
- Cada saldo genera un ajuste inicial con referencia al batch y fila original.

## Reglas de validacion

### Duplicados

Duplicados internos del archivo:

- Mismo `legacy_customer_id` repetido con datos distintos: error.
- Mismo email/telefono repetido para nombres distintos: warning o error segun diferencia.
- Mismo `legacy_transaction_id` repetido: error.

Duplicados contra Punto Club:

- Si coincide email o telefono dentro de la misma empresa, se propone actualizar o vincular, no crear duplicado.
- Si coincide por nombre solamente, no se debe auto-vincular; debe quedar como posible match.

### Clientes sin telefono/correo

- Permitidos solo si tienen `legacy_customer_id`.
- Si tampoco tienen `legacy_customer_id`, quedan rechazados.
- Si tienen nombre repetido y no tienen identificador fuerte, requieren decision manual.

### Acentos y mayusculas

Para matching y deduplicacion:

- no diferenciar mayusculas/minusculas;
- no diferenciar acentos;
- ignorar espacios dobles al comparar;
- conservar el texto original para mostrarlo en UI/reportes.

Ejemplo:

- `Jose Alvarez`, `JOSE ALVAREZ` y `Jose Alvarez` normalizado sin acento deben considerarse comparables.

### Fechas y zona horaria

- Fechas sin hora se interpretan como fecha local de Costa Rica para efectos de reporte.
- Timestamps internos deben terminar en UTC si se insertan en tablas operativas.
- Fechas futuras deben quedar como warning.
- Fechas imposibles o vacias en movimientos son error.

### Montos

- Compras deben tener monto mayor o igual a cero.
- Montos negativos no se aceptan como compra; deben mapearse a ajuste o reverso con aprobacion.
- Separadores decimales deben normalizarse.
- Moneda esperada: CRC salvo que el archivo indique otra y Product Owner apruebe conversion.

### Puntos

- Puntos ganados y redimidos deben ser enteros.
- Redenciones deben reducir saldo.
- Compras deben sumar puntos.
- Ajustes negativos pueden reducir saldo solo si estan explicitamente tipados.
- No permitir saldo final negativo sin aprobacion manual.

### Saldo inicial sin historico

Si no hay historico:

- crear solo ajuste de saldo inicial;
- marcar origen como migracion compactada;
- no crear facturas falsas;
- incluir fecha `balance_as_of`.

## Estrategia de trazabilidad

Todo batch debe tener:

- `import_batch_id`: identificador unico de carga.
- `source_system`: nombre del sistema viejo.
- `source_file`: nombre del archivo recibido.
- `source_row_number`: numero de fila original.
- `legacy_customer_id`: identificador del cliente en sistema viejo, si existe.
- `legacy_transaction_id`: identificador del movimiento en sistema viejo, si existe.
- `source_hash`: hash opcional de fila normalizada para idempotencia.
- `import_status`: `pending`, `valid`, `warning`, `error`, `applied`, `rejected`.

El reporte debe permitir responder:

- de que archivo vino este cliente;
- de que fila vino este movimiento;
- que batch lo cargo;
- si fue importado, rechazado o ajustado;
- que usuario/proceso aprobo la aplicacion real.

## Flujo recomendado

1. Recibir archivo real fuera del repo.
2. Copiarlo a una ubicacion temporal segura.
3. Ejecutar dry-run local o entorno controlado.
4. Generar reporte de validacion.
5. Revisar errores P0/P1.
6. Pedir decision Product Owner para warnings relevantes.
7. Cargar a staging.
8. Validar resumen por batch.
9. Aprobar aplicacion a tablas operativas.
10. Ejecutar aplicacion controlada.
11. Generar reporte final y conservar evidencia sin exponer datos sensibles.

## Criterios para aceptar un archivo real

Un archivo puede pasar a importacion controlada solo si:

- tiene encabezados claros;
- identifica la empresa destino;
- usa una plantilla conocida o mapeo documentado;
- no mezcla varias empresas sin separacion clara;
- contiene al menos una clave de match por cliente;
- el dry-run no tiene errores P0/P1;
- los warnings P2 relevantes fueron revisados;
- Product Owner aprueba el batch;
- existe backup/PITR vigente y se entiende el plan de reversa.

## Criterios para rechazar o pedir correccion

Rechazar o pedir correccion si:

- no hay forma de identificar clientes;
- faltan columnas requeridas;
- hay movimientos sin cliente;
- hay fechas invalidas masivas;
- hay saldos negativos no explicados;
- hay duplicados masivos sin identificador legacy;
- el archivo trae datos de otra empresa;
- el archivo contiene passwords, tarjetas, documentos sensibles no necesarios u otros datos que no deben migrarse.

## Reporte minimo de dry-run

Debe incluir:

- total de filas leidas;
- clientes detectados;
- clientes nuevos estimados;
- clientes que harian match con existentes;
- movimientos detectados;
- compras;
- redenciones;
- ajustes;
- errores;
- warnings;
- saldo total estimado antes/despues si aplica;
- muestras redaccionadas de errores por tipo.

## Decisiones pendientes

- Confirmar si se desea importar historico completo o solo saldo inicial por cliente.
- Confirmar si se aceptan ajustes negativos de saldo.
- Confirmar como manejar clientes sin telefono/correo.
- Confirmar si se necesita preservar invoice/reference legacy visible para la empresa.
- Confirmar si el primer import real sera una empresa piloto o todas las empresas.

