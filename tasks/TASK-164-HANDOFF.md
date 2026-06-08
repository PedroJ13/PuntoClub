# TASK-164 - Handoff Backend API

## Resultado

Completado.

La API publicada ya contiene los endpoints de auth propia MVP y los endpoints objetivo ya no responden `404`.

## Dependencias verificadas

- `tasks/TASK-163-HANDOFF.md` confirma que la migracion SQL de auth propia fue aplicada y validada en Azure SQL real.
- Commit local/remote revisado:
  - `7fdba199de0c5a97464739f3714e7aae8741e2dd`
  - Titulo: `Implement local company auth flow`
  - Rama: `main`
- Workflow API validado:
  - Workflow: `Deploy Punto Club API`
  - Run ID: `27168383677`
  - Evento: `push`
  - Creado: `2026-06-08T21:34:23Z`
  - Actualizado: `2026-06-08T21:36:14Z`
  - Estado: `completed`
  - Conclusion: `success`
  - Head SHA: `7fdba199de0c5a97464739f3714e7aae8741e2dd`

## Smoke publicado

Base URL:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

No se usaron tokens reales, passwords reales, invitaciones reales ni `INTERNAL_ADMIN_TOKEN`.

Respuestas observadas:

| Endpoint | Metodo | Resultado |
| --- | --- | --- |
| `/api/me` | `GET` | `401 UNAUTHORIZED` |
| `/api/company-auth/login` | `POST` | `401 UNAUTHORIZED` |
| `/api/company-auth/logout` | `POST` | `200`, body `{"ok":true}`, con `Set-Cookie` |
| `/api/company-invitations/accept` | `POST` | `400 VALIDATION_ERROR` |

Detalles:

```text
GET /api/me
401 {"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}
```

```text
POST /api/company-auth/login
401 {"error":{"code":"UNAUTHORIZED","message":"Invalid email or password."}}
```

```text
POST /api/company-auth/logout
200 {"ok":true}
Set-Cookie presente: si
```

```text
POST /api/company-invitations/accept
400 {"error":{"code":"VALIDATION_ERROR","message":"One or more fields are invalid.", ...}}
```

## Interpretacion

- `GET /api/me` responde `401`, lo esperado sin cookie de sesion.
- `POST /api/company-auth/login` responde `401`, lo esperado con email/password falsos.
- `POST /api/company-auth/logout` responde `200`, lo esperado incluso sin sesion activa, y limpia cookie.
- `POST /api/company-invitations/accept` responde `400`, lo esperado con payload vacio.
- El `404` publicado reportado por TASK-162 ya no se reproduce para los endpoints Backend de auth propia.

## Riesgos o bloqueos

- No se valido aceptacion con token real ni login con usuario real, por alcance seguro de esta tarea y para no usar/imprimir secretos ni passwords reales.
- Queda para QA/TASK-166 validar el flujo end-to-end con invitacion real/controlada: invitacion -> crear password -> login -> panel empresa.
- La estrategia de cookie `SameSite=Lax` debe validarse desde el frontend publicado contra la API publicada; si el navegador no envia cookie en llamadas cross-site, se requerira ajuste de arquitectura/proxy/dominio o decision explicita de cookie strategy.
