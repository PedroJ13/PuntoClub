# TASK-859 - Handoff

Nombre del Equipo: Infra
Modo: Azure Functions / Email sender config
Fecha: 2026-07-08

## Estado

Bloqueada por prerequisito de publicacion Backend/API no confirmado.

No se cambiaron app settings productivos, no se tocaron SQL/DNS/Storage/codigo y no se enviaron correos reales.

## Objetivo solicitado

Configurar Azure Functions con remitentes separados:

```txt
ACS_EMAIL_SENDER_ADDRESS=operaciones@mail.puntoclubcr.com
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Operaciones
PROMOTIONAL_EMAIL_SENDER_ADDRESS=campanas@mail.puntoclubcr.com
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Campañas
```

## Prerequisito revisado

La tarea indica ejecutar despues de TASK-857 y TASK-858 aprobadas/publicadas.

Se reviso:

- `tasks/TASK-857-HANDOFF.md`
- `tasks/TASK-858-HANDOFF.md`
- estado local de archivos API tocados por TASK-857

Hallazgo:

- TASK-857 esta completada localmente.
- TASK-858 aprobo localmente con observacion, pero indica pendiente de formato antes de release.
- Los archivos de TASK-857 siguen modificados localmente en el workspace:
  - `api/src/lib/notifier.js`
  - `api/src/functions/promotionalCampaigns.js`
  - `api/test/company-registration.test.js`
  - `api/test/operational-emails.test.js`
  - `api/test/promotional-campaigns.test.js`

Por lo tanto, desde Infra no hay evidencia suficiente de que el backend publicado ya lea `PROMOTIONAL_EMAIL_SENDER_ADDRESS` y `PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME`.

## Estado productivo observado

Function App:

```txt
func-puntoclub-prod-br-001
resource_group_main
```

Valores no secretos actuales:

```txt
ACS_EMAIL_SENDER_ADDRESS=DoNotReply@f498d337-b16d-4f08-a895-611680362680.azurecomm.net
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club
```

No existen actualmente en produccion:

```txt
PROMOTIONAL_EMAIL_SENDER_ADDRESS
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME
```

No se leyo ni documento `ACS_EMAIL_CONNECTION_STRING`.

## Decision operativa tomada

No se aplico el cambio.

Motivo:

- Si se agregan variables promocionales antes de que el backend publicado las lea, no tendrian efecto real.
- Si se cambia el sender global a `operaciones@mail.puntoclubcr.com` antes de publicar el soporte separado, los correos promocionales seguirian usando el sender global y saldrian desde operaciones.
- La tarea pide activar remitentes separados, no un cambio parcial.

## Rollback plan

No aplica rollback porque no hubo cambios.

Valores actuales que se deben conservar/restaurar si se requiere rollback en una tarea posterior:

```txt
ACS_EMAIL_SENDER_ADDRESS=DoNotReply@f498d337-b16d-4f08-a895-611680362680.azurecomm.net
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club
```

Y retirar si se hubieran agregado en una tarea posterior:

```txt
PROMOTIONAL_EMAIL_SENDER_ADDRESS
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME
```

## Verificaciones

- Lectura de handoffs TASK-857/TASK-858.
- Lectura filtrada de app settings no secretos de sender.
- Confirmacion de que no se aplicaron cambios productivos.

## Restricciones respetadas

- No se cambio Azure Functions.
- No se cambio SQL.
- No se cambio DNS.
- No se cambio Storage.
- No se cambio codigo.
- No se enviaron correos reales.
- No se tocaron secretos.

## Siguiente paso requerido

Publicar primero el cambio Backend/API de TASK-857 y confirmar que el codigo publicado contiene:

```txt
notifier.getPromotionalEmailConfig()
PROMOTIONAL_EMAIL_SENDER_ADDRESS
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME
```

Luego reintentar TASK-859 para aplicar:

```txt
ACS_EMAIL_SENDER_ADDRESS=operaciones@mail.puntoclubcr.com
ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Operaciones
PROMOTIONAL_EMAIL_SENDER_ADDRESS=campanas@mail.puntoclubcr.com
PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Campañas
```
