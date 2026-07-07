# TASK-841 - Handoff

Nombre del Equipo: Infra
Modo: Azure Communication Services / Sender dominio propio
Fecha: 2026-07-07

## Estado

Completada como evaluacion. No se cambio Azure, Cloudflare, DNS, ACS, secretos ni app settings.

## Resultado

Se recomienda migrar desde Azure Managed Domain/DoNotReply hacia dominio propio en Azure Communication Services Email.

Para MVP hay dos rutas:

1. Ruta exacta solicitada:
   - Verificar `puntoclubcr.com` como custom domain en ACS Email.
   - Usar:
     - `operaciones@puntoclubcr.com`
     - `campanas@puntoclubcr.com`

2. Ruta recomendada por aislamiento de reputacion:
   - Verificar un subdominio dedicado, por ejemplo `mail.puntoclubcr.com` o `email.puntoclubcr.com`.
   - Usar:
     - `operaciones@mail.puntoclubcr.com`
     - `campanas@mail.puntoclubcr.com`
   - Mantener `Reply-To` hacia buzones reales del negocio si se quiere recibir respuestas.

Recomendacion Infra: usar subdominio dedicado si no hay necesidad estricta de enviar desde el apex. Aisla reputacion de promociones, reduce riesgo sobre correo corporativo futuro y simplifica SPF/DKIM sin pelear con registros existentes.

## DNS requerido en Cloudflare

Los valores exactos los genera Azure al crear/configurar el dominio en Email Communication Services. Cloudflare debe quedar en modo DNS-only para estos registros.

Registros esperados:

- TXT de verificacion de dominio:
  - Host: el que indique Azure para `puntoclubcr.com` o subdominio.
  - Valor: token de verificacion generado por Azure.

- SPF:
  - Tipo: TXT.
  - Host: dominio/subdominio verificado.
  - Valor esperado segun Azure, normalmente con include de Microsoft, por ejemplo `v=spf1 include:spf.protection.outlook.com -all`.
  - Si el dominio ya tiene SPF, no crear dos SPF; se debe fusionar en un solo TXT.

- DKIM:
  - Dos CNAMEs, normalmente selector 1 y selector 2.
  - Hosts y targets exactos generados por Azure.

- DMARC recomendado:
  - Tipo: TXT.
  - Host: `_dmarc` del dominio/subdominio.
  - MVP sugerido: `v=DMARC1; p=none; rua=mailto:postmaster@puntoclubcr.com`
  - Luego subir a `quarantine`/`reject` cuando haya telemetria suficiente.

## Remitentes MVP

- Operativos:
  - Preferido: `operaciones@puntoclubcr.com` o `operaciones@mail.puntoclubcr.com`.
  - Uso: bienvenida, compras, canjes, password/reset y avisos funcionales.
  - Debe tener `Reply-To` monitoreado.

- Promocionales:
  - Preferido: `campanas@puntoclubcr.com` o `campanas@mail.puntoclubcr.com`.
  - Uso: campanas comerciales/promocionales.
  - Debe mantener baja promocional visible y cumplimiento de preferencias.

## Buzones reales

ACS Email puede enviar desde sender addresses configurados sin que necesariamente exista un buzon tradicional para recibir correo.

Recomendacion operativa:

- Crear o aliasar un buzon real/monitoreado para `operaciones@...`.
- Para `campanas@...`, al menos configurar `Reply-To` monitoreado o alias compartido.
- No usar direcciones que inviten respuesta si nadie las revisa.
- Las bajas promocionales deben resolverse por el link/sistema, no por depender solo de respuestas manuales.

## Costos esperados

Segun la pagina de precios de Azure Communication Services, Email se cobra por:

- email enviado;
- MB transferido.

La pagina publica consultada no mostro valores numericos estaticos en el scrape (`$-`), por lo que el costo exacto debe confirmarse en Azure Pricing Calculator con region/currency vigentes.

No se identifico un cargo separado por crear direcciones remitentes en ACS Email en la pagina de pricing consultada. Costos adicionales posibles:

- Dominio/DNS: ya existe `puntoclubcr.com`; Cloudflare no deberia agregar costo por TXT/CNAME normales.
- Buzones reales: costo externo si se usan Microsoft 365, Google Workspace u otro proveedor para recibir respuestas.
- Trafico/imagenes en emails: aumenta MB transferidos si las campanas incluyen imagenes.

## Limites y entregabilidad

- Microsoft documenta dos tipos de dominio: Azure Managed Domains y Custom Domains.
- Azure Managed Domain es setup rapido y usa remitentes tipo `donotreply@...azurecomm.net`.
- Custom Domain requiere verificar propiedad y configurar autenticacion SPF/DKIM.
- Custom Domain mejora confianza de marca y reduce apariencia de remitente generico.
- Para promociones, se recomienda calentar volumen gradualmente, separar remitente operativo/promocional y monitorear bounce/suppression/throttling.
- No conviene subir volumen de campanas hasta cerrar observabilidad de fallos y reintentos parciales.

## Fuentes consultadas

- Microsoft Learn - Email domains and sender authentication for Azure Communication Services:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-domain-and-sender-authentication
- Microsoft Learn - Add custom verified email domains:
  - https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/add-custom-verified-domains
- Azure Communication Services pricing:
  - https://azure.microsoft.com/en-us/pricing/details/communication-services/
- Microsoft Learn - Service limits for Azure Communication Services:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits

## Restricciones respetadas

- No se creo dominio ACS.
- No se cambio DNS en Cloudflare.
- No se cambio sender.
- No se tocaron secretos.
- No se cambiaron app settings.
- No se enviaron correos reales.

## Siguiente recomendado

Crear tarea Infra apply cuando Product confirme:

- apex `puntoclubcr.com` vs subdominio dedicado;
- nombres finales de remitente;
- buzon/alias real para Reply-To;
- ventana para agregar DNS en Cloudflare;
- validacion posterior de SPF, DKIM, DMARC y envio controlado.
