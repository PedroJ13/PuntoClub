Equipo: Infra

Modo de ejecucion: Google Search Console

Tarea: TASK-495 - Enviar sitemap e inspeccionar URLs en Google Search Console

Resultado:
- Bloqueada / no ejecutable todavia.
- No se envio sitemap ni se inspeccionaron URLs en Google Search Console porque no se cumplen los prerequisitos de la tarea:
  - TASK-489 sigue bloqueada: `sc-domain:puntoclubcr.com` no aparece verificada en GSC.
  - TASK-494 no aprobo: `robots.txt` y `sitemap.xml` publicados siguen devolviendo HTML de la SPA.

Propiedad GSC:
- `sc-domain:puntoclubcr.com` no aparece entre las propiedades accesibles desde el CLI local.
- Propiedades visibles en `.\gsc.ps1 sites`:
  - `sc-domain:puntoevento.com` con `siteUnverifiedUser`.
  - `sc-domain:puntoeventocr.com` con `siteOwner`.

Sitemap:
- No enviado.
- `https://puntoclubcr.com/sitemap.xml` responde `200`, pero con `Content-Type: text/html`.
- El cuerpo inicia con `<!doctype html>` y no contiene `<urlset>`.
- `https://puntoclubcr.com/robots.txt` tambien responde `200`, pero con `Content-Type: text/html` y sin referencia al sitemap.

URLs inspeccionadas:
- No se inspeccionaron en GSC porque falta propiedad verificada.
- URLs pendientes para inspeccion cuando se desbloquee:
  - `https://puntoclubcr.com/`
  - `https://puntoclubcr.com/producto`

Evidencia:
- `.\gsc.ps1 sites` no lista `sc-domain:puntoclubcr.com`.
- HTTP publicado read-only:
  - `https://puntoclubcr.com/robots.txt`: `200`, `Content-Type: text/html`, inicia con `<!doctype html>`, sin sitemap.
  - `https://puntoclubcr.com/sitemap.xml`: `200`, `Content-Type: text/html`, inicia con `<!doctype html>`, sin `<urlset>`.
- Antecedente directo:
  - `tasks/TASK-489-HANDOFF.md`: propiedad GSC bloqueada por falta de verificacion DNS.
  - `tasks/TASK-494-HANDOFF.md`: QA publicado no aprobado por sitemap/robots/metadata no publicados.

Uso cloud/SQL:
- Se uso Google Search Console en modo lectura con `.\gsc.ps1 sites`.
- Se hicieron checks HTTP publicados read-only contra `puntoclubcr.com`.
- No se uso Azure SQL.
- No se cambio DNS, Cloudflare, Web, API ni GSC.
- No se expusieron tokens ni secretos.

Riesgos o pendientes:
- Sin propiedad `sc-domain:puntoclubcr.com` verificada no se puede enviar sitemap ni inspeccionar URLs en GSC.
- Aunque la propiedad se verifique, no conviene enviar el sitemap hasta que `https://puntoclubcr.com/sitemap.xml` sirva XML real.
- TASK-493 sigue pendiente de resolucion/publicacion y TASK-494 debe aprobar publicado antes de reintentar TASK-495.

Siguiente recomendado:
- Product / Architect / Release debe resolver el bloqueo de TASK-493 y publicar SEO tecnico.
- QA debe repetir/aprobar TASK-494 en publicado.
- Product Owner/Infra debe completar la verificacion DNS de `sc-domain:puntoclubcr.com` en Google Search Console.
- Luego reintentar TASK-495 para enviar sitemap e inspeccionar `/` y `/producto`.

Movimiento de tablero sugerido:
- Mantener TASK-495 bloqueada / pendiente de TASK-489 y TASK-494.
