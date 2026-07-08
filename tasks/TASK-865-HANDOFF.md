# TASK-865 - Handoff

Nombre del Equipo: Infra
Modo: Azure Communication Services / Diagnostico sender propio
Fecha: 2026-07-08

## Estado

Completada como diagnostico.

No se reenviaron correos reales. No se cambiaron ACS, DNS, app settings, SQL, Storage ni codigo desde esta tarea.

## Contexto revisado

Se reviso `tasks/TASK-864-HANDOFF.md`.

Ventana investigada:

```txt
2026-07-08 16:05-16:09 -06:00
2026-07-08 22:05-22:09 UTC
```

Intentos de TASK-864:

- Compra QA: `QA-SENDER-864-20260708-1538`.
- Correo operativo a destinatario autorizado: `pj13eros@hotmail.com`.
- Campana QA: `QA Sender TASK-864 20260708`, campaignId visible `25`.
- Correo promocional a destinatario autorizado: `pj13eros@hotmail.com`.

## Configuracion verificada

Dominio ACS Email:

```txt
Email Communication Service: email-puntoclub-prod-001
Domain: mail.puntoclubcr.com
Provisioning state: Succeeded
Domain: Verified
SPF: Verified
DKIM: Verified
DKIM2: Verified
DMARC: NotStarted en Azure CLI, pero TXT publico existe segun TASK-853
```

Sender usernames:

```txt
operaciones / Punto Club Operaciones
campanas / Punto Club Campañas
donotreply / DoNotReply
```

App settings no secretos confirmados:

```txt
ACS_EMAIL_SENDER_ADDRESS=operaciones@mail.puntoclubcr.com
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Operaciones
PROMOTIONAL_EMAIL_SENDER_ADDRESS=campanas@mail.puntoclubcr.com
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Campañas
```

## Hallazgo principal

El recurso ACS usado por la plataforma no tiene enlazado el dominio custom:

```txt
Communication Service: acs-puntoclub-prod-001
linkedDomains:
- .../emailServices/email-puntoclub-prod-001/domains/AzureManagedDomain
```

No aparece:

```txt
.../emailServices/email-puntoclub-prod-001/domains/mail.puntoclubcr.com
```

Application Insights muestra para el envio operativo:

```txt
2026-07-08T22:05:35Z
operation: createPurchase
warning: Operational email was not sent: purchase. The specified sender domain has not been linked.
```

Esto coincide directamente con el estado de `linkedDomains`.

## Requests observados

Application Insights mostro:

```txt
2026-07-08T22:05:34Z createPurchase 201 success=True
2026-07-08T22:08:27Z sendPromotionalCampaign 200 success=True
```

Interpretacion:

- La compra y el endpoint promocional no fallaron como HTTP.
- El fallo ocurre al intentar enviar via ACS Email y queda registrado como fallo de proveedor/mensaje.
- El flujo promocional actual no dejaba detalle accionable en logs; eso se aborda en TASK-866.

## Causa probable

Alta confianza: el dominio `mail.puntoclubcr.com` esta verificado en Email Communication Service, pero no esta enlazado al recurso Communication Services `acs-puntoclub-prod-001` usado por la connection string productiva.

Error esperado de ACS cuando se usa un sender de un dominio no enlazado:

```txt
The specified sender domain has not been linked.
```

## Descartado / menor probabilidad

- DNS/SPF/DKIM: verificados.
- Sender usernames inexistentes: existen `operaciones` y `campanas`.
- App settings visibles incorrectos: estan correctos.
- Throttling/cuota: el error observado no es throttling.
- Recipient rejected: no hay evidencia de rechazo del destinatario; el error observado es de dominio sender.
- SQL/API endpoint: requests HTTP fueron success.

## Accion recomendada

Crear tarea Infra apply para enlazar `mail.puntoclubcr.com` al Communication Service `acs-puntoclub-prod-001`.

Objetivo tecnico:

```txt
acs-puntoclub-prod-001 linkedDomains debe incluir:
.../emailServices/email-puntoclub-prod-001/domains/mail.puntoclubcr.com
```

Despues:

1. Confirmar `linkedDomains`.
2. No cambiar sender usernames.
3. No cambiar app settings salvo que el enlace requiera reinicio/smoke.
4. QA debe repetir envios controlados a destinatario autorizado.

## Restricciones respetadas

- No se reenviaron correos reales.
- No se cambiaron app settings.
- No se cambio ACS.
- No se cambio DNS.
- No se uso Azure SQL.
- No se tocaron secretos.

## Uso Azure SQL

No se uso Azure SQL.
