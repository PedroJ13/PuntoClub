# TASK-103 - Exponer lectura API de auditoria operativa

## Equipo

Backend API

## Contexto

TASK-099 implemento escritura best-effort de auditoria, pero TASK-101 no aprobo porque no existe endpoint publicado de lectura. Web Dev preparo la UI esperando esta ruta:

```text
GET /api/companies/{companyId}/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=N
```

## Objetivo

Implementar y documentar endpoint de lectura de auditoria operativa para que Web/QA puedan validar eventos publicados.

## Alcance

- Agregar Azure Function HTTP para:

```text
GET /api/companies/{companyId}/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10|25|50
```

- Validaciones:
  - `companyId` contra `PILOT_COMPANY_ID`;
  - `from` y `to` requeridos;
  - formato `YYYY-MM-DD`;
  - `from <= to`;
  - rango maximo recomendado 31 dias;
  - `limit` permitido: `10`, `25`, `50`; default `25`.
- Respuesta esperada:
  - `from`;
  - `to`;
  - `limit`;
  - `items`.
- Cada item debe incluir:
  - id string;
  - occurredAt ISO;
  - eventType;
  - entityType;
  - entityId string/null;
  - customerId string/null;
  - customerName si se puede resolver;
  - actorLabel;
  - source;
  - metadata parseada o null.
- Agregar pruebas unitarias/formatter/validator donde aplique.
- Actualizar `docs/API_CONTRACTS.md`.

## No tocar

- No cambiar UI.
- No cambiar reglas de puntos.
- No crear auth/roles.
- No imprimir secretos.

## Dependencias

- TASK-102 aplicada para validacion real persistente.
- Si se prueba local con Azure Functions, usar `func start` desde `api/` si esta disponible en la sesion.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-103-HANDOFF.md
```

Incluye endpoint, contrato final, pruebas, evidencia local/Azure si aplica y pendientes de deploy.
