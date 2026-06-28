Equipo: Infra
Modo de ejecucion: DNS / Google Search Console
Tarea: TASK-489 - Verificar propiedad sc-domain puntoclubcr.com en Google Search Console

Resultado:

- Bloqueada / pendiente de accion externa.
- La propiedad `sc-domain:puntoclubcr.com` no aparece en el listado de propiedades accesibles desde el CLI local de Google Search Console.
- No se pudo obtener TXT de verificacion desde este CLI porque la herramienta local disponible solo lista/audita/inspecciona propiedades existentes; no inicia alta/verificacion de propiedades nuevas.
- HTTPS de `puntoclubcr.com` y `www.puntoclubcr.com` sigue respondiendo `200 OK`.

Propiedad GSC:

- No verificada en la cuenta autenticada local.
- Propiedades visibles:
  - `sc-domain:puntoeventocr.com` con `siteOwner`.
  - `sc-domain:puntoevento.com` con `siteUnverifiedUser`.

TXT DNS:

- Pendiente.
- Consulta TXT no encontro un TXT de Google visible para `puntoclubcr.com`.

Accion requerida del Product Owner:

- Entrar a Google Search Console con la cuenta correcta.
- Agregar propiedad de tipo dominio: `puntoclubcr.com`.
- Copiar el TXT de verificacion que entrega Google.
- Agregar ese TXT en Cloudflare para `puntoclubcr.com`.
- Avisar cuando el TXT este publicado para reintentar verificacion.

Verificacion ejecutada:

- `.\gsc.ps1 sites`
- `Resolve-DnsName -Type TXT puntoclubcr.com`
- `curl.exe -I https://puntoclubcr.com/`
- `curl.exe -I https://www.puntoclubcr.com/`

Uso cloud/SQL:

- Se uso Google Search Console en modo lectura.
- Se hicieron consultas DNS/HTTPS no destructivas.
- No se uso Azure SQL.
- No se hicieron cambios DNS.
- No se tocaron secretos ni tokens.

Riesgos o pendientes:

- Sin propiedad `sc-domain:puntoclubcr.com` verificada no se puede enviar sitemap ni auditar indexacion real desde GSC.
- Se requiere accion manual o acceso a una herramienta que pueda iniciar la verificacion de dominio en GSC.

Siguiente recomendado:

- Product Owner agrega el TXT en Cloudflare y luego Infra reintenta la verificacion de propiedad.

Movimiento de tablero sugerido:

- Blocked.
