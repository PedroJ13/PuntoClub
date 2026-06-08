# TASK-157 - Handoff Backend API

## Resultado

Bloqueado por dependencia pendiente de TASK-156.

Backend/API reviso la asignacion, `docs/API_CONTRACTS.md` y `tasks/TASK-156-HANDOFF.md`. No se implemento validacion JWT de Entra External ID porque Infra/Azure confirmo que no existe todavia un external tenant accesible/confirmado ni valores publicos completos para configurar la API de forma segura.

## Impacto identificado antes de tocar contratos/modelo/endpoints

La integracion de Entra External ID impacta directamente:

- `POST /api/company-invitations/accept`.
- `GET /api/me`.
- `GET /api/my-company`.
- `PATCH /api/my-company`.
- Futuras rutas operativas autenticadas que deban resolver la empresa efectiva desde JWT validado + `CompanyUsers`, no desde `companyId` enviado por frontend.

Riesgo principal si se implementa con datos inferidos:

- Aceptar tokens de issuer/audience incorrectos.
- Rechazar tokens validos cuando el external tenant real quede configurado.
- Asociar usuarios a empresas con una fuente no confiable.

Por ese impacto, no se modificaron contratos, modelo, endpoints ni app settings.

## Bloqueo

Segun `tasks/TASK-156-HANDOFF.md`, faltan estos valores publicos/no secretos:

- External tenant name.
- External tenant ID.
- Tenant subdomain CIAM.
- Metadata URL `.well-known/openid-configuration`.
- `issuer`.
- `jwks_uri`.
- `puntoclub-web` client ID.
- `puntoclub-api` client ID.
- Application ID URI.
- Scope completo.
- User flow/policy sign-up/sign-in.

Tambien se confirmo que no hay app settings `AUTH_*` configurados en la Function App.

## Cambios realizados

No se hicieron cambios de codigo.

No se actualizaron:

- `docs/API_CONTRACTS.md`.
- `docs/DATA_MODEL.md`.
- Endpoints existentes.
- Modelo SQL.
- App settings.

Solo se creo este handoff.

## Endpoints/contratos afectados

Sin cambios aplicados.

Contratos pendientes de implementacion cuando Entra este listo:

- `POST /api/company-invitations/accept`: debe requerir JWT valido, usar el token de invitacion como autorizacion inicial y derivar `external_subject`/email desde claims.
- `GET /api/me`: debe resolver `CompanyUsers` por `auth_provider='entra_external_id'` y `external_subject`.
- `GET /api/my-company` y `PATCH /api/my-company`: deben resolver empresa desde el usuario autenticado y no aceptar `companyId` como autoridad.

## Variables de configuracion requeridas

Sin secretos:

```text
AUTH_PROVIDER=entra_external_id
AUTH_TENANT_ID=<external-tenant-id>
AUTH_ISSUER=<issuer desde metadata OIDC>
AUTH_JWKS_URI=<jwks_uri desde metadata OIDC>
AUTH_AUDIENCE=<audience confirmado contra access token real>
AUTH_CLIENT_ID=<puntoclub-web client id>
```

Notas:

- `AUTH_AUDIENCE` debe confirmarse contra el claim `aud` de un access token real emitido para `puntoclub-api`.
- No configurar estos valores con datos inferidos de `Default Directory`.
- No guardar client secrets, access tokens, refresh tokens ni cookies en repo.

## Pruebas ejecutadas

No se ejecutaron pruebas de API porque no hubo cambios de codigo.

Verificaciones realizadas:

- Lectura de `tasks/TASK-157-assignment.md`.
- Lectura de `AGENTS.md`.
- Lectura de `chat-start/BACKEND_API.md`.
- Lectura de `docs/MVP_RELEASE_STATUS.md`.
- Lectura de `docs/README.md`.
- Lectura de `docs/API_CONTRACTS.md`.
- Lectura de `tasks/TASK-156-HANDOFF.md`.
- Busqueda local de referencias a Entra/auth y endpoints afectados.

## Siguiente accion requerida

Product Owner / Infra debe completar Microsoft Entra External ID en un external tenant de clientes y entregar los valores publicos seguros indicados en TASK-156.

Cuando esos valores existan, Backend/API puede implementar la validacion JWT, `POST /api/company-invitations/accept`, `/api/me` y la resolucion server-side de empresa autorizada.
