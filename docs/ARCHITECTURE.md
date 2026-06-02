# Architecture

## Arquitectura inicial

- Frontend: Azure Static Web Apps.
- API: Azure Functions.
- Base de datos: Azure SQL Database existente `sqlserver-pj13-brazil/sql-db-puntoclub`.
- Storage: pendiente de decision para logos.
- Auth fase 1: modo empresa piloto unica con `PILOT_COMPANY_ID` server-side.

## Principios

- Uso real piloto desde el inicio.
- Persistencia central.
- Reglas de integridad cerca de la base de datos cuando aplique.
- Contratos API pequenos y estables.
- Separacion por empresa desde el modelo.
- Para MVP, el frontend no es fuente confiable de empresa. La API valida el `companyId` del path contra configuracion server-side.

## Ambientes

- Local: desarrollo.
- Production: piloto inicial.
- Staging: opcional, pendiente de recomendacion Infra.

## Pendientes de arquitectura

- Definir estrategia de secrets y connection strings.
- Definir si logos se almacenan en Azure Storage o URL externa.
- Definir estrategia de migraciones SQL.

## Auth fase 1

El MVP no implementa multiempresa autoservicio ni usuarios por empresa.

Decision operativa:

- Configurar `PILOT_COMPANY_ID` en Azure Functions como secreto/config de ambiente.
- Configurar `SQL_CONNECTION_STRING` contra `sqlserver-pj13-brazil/sql-db-puntoclub` como secreto/config de ambiente.
- Mantener rutas `/api/companies/{companyId}` para compatibilidad con el modelo futuro.
- Backend/API debe rechazar cualquier `companyId` que no coincida con `PILOT_COMPANY_ID`.
- Web Dev puede leer un `companyId` configurado para construir rutas, pero no debe permitir editarlo ni usarlo como control de seguridad.
- El acceso a la app piloto debe limitarse con controles de Azure Static Web Apps o proceso operativo mientras se define auth SaaS completa.
