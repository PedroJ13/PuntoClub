Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea: TASK-490 - Implementar SEO tecnico local para puntoclubcr.com

Resultado:

- Implementado SEO tecnico local para la web publica.
- Agregados `robots.txt` y `sitemap.xml` reales.
- Actualizado fallback de Azure Static Web Apps para que `robots.txt` y `sitemap.xml` no devuelvan HTML de la SPA.
- Agregados metadatos base: title, description, canonical, robots, Open Graph, Twitter Card y JSON-LD.
- Agregada metadata dinamica por ruta:
  - `/` indexable con canonical `https://puntoclubcr.com/`.
  - `/producto` indexable con canonical `https://puntoclubcr.com/producto`.
  - rutas operativas como `/login` quedan `noindex,nofollow`.
- Ajustado servidor local para servir `.txt` y `.xml` con MIME correcto.

Archivos cambiados:

- `app/index.html`
- `app/robots.txt`
- `app/sitemap.xml`
- `app/src/app.js`
- `app/staticwebapp.config.json`
- `tools/serve-static.mjs`

Verificacion ejecutada:

- `node --check app/src/app.js`
- `npm run lint`
- `npm run format:check`
- `npm run copy:check`
- `npm run qa:check`
- `git diff --check`
- Servidor local con `tools/serve-static.mjs` y checks HTTP de `/robots.txt`, `/sitemap.xml`, `/`, `/producto`, `/login`.
- Validacion Playwright puntual de title/canonical/robots para `/`, `/producto` y `/login`.

Evidencia:

- `/robots.txt`: `200`, `text/plain`, contiene sitemap, no es HTML.
- `/sitemap.xml`: `200`, `application/xml`, contiene `/` y `/producto`, no es HTML.
- `/`: title `Punto Club | App de fidelización de clientes en Costa Rica`, canonical `https://puntoclubcr.com/`, robots `index,follow`.
- `/producto`: title `Software de fidelización de clientes | Punto Club`, canonical `https://puntoclubcr.com/producto`, robots `index,follow`.
- `/login`: robots `noindex,nofollow`.
- `npm run qa:check`: 8 tests passed.

Uso cloud/SQL:

- No se uso Azure.
- No se uso Azure SQL.
- No se uso Google Search Console.
- No se uso Cloudflare.
- No se hizo deploy.

Riesgos o pendientes:

- Pendiente publicar para que `https://puntoclubcr.com/robots.txt` y `/sitemap.xml` existan en produccion.
- Redireccion canonical estricta `www` -> apex queda fuera de alcance y requiere decision/Infra.
- Enviar sitemap en GSC depende de TASK-489.

Siguiente recomendado:

- Ejecutar QA local de SEO/contenido si se requiere separacion formal, luego decidir publicacion Web.

Movimiento de tablero sugerido:

- Ready for Review.
