# Chat - Revision de respaldos y restore Azure SQL

Documento para abrir un chat dedicado a revisar respaldos, retencion, costos y recuperacion de Azure SQL en Punto Club.

## Rol

Trabaja como `Ejecucion Tecnica`.

Modo de ejecucion principal:

```text
Infra Azure / SQL DEV
```

Este chat no implementa producto, no toca UI, no modifica API y no cambia datos de negocio. Su foco es proteccion de datos, costos y capacidad de recuperacion.

## Documentos a leer primero

Leer en este orden:

1. `AGENTS.md`
2. `docs/OPERATING_STATUS.md`
3. `docs/PROJECT_OPERATING_RULES.md`
4. `codex-project-templates/EJECUCION_TECNICA.md`
5. `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`
6. `docs/AZURE_SQL_COST_GUARDRAILS.md`
7. `docs/SQL_AZURE_CONNECTION_NOTES.md`
8. `docs/PILOT_RUNBOOK.md`
9. `tasks/TASK-016-HANDOFF.md`
10. `C:\Work\project-process-notes\revision_respaldos_puntoclub.md`

Leer otros handoffs solo si son necesarios para confirmar configuracion de Azure SQL, permisos, migraciones o riesgos.

## Objetivo

Revisar la estrategia actual de respaldo, retencion y recuperacion de la base:

```text
SQL Server: sqlserver-pj13-brazil
Database: sql-db-puntoclub
Resource group: resource_group_main
```

La pregunta central:

```text
Si se borra informacion, una migracion rompe datos, una tabla queda corrupta o se elimina la base, que podemos recuperar, hasta que punto en el tiempo y en cuanto tiempo?
```

## Regla principal

Antes de aplicar cualquier cambio, evaluar costo, impacto y riesgo.

No aplicar cambios de configuracion, retencion, redundancia, LTR, locks, auditoria, exports, restores, firewall o permisos sin aprobacion explicita de Product Owner / Proyecto.

Primero se entrega diagnostico y recomendacion.

## Alcance permitido sin aprobacion adicional

Solo lectura / diagnostico:

- Inventariar SQL Server y Azure SQL Database.
- Consultar configuracion de backup/retencion.
- Consultar backup redundancy.
- Consultar si existe Long-Term Retention.
- Consultar locks existentes.
- Consultar configuracion de auditing/diagnostic settings si es de solo lectura.
- Consultar permisos/roles a nivel Azure cuando no exponga secretos.
- Estimar costos de opciones usando documentacion/CLI/precios disponibles.
- Documentar hallazgos.

No imprimir secretos, connection strings, passwords, tokens ni datos sensibles.

## Fuera de alcance sin aprobacion explicita

No hacer sin aprobacion:

- Cambiar short-term retention.
- Activar o modificar Long-Term Retention.
- Cambiar backup storage redundancy.
- Crear restore real.
- Crear BACPAC/export.
- Crear, borrar o modificar locks.
- Cambiar firewall.
- Cambiar permisos/roles.
- Cambiar SKU/tier/compute.
- Borrar bases restauradas.
- Ejecutar consultas sobre datos de negocio salvo validacion aprobada.
- Aplicar scripts SQL.

## Revision requerida

### 1. Inventario actual

Confirmar:

```text
Subscription:
Resource Group:
SQL Server:
Database:
Region:
Tier/SKU:
Serverless/provisioned:
Auto-pause:
Backup storage redundancy:
Secondary region si aplica:
Public network access:
Firewall relevante:
Locks existentes:
Replicas/failover:
```

### 2. Short-term retention / PITR

Confirmar:

- retencion actual;
- maximo permitido por tier;
- si esta en default o fue configurada;
- costo/impacto estimado de subirla.

Entregar:

```text
Retencion actual:
Retencion recomendada:
Opciones:
Costo estimado:
Riesgo si se mantiene igual:
```

### 3. Backup storage redundancy

Confirmar si es:

- Local redundant;
- Zone redundant;
- Geo redundant;
- Geo-zone redundant.

Entregar recomendacion con costo/impacto:

```text
Redundancia actual:
Alternativas:
Costo estimado:
Riesgo cubierto:
Riesgo no cubierto:
Recomendacion:
```

### 4. Long-Term Retention

Confirmar si LTR existe.

Evaluar:

- semanal;
- mensual;
- anual;
- retencion minima razonable para piloto;
- costo estimado.

No activar sin aprobacion.

### 5. Restore de base borrada

Documentar:

- diferencia entre borrar database y borrar server;
- que se puede restaurar dentro de PITR;
- que pasa si se elimina SQL Server;
- si locks reducirian riesgo de borrado accidental.

### 6. Prueba de restore

No ejecutar al inicio.

Primero proponer plan con costo:

```text
Nombre DB restaurada:
Hora objetivo:
Tiempo estimado:
Costo mientras exista:
Validaciones:
Plan de eliminacion:
Riesgos:
```

Solo ejecutar si Product Owner / Proyecto aprueba.

### 7. BACPAC/export

Evaluar si conviene:

- solo antes de migraciones grandes;
- mensual durante piloto;
- no necesario por ahora.

No exportar sin aprobacion.

### 8. Permisos y proteccion contra borrado

Revisar de forma no destructiva:

- quienes pueden borrar DB/server/resource group;
- si hay Owner/Contributor amplios;
- si existen locks;
- si runtime API tiene permisos minimos;
- si hay riesgo de usar credenciales admin para runtime.

### 9. Auditoria y monitoreo

Revisar:

- Azure SQL Auditing;
- Diagnostic settings;
- Activity Log;
- alertas por delete, firewall/config changes o SQL unavailable.

No activar sin aprobacion.

## Costos a evaluar antes de proponer cambios

Como minimo evaluar costo/impacto de:

- subir PITR de 7 a 14/35 dias;
- activar LTR semanal/mensual;
- cambiar backup redundancy de local a geo/zone si aplica;
- crear una DB restaurada temporal para prueba;
- export BACPAC y storage asociado;
- locks no tienen costo relevante, pero pueden impactar operacion;
- auditing/log analytics/storage de logs si se activa.

El handoff debe separar:

```text
Sin costo / costo despreciable:
Costo bajo:
Costo recurrente:
Costo temporal:
Impacto operacional:
```

## Criterios de aceptacion del diagnostico

La revision inicial se considera completa cuando:

- se identifico la DB correcta;
- se confirmo PITR;
- se confirmo backup redundancy;
- se confirmo si LTR esta activo;
- se revisaron locks/permisos a nivel razonable;
- se evaluaron costos antes de recomendar cambios;
- se propuso plan de restore controlado sin ejecutarlo;
- se entrego recomendacion P1/P2/P3;
- no se modifico Azure ni SQL sin aprobacion.

## Handoff esperado

Crear o actualizar el handoff que Proyecto indique, o si aun no hay tarea numerada, entregar el resultado en formato:

```text
Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra Azure / SQL DEV
Tarea:
Resultado:
SQL Server revisado:
Database revisada:
Configuracion actual:
Costos evaluados:
Riesgos encontrados:
Cambios aplicados: Ninguno / <detalle si hubo aprobacion>
Mejoras recomendadas:
Prueba de restore:
Uso cloud/SQL:
Datos sensibles expuestos: No
Decision requerida:
Siguiente recomendado:
```

## Recomendacion inicial esperada

No asumir que Azure automatic backups son suficientes hasta confirmar:

- retencion;
- redundancia;
- posibilidad real de restore;
- permisos destructivos;
- locks;
- auditoria;
- costo de mejorar.

La primera entrega debe ser diagnostico + costo + recomendacion, no cambios.

