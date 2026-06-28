# Azure SQL backup/restore - paquete minimo aplicado

Fecha: 2026-06-25

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra Azure / SQL DEV

## Contexto

Se hizo una revision inicial de respaldos, retencion, costos y recuperacion para la Azure SQL Database productiva de Punto Club.

Recursos revisados:

- Subscription: `as_main`
- Resource group: `resource_group_main`
- SQL Server: `sqlserver-pj13-brazil`
- Database: `sql-db-puntoclub`
- Region SQL: `brazilsouth`

La decision del Product Owner fue aplicar solo el paquete minimo con costo esperado cero o despreciable:

- No cambiar backup redundancy a geo-redundante.
- No activar LTR.
- No crear restore temporal.
- No activar diagnostics/auditing con destinos que puedan generar costo recurrente.
- Si aplicar protecciones minimas sin tocar datos de negocio.

## Diagnostico inicial encontrado

Configuracion observada antes del cambio:

- DB en estado `Paused`.
- Tier/SKU: `GeneralPurpose`, `GP_S_Gen5_1`, serverless.
- Min capacity: `0.5`.
- Auto-pause: `15` minutos.
- Free limit behavior: `BillOverUsage`.
- Backup storage redundancy: `Local`.
- PITR / short-term retention: `7` dias.
- LTR: apagado.
- Replicas/failover groups: ninguno.
- Locks: no habia locks de Punto Club para SQL Server/DB.
- Auditing SQL: desactivado.
- Diagnostic settings: no configurados para SQL Server/DB.
- Activity Log alerts de Punto Club para SQL: no existian.
- Firewall relevante: `AllowAllWindowsAzureIps`.

## Cambios aplicados

### 1. PITR subido a 14 dias

Se cambio la retencion short-term/PITR de `7` a `14` dias.

Estado verificado:

```text
retentionDays: 14
diffBackupIntervalInHours: 12
```

Razon:

- Da una ventana mas razonable para detectar y revertir errores recientes.
- No activa LTR.
- No cambia redundancia.
- Costo esperado: cero o bajo, sujeto a que el consumo de backup no exceda lo incluido por Azure SQL.

### 2. Action group minimo creado

Se creo el action group:

```text
ag-puntoclub-sql-min
```

Uso:

- Recibir notificaciones de alertas minimas de SQL.
- No se crearon webhooks, Logic Apps, Functions ni integraciones con costo.

### 3. Locks CanNotDelete creados

Se crearon locks de proteccion contra borrado accidental:

```text
puntoclub-sqlserver-cannotdelete
puntoclub-sqldb-cannotdelete
```

Alcance:

- SQL Server productivo.
- Azure SQL Database productiva.

Impacto:

- Bloquea borrados accidentales.
- Puede requerir retirar temporalmente el lock si en el futuro se necesita borrar o reemplazar el recurso con aprobacion explicita.
- Costo esperado: cero.

### 4. Alertas minimas de Activity Log creadas

Se crearon 8 alertas `ala-puntoclub-*`:

```text
ala-puntoclub-sqlserver-delete
ala-puntoclub-sqldb-delete
ala-puntoclub-sqldb-write
ala-puntoclub-sql-firewall-write
ala-puntoclub-sql-firewall-delete
ala-puntoclub-sql-lock-write
ala-puntoclub-sql-lock-delete
ala-puntoclub-sqldb-resource-health
```

Cubren:

- Intentos/cambios de borrado del SQL Server.
- Intentos/cambios de borrado de la DB.
- Cambios de configuracion de la DB.
- Cambios de reglas de firewall SQL.
- Cambios de locks.
- Eventos de Resource Health de la DB.

Costo esperado:

- Cero o despreciable para alertas basadas en Activity Log con notificacion por email.
- No se activo Log Analytics ni almacenamiento de diagnostics para evitar costo recurrente.

## Cambios no aplicados

### Backup redundancy

No se cambio:

```text
Local
```

Motivo:

- Product Owner indico explicitamente no cambiar a geo-redundante.
- Cambiar a RA-GRS/RA-GZRS puede aumentar costo de backup storage.

Pendiente:

- Reconsiderar si Punto Club requiere recuperacion ante incidente regional.

### LTR

No se activo Long-Term Retention.

Estado actual:

```text
weeklyRetention: PT0S
monthlyRetention: PT0S
yearlyRetention: PT0S
timeBasedImmutability: Disabled
```

Motivo:

- Evitar costo recurrente.
- La proteccion actual queda enfocada en corto/medio corto plazo con PITR de 14 dias.

Pendiente:

- Decidir mas adelante si se necesita una copia mensual durante piloto.

### Restore temporal

No se creo restore temporal.

Motivo:

- Crear una DB restaurada puede generar costo temporal de compute/storage.
- La tarea actual pidio mantener el costo en cero.

Pendiente:

- Ejecutar una prueba controlada de restore solo con aprobacion explicita.

### Auditing / diagnostic settings

No se activo SQL Auditing ni diagnostic settings hacia Storage/Log Analytics.

Motivo:

- Pueden generar costo recurrente por almacenamiento o ingestion.
- Se priorizaron alertas minimas de Activity Log.

Pendiente:

- Definir si se acepta un costo bajo para auditoria basica.

### BACPAC/export

No se creo export BACPAC.

Motivo:

- Puede generar costo de storage y operacion.
- No reemplaza PITR/LTR.

Pendiente:

- Considerarlo solo antes de migraciones grandes o cierres de mes aprobados.

## Estado actual despues del paquete

Proteccion actual:

- PITR: `14` dias.
- LTR: apagado.
- Backup redundancy: `Local`.
- Locks: activos en SQL Server y DB.
- Alertas: activas para delete/write/firewall/locks/resource health.
- Restore probado: no.
- Auditing/diagnostics: no.

## Riesgos que quedan abiertos

P1:

- No hay prueba real de restore ejecutada/documentada.
- Backup redundancy sigue siendo `Local`, por decision explicita.

P2:

- No hay LTR mensual/semanal.
- No hay auditoria SQL ni diagnostic settings.
- Firewall conserva regla amplia `AllowAllWindowsAzureIps`.

P3:

- Falta runbook formal de disaster recovery con RTO/RPO.
- Falta decidir si habra BACPAC previo a migraciones grandes.

## Siguiente recomendado

Mantener este paquete como baseline minimo de proteccion.

Cuando Proyecto acepte un costo temporal pequeno, el siguiente paso recomendado es:

1. Crear una tarea de restore controlado a DB nueva.
2. Medir tiempo de restore.
3. Validar metadata/tablas criticas sin exponer datos de negocio.
4. Borrar la DB restaurada al finalizar.

Cuando Proyecto acepte costo recurrente bajo, evaluar:

1. LTR mensual por 3 a 6 meses.
2. SQL Auditing basico.
3. Diagnostic settings con retencion controlada.

## Uso cloud / SQL

Uso cloud: Si, Azure control-plane.

Uso SQL/datos de negocio: No.

Datos sensibles expuestos: No.

Cambios de datos de negocio: Ninguno.

Cambios de configuracion aplicados:

- PITR `14` dias.
- Action group minimo.
- Locks `CanNotDelete`.
- Activity Log alerts minimas.
