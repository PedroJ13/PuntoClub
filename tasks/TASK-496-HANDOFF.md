Equipo: Infra

Modo de ejecucion: DNS / Azure Static Web Apps / Cloudflare

Tarea: TASK-496 - Configurar redireccion canonical www hacia apex

Resultado:
- Bloqueada / no configurada.
- Se valido el estado actual publicado y se confirmo que `www.puntoclubcr.com` todavia no redirige al apex.
- No se encontro archivo `tasks/TASK-496-assignment.md`; se uso como alcance minimo el pedido del usuario.
- No hay herramienta CLI, token ni sesion Cloudflare disponible desde este entorno para aplicar la regla.
- Azure Static Web Apps tiene ambos hostnames `Ready`, pero la redireccion por hostname debe configurarse en Cloudflare/edge; no se aplico ningun cambio en Azure ni DNS.

Archivos cambiados:
- `tasks/TASK-496-HANDOFF.md`

Verificacion ejecutada:
- Revision de antecedentes:
  - `tasks/TASK-396-HANDOFF.md`
  - `tasks/TASK-403-HANDOFF.md`
  - `tasks/TASK-494-HANDOFF.md`
- Estado Azure Static Web Apps:
  - `az staticwebapp hostname list --name swa-puntoclub-prod-001 --resource-group resource_group_main`
- DNS publico:
  - `Resolve-DnsName puntoclubcr.com -Type A -Server 1.1.1.1`
  - `Resolve-DnsName www.puntoclubcr.com -Type CNAME -Server 1.1.1.1`
- HTTP publicado:
  - `curl.exe -I https://puntoclubcr.com/`
  - `curl.exe -I https://www.puntoclubcr.com/`
  - `curl.exe -I http://www.puntoclubcr.com/`

Evidencia:
- Azure Static Web Apps:
  - `puntoclubcr.com`: `Ready`
  - `www.puntoclubcr.com`: `Ready`
  - `validationToken`: `null`
  - `errorMessage`: `null`
- DNS:
  - `puntoclubcr.com` resuelve `A` publico.
  - `www.puntoclubcr.com` resuelve `CNAME` a `calm-dune-075dc5c0f.7.azurestaticapps.net`.
- HTTP:
  - `https://puntoclubcr.com/`: `200 OK`, `Content-Type: text/html`.
  - `https://www.puntoclubcr.com/`: `200 OK`, `Content-Type: text/html`, sin header `Location`.
  - `http://www.puntoclubcr.com/`: `301 Moved Permanently`, `Location: https://www.puntoclubcr.com/`.
- Interpretacion:
  - La redireccion HTTP -> HTTPS existe.
  - La redireccion canonical `https://www.puntoclubcr.com/*` -> `https://puntoclubcr.com/*` no existe.

Uso cloud/SQL:
- Cloud si, solo lectura:
  - Azure Static Web Apps control-plane read-only.
  - DNS publico read-only.
  - HTTP publico read-only.
- SQL no; no se uso Azure SQL.
- No se cambio Cloudflare, Azure, DNS, Web ni API.
- No se expusieron tokens ni secretos.

Configuracion requerida en Cloudflare:
- Mantener `puntoclubcr.com` como canonical.
- Crear una Redirect Rule o Page Rule para:
  - Condicion: hostname igual a `www.puntoclubcr.com`.
  - Accion: redirect permanente `301`.
  - Destino: `https://puntoclubcr.com` preservando path y query string.
- Ejemplos:
  - Redirect Rule expression: `(http.host eq "www.puntoclubcr.com")`
  - Target: `https://puntoclubcr.com` + path original, con query string preservado.
  - Page Rule alternativa: `https://www.puntoclubcr.com/*` -> `https://puntoclubcr.com/$1` con `Forwarding URL 301`.
- Importante:
  - Si el registro `www` esta en `DNS only`, las reglas de redirect de Cloudflare no aplican al trafico. Para redireccion en Cloudflare, `www` debe pasar por proxy Cloudflare o se debe usar otro mecanismo equivalente.
  - No se recomienda resolver esto desde Azure Static Web Apps si el objetivo es redireccion por hostname; SWA ya sirve ambos hostnames y no se identifico una regla host-based aplicable desde este alcance.

Riesgos o pendientes:
- La duplicidad `www`/apex sigue vigente hasta que Cloudflare aplique la redireccion.
- Despues de activar proxy/regla en Cloudflare, hay que revalidar HTTPS, HSTS y que no se rompa la validacion del dominio custom en Azure.
- TASK-493/TASK-494 siguen siendo pendientes separados para SEO tecnico publicado; esta tarea solo cubre canonical host redirect.

Siguiente recomendado:
- Product Owner/Infra con acceso a Cloudflare debe aplicar la Redirect Rule anterior.
- Luego ejecutar QA publicado con:
  - `curl.exe -I https://www.puntoclubcr.com/`
  - `curl.exe -I https://www.puntoclubcr.com/producto?qa=task496`
  - esperado: `301` o `308` hacia `https://puntoclubcr.com/` y `https://puntoclubcr.com/producto?qa=task496`.
- Confirmar que `https://puntoclubcr.com/` sigue respondiendo `200 OK`.

Movimiento de tablero sugerido:
- Mantener TASK-496 bloqueada / pendiente de acceso o ejecucion en Cloudflare.
