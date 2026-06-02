# Architecture

## Arquitectura inicial

- Frontend: Azure Static Web Apps.
- API: Azure Functions.
- Base de datos: Azure SQL Database minima.
- Storage: pendiente de decision para logos.
- Auth fase 1: pendiente de decision.

## Principios

- Uso real piloto desde el inicio.
- Persistencia central.
- Reglas de integridad cerca de la base de datos cuando aplique.
- Contratos API pequenos y estables.
- Separacion por empresa desde el modelo.

## Ambientes

- Local: desarrollo.
- Production: piloto inicial.
- Staging: opcional, pendiente de recomendacion Infra.

## Pendientes de arquitectura

- Definir autenticacion fase 1.
- Definir estrategia de secrets y connection strings.
- Definir si logos se almacenan en Azure Storage o URL externa.
- Definir estrategia de migraciones SQL.
