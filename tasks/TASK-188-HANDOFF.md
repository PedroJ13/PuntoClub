# TASK-188 - Handoff Infra / Azure

## Resumen

Se reviso la arquitectura publicada para decidir si Backend/API puede usar IP cliente de forma confiable para rate limiting/lockout.

Resultado: completado.

Decision: no aprobar bloqueo/lockout fuerte por IP en la arquitectura actual. Para TASK-189, usar rate limiting persistente por email normalizado y por token/invitacion como controles principales. El limite por IP debe quedar omitido temporalmente o, si se implementa, deshabilitado por defecto y solo como senal best-effort no autoritativa.

Fecha/hora:

- `2026-06-09 08:59 -06:00`

## Arquitectura observada

Function App:

- Nombre: `func-puntoclub-prod-br-001`
- Host: `func-puntoclub-prod-br-001.azurewebsites.net`
- Resource group: `resource_group_main`
- `publicNetworkAccess=Enabled`
- Access restrictions:
  - main site: `Allow all`
  - scm/kudu: `Allow all`
- No se observo una restriccion que obligue a entrar por Front Door, Application Gateway, Private Endpoint u otro proxy controlado.

Static Web Apps:

- Nombre: `swa-puntoclub-prod-001`
- Host: `calm-dune-075dc5c0f.7.azurestaticapps.net`
- SKU: `Free`

Frontend publicado:

- `app/app-config.js` apunta directamente a `https://func-puntoclub-prod-br-001.azurewebsites.net`.
- Es decir, el navegador llama directo a la Function App publicada, no a un backend integrado/proxyado por SWA.

## Headers revisados

Candidato principal:

- `x-forwarded-for`

Motivo:

- Es el header estandar para identificar IP original cuando hay proxies.
- Microsoft documenta `X-Forwarded-For` como header soportado para filtros HTTP en App Service access restrictions.
- Tambien es el mecanismo habitual usado por proxies Azure como Front Door/Application Gateway para preservar IP cliente.

No recomendado en este momento:

- `x-client-ip`

Motivo:

- No queda confirmado por documentacion oficial de App Service/Functions para esta arquitectura como header confiable equivalente.
- No debe usarse como fuente principal de rate limiting sin validacion especifica.

## Confiabilidad en la arquitectura actual

`x-forwarded-for` es util para diagnostico y puede aparecer por la cadena de App Service/proxy, pero no debe tratarse como fuente autoritativa de identidad de red en Punto Club mientras:

- la Function App acepte trafico publico directo (`Allow all`);
- no haya Front Door/Application Gateway/Private Endpoint obligado;
- no exista una regla de access restriction que garantice que todo request proviene de un proxy confiable;
- Backend no tenga una forma validada de distinguir una entrada agregada por plataforma frente a una entrada inyectada por cliente.

Riesgo principal:

- Si un cliente puede enviar o manipular `x-forwarded-for`, un atacante podria evadir o contaminar el limite por IP, o provocar bloqueo de terceros si Backend confia ciegamente en el primer valor.

## Recomendacion para TASK-189

### Login

Endpoint:

- `POST /api/company-auth/login`

Implementar ahora:

- rate limit/lockout persistente por email normalizado hasheado.

No implementar todavia como control fuerte:

- lockout por IP.

Opcional si Backend lo quiere dejar preparado:

- calcular IP best-effort para telemetria o contador suave, detras de feature flag deshabilitado por defecto.
- si no hay IP confiable, no bloquear y continuar con limite por email.

### Aceptar invitacion

Endpoint:

- `POST /api/company-invitations/accept`

Implementar ahora:

- rate limit persistente por token/invitacion hasheada.
- si el token existe, asociar tambien a email de invitacion hasheado si el contrato SQL/API lo permite.

No implementar todavia como control fuerte:

- lockout por IP.

Opcional si Backend lo quiere dejar preparado:

- IP best-effort para observabilidad o contador suave, nunca como unica razon de bloqueo.

