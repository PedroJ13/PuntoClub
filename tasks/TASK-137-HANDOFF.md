# TASK-137 - Handoff Infra / Azure

## Resumen

Se configuraron app settings en Azure Functions para la autorizacion temporal interna de endpoints de revision de empresas e invitaciones.

Function App:

- `func-puntoclub-prod-br-001`

Hora aproximada:

- `2026-06-07 20:53 -06:00`

## Cambios aplicados

Se configuraron estos app settings:

- `INTERNAL_ADMIN_TOKEN`
- `COMPANY_REGISTRATION_REVIEW_ENABLED=true`
- `COMPANY_INVITATION_MANAGEMENT_ENABLED=true`

El valor de `INTERNAL_ADMIN_TOKEN` fue generado como token fuerte y configurado directamente en Azure Functions. No se imprimio, no se guardo en archivos, no se agrego al repo y no debe exponerse al frontend.

Impacto:

- Azure Functions reinicia al actualizar app settings.
- Los endpoints internos quedan habilitados solo cuando reciben el header `x-puntoclub-admin-token` con el valor correcto.
- El mecanismo es temporal hasta que Entra External ID y roles admin reales queden listos.

## Confirmacion previa de deploy

Se intento confirmar metadatos de deployment:

- `gh` no esta instalado en la maquina local.
- El conector GitHub no encontro workflow runs asociados al commit local actual.
- Kudu/SCM devolvio `401 Unauthorized` al intentar leer deployments con publishing credentials.

Como alternativa conservadora, se hizo validacion funcional:

1. Se configuro primero `INTERNAL_ADMIN_TOKEN`.
2. Se activaron los feature flags.
3. Se probo inmediatamente que endpoints internos sin header respondieran `403`.
4. El script estaba preparado para apagar ambos flags si algun endpoint interno no respondia `403`.
5. Ambos endpoints internos respondieron `403`, por lo que los flags quedaron activos.

## Validaciones realizadas

Settings presentes por nombre:

- `INTERNAL_ADMIN_TOKEN`
- `COMPANY_REGISTRATION_REVIEW_ENABLED`
- `COMPANY_INVITATION_MANAGEMENT_ENABLED`

Flags no secretos verificados:

- `COMPANY_REGISTRATION_REVIEW_ENABLED=true`
- `COMPANY_INVITATION_MANAGEMENT_ENABLED=true`

Endpoints internos sin header:

- `POST /api/company-invitations`
  - Resultado: `403`
- `POST /api/company-registration-requests/1/approve`
  - Resultado: `403`

Endpoints publicos existentes:

- `GET /api/companies/1/settings`
  - Resultado: `200`
- `POST /api/company-registration-requests` con payload invalido `{}`
  - Resultado: `400`
  - Interpretacion: ruta publica responde de forma controlada sin crear datos.

## No se hizo

- No se creo ni configuro Microsoft Entra External ID.
- No se implemento auth en API/Web.
- No se cambio pipeline.
- No se expuso el token en logs compartidos, handoff ni repo.
- No se aprobo/rechazo ninguna empresa real.
- No se creo invitacion real.

## Nota para QA

QA puede validar que los endpoints internos sin header devuelven `403`.

Para pruebas con header valido, el token debe entregarse por un canal seguro fuera del repo y nunca debe copiarse en capturas, issues, handoffs o frontend.

Header requerido:

```text
x-puntoclub-admin-token: <valor seguro fuera de repo>
```

## Riesgos

- P1: `INTERNAL_ADMIN_TOKEN` es una proteccion temporal compartida; debe reemplazarse por Entra External ID y roles admin reales.
- P1: Si el token se comparte por un canal inseguro, debe rotarse inmediatamente.
- P1: No exponer `INTERNAL_ADMIN_TOKEN` en Static Web Apps ni variables publicas de frontend.
- P2: Los endpoints internos ya estan habilitados por feature flag; la proteccion efectiva depende de mantener secreto el header token.
- P2: La confirmacion de deployment se hizo por comportamiento funcional porque no hubo acceso util a metadatos de GitHub Actions/Kudu desde esta maquina.

## Costo

Sin costo incremental esperado. Solo se actualizaron app settings de una Function App existente.
