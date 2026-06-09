# TASK-188 - Confirmar IP confiable para rate limiting en Azure Functions

Equipo responsable: Infra / Azure

## Contexto

TASK-182 recomienda limite adicional por IP para login y aceptar invitacion, pero solo si la Function App publicada expone una senal confiable de IP cliente.

No se debe implementar bloqueo por IP con headers no confiables sin validar como llegan en Azure Functions.

## Objetivo

Confirmar que header o mecanismo debe usar Backend/API para obtener IP cliente en la Function App publicada.

## Alcance

- Revisar Azure Functions/App Service headers disponibles para requests publicados.
- Identificar si `x-forwarded-for`, `x-client-ip` u otro header es confiable en esta arquitectura actual.
- Proponer regla exacta para `getClientIp(request)`:
  - header preferido;
  - normalizacion IPv4/IPv6;
  - que hacer si no hay IP confiable.
- No imprimir IPs reales completas en handoff si no es necesario; redaccionar o usar ejemplo.
- No modificar codigo salvo configuracion estrictamente necesaria y documentada.
- No tocar secretos.

## Entregable

Crear o actualizar `tasks/TASK-188-HANDOFF.md` con:

- Resultado.
- Header o mecanismo recomendado.
- Si el limite por IP se aprueba o debe omitirse temporalmente.
- Evidencia segura/redaccionada.
- Riesgos o pendientes.
