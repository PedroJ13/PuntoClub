# TASK-847 - Handoff

Nombre del Equipo: Infra
Modo: Azure Communication Services / Dominio propio sender
Fecha: 2026-07-07

## Estado

Completada como plan. No se aplicaron cambios en Azure, ACS, DNS, Cloudflare, secretos ni app settings.

## Recomendacion

Usar subdominio dedicado:

```txt
mail.puntoclubcr.com
```

Remitentes MVP recomendados:

```txt
operaciones@mail.puntoclubcr.com
campanas@mail.puntoclubcr.com
```

Motivo:

- Aisla reputacion de envios promocionales del apex `puntoclubcr.com`.
- Evita conflictos con SPF/MX actuales o futuros del correo corporativo.
- Permite cambiar o endurecer DMARC del subdominio sin afectar otros usos del dominio principal.

Ruta alternativa si Product exige apex:

```txt
operaciones@puntoclubcr.com
campanas@puntoclubcr.com
```

Esta ruta requiere revisar SPF/MX/DMARC existentes para no romper correo del dominio principal.

## Plan Azure ACS Email

1. Crear o seleccionar Email Communication Service existente.
2. Agregar custom domain `mail.puntoclubcr.com` con domain management `CustomerManaged`.
3. Iniciar verificacion de dominio.
4. Copiar los registros TXT/CNAME generados por Azure.
5. PO/Infra agrega DNS en Cloudflare.
6. Esperar propagacion y verificar dominio.
7. Configurar sender authentication SPF/DKIM.
8. Crear/validar sender usernames:
   - `operaciones`
   - `campanas`
9. Conectar el dominio verificado al recurso Azure Communication Services usado por Functions.
10. En una tarea posterior, cambiar app settings del sender:
    - operativo: `operaciones@mail.puntoclubcr.com`
    - promocional: `campanas@mail.puntoclubcr.com`

## DNS requerido en Cloudflare

Los valores finales exactos de TXT y DKIM los genera Azure cuando se inicia la configuracion del dominio. No deben inventarse ni aplicarse antes de verlos en el portal/CLI.

Para la zona `puntoclubcr.com`, si se usa `mail.puntoclubcr.com`, se esperan estos registros:

| Proposito | Tipo | Nombre en Cloudflare | Valor |
| --- | --- | --- | --- |
| Verificacion dominio | TXT | `mail` o valor indicado por Azure | Token exacto generado por Azure |
| SPF | TXT | `mail` | `v=spf1 include:spf.protection.outlook.com -all` si Azure no genera otro valor |
| DKIM 1 | CNAME | selector DKIM 1 bajo `_domainkey.mail` segun Azure | target exacto generado por Azure, normalmente bajo `azurecomm.net` |
| DKIM 2 | CNAME | selector DKIM 2 bajo `_domainkey.mail` segun Azure | target exacto generado por Azure, normalmente bajo `azurecomm.net` |
| DMARC recomendado | TXT | `_dmarc.mail` | `v=DMARC1; p=none; rua=mailto:postmaster@puntoclubcr.com` |

Notas Cloudflare:

- TXT y CNAME deben estar DNS-only.
- Si se usa apex, no crear un segundo SPF; se debe fusionar con el SPF existente.
- DMARC `p=none` es recomendado para arranque y monitoreo; subir a `quarantine`/`reject` solo despues de evidencia.

## Buzones y routing

ACS Email necesita sender address configurado para enviar, pero no exige por si mismo un buzon tradicional para recibir respuestas.

Recomendacion operativa:

- `operaciones@...`: debe tener buzon/alias real monitoreado o `Reply-To` monitoreado.
- `campanas@...`: puede ser sender tecnico, pero debe usar baja promocional del sistema y preferiblemente `Reply-To` monitoreado.
- Si se crean buzones reales en Microsoft 365/Google Workspace, eso si genera costo fuera de ACS.
- Si solo se configuran sender addresses en ACS y Reply-To existente, no se identifica costo nuevo de buzon.

## Costos esperados

Segun Azure Communication Services pricing, Email se cobra por:

- email enviado;
- MB transferido.

La pagina de pricing indica que los precios son estimaciones y recomienda usar Azure Pricing Calculator para precios vigentes por region/acuerdo.

No se identifico cargo separado en la pagina consultada por:

- crear el custom domain en ACS Email;
- crear sender usernames;
- agregar registros DNS en Cloudflare.

Posibles costos nuevos:

- Correos enviados y MB transferidos por mayor uso real.
- Tiempo de ejecucion de Azure Functions si se agregan pausas/pacing.
- Buzones reales o alias pagos si se crean en un proveedor de correo.
- Herramienta externa DMARC si se decide monitoreo avanzado; no requerida para MVP.

## Entregabilidad

Impacto esperado positivo:

- Remitente visible de marca Punto Club.
- Mejor confianza que `donotreply@...azurecomm.net`.
- SPF/DKIM alineados para dominio propio.
- Separacion de operativo vs promocional por sender.

Riesgos:

- Enviar promociones sin calentamiento puede afectar reputacion.
- Rebotes y quejas deben monitorearse.
- El subdominio promocional debe respetar bajas y preferencias.
- Imagenes grandes incrementan MB transferidos y pueden afectar filtros.

## Fuentes consultadas

- Microsoft Learn - Email domains and sender authentication for Azure Communication Services:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-domain-and-sender-authentication
- Microsoft Learn - Add custom verified email domains:
  - https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/add-custom-verified-domains
- Azure Communication Services pricing:
  - https://azure.microsoft.com/en-us/pricing/details/communication-services/

## Restricciones respetadas

- No se creo/verifico dominio en Azure.
- No se cambiaron DNS en Cloudflare.
- No se cambiaron sender addresses.
- No se tocaron secretos.
- No se enviaron correos reales.

## Siguiente recomendado

Crear tarea Infra apply cuando Product confirme:

- `mail.puntoclubcr.com` vs apex `puntoclubcr.com`;
- remitentes finales;
- si se crean buzones reales o solo sender/Reply-To;
- ventana para copiar DNS desde Azure y aplicarlo en Cloudflare;
- tarea posterior Backend/Infra para cambiar app settings del sender despues de verificacion completa.