## Regla propuesta para `getClientIp(request)`

Mientras no exista proxy confiable obligatorio, la regla segura es:

```js
function getClientIp(request) {
  return null;
}
```

Esto fuerza a TASK-189 a degradar correctamente:

- si `getClientIp(request)` retorna `null`, omitir limite por IP;
- aplicar limites por email/token;
- no fallar la autenticacion por ausencia de IP;
- no registrar IP raw.

Si Product/Architect aprueba una mejora futura con Front Door/Application Gateway y access restrictions que bloqueen acceso directo a la Function App, la regla puede evolucionar a:

```js
function getClientIp(request) {
  const raw = request.headers.get('x-forwarded-for');
  if (!raw) return null;

  const candidates = raw
    .split(',')
    .map((part) => normalizeIpCandidate(part))
    .filter(Boolean);

  const firstPublicIp = candidates.find((ip) => isPublicIp(ip));
  return firstPublicIp || null;
}
```

Notas para esa version futura:

- Normalizar IPv4 e IPv6.
- Aceptar IPv6 entre corchetes y remover puerto si viene como `ip:port`.
- Usar `node:net.isIP()` o helper equivalente para validar sintaxis.
- Rechazar rangos privados, loopback, link-local, multicast, unspecified y valores reservados.
- Hashear la IP normalizada antes de persistirla.
- No guardar IP raw salvo decision explicita de privacidad/seguridad.
- No usar `x-client-ip` salvo validacion separada.

## Evidencia segura

Consultas Azure no sensibles:

- `az functionapp show`
  - `publicNetworkAccess=Enabled`
  - host `func-puntoclub-prod-br-001.azurewebsites.net`
  - Function App Linux en estado `Running`
- `az functionapp config access-restriction show`
  - main site `Allow all`
  - scm site `Allow all`
- `az staticwebapp show`
  - host `calm-dune-075dc5c0f.7.azurestaticapps.net`
  - SKU `Free`
- Repo:
  - `app/app-config.js` apunta directo a `https://func-puntoclub-prod-br-001.azurewebsites.net`.

No se imprimieron IPs reales completas en este handoff.

## Referencias Microsoft revisadas

- Microsoft Learn: App Service access restrictions se aplican en los front-end roles, antes de los workers donde corre el codigo.
- Microsoft Learn: App Service HTTP header filtering soporta `X-Forwarded-For` como header estandar para identificar IP originaria de cliente conectado por proxy.
- Microsoft Learn: para restringir trafico a una instancia especifica de Azure Front Door se debe combinar service tag `AzureFrontDoor.Backend` con el header `X-Azure-FDID`.

## Cambios realizados

- No se cambio Azure.
- No se cambio codigo.
- No se cambio SQL.
- No se tocaron secretos.
- No se habilitaron servicios nuevos.

## Pendientes / ruta futura

Para aprobar un limite por IP confiable:

1. Poner la Function App detras de un borde controlado, por ejemplo Azure Front Door o Application Gateway.
2. Bloquear acceso directo a `func-puntoclub-prod-br-001.azurewebsites.net` usando access restrictions.
3. Si se usa Front Door, restringir por service tag `AzureFrontDoor.Backend` y `X-Azure-FDID`.
4. Validar con un endpoint temporal/controlado o logging redaccionado que `x-forwarded-for` llega con el formato esperado.
5. Recién entonces habilitar `getClientIp()` basado en `x-forwarded-for`.

## Riesgos

- P1: usar `x-forwarded-for` como bloqueo fuerte sin proxy confiable puede ser evadible o causar bloqueos falsos.
- P1: usar IP como unica defensa permitiria falsa sensacion de seguridad; email/token deben ser los controles principales.
- P2: almacenar IP raw aumenta superficie de datos sensibles; preferir hash con normalizacion.
- P2: NAT/corporate networks pueden agrupar usuarios legitimos detras de una sola IP; usar umbrales suaves si se habilita en el futuro.
