# TASK-490 - Implementar SEO tecnico local para puntoclubcr.com

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Estado: Ready
Prioridad: P1 SEO tecnico local
Depende de: Diagnostico SEO 2026-06-28

## Objetivo

Implementar localmente los elementos SEO tecnicos minimos para la web publica de Punto Club: `robots.txt`, `sitemap.xml`, canonical, metadescription, Open Graph, Twitter/social cards, JSON-LD y control de indexacion de rutas operativas.

## Contexto

El diagnostico SEO inicial encontro:

- `/robots.txt` devuelve HTML de la app.
- `/sitemap.xml` devuelve HTML de la app.
- Falta metadescription.
- Falta canonical.
- Falta Open Graph.
- Falta Twitter/social cards.
- Falta structured data.
- `www.puntoclubcr.com` responde 200 con mismo contenido y requiere decision canonical.

Decision de Proyecto para esta tarea:

- Dominio canonico recomendado: `https://puntoclubcr.com/`.
- Indexables iniciales: `/` y `/producto`.
- No incluir en sitemap rutas operativas como `/login`, `/company-registration`, invitaciones, recuperacion de password, panel interno ni pantallas privadas.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TOOLS.md`
- `C:\Work\Google Search Console\reports\seo-puntoclubcr-com-2026-06-28.md`

## Alcance

1. Crear `robots.txt` real en la app publicada/local.
2. Crear `sitemap.xml` real con:
   - `https://puntoclubcr.com/`
   - `https://puntoclubcr.com/producto`
3. Agregar metadata SEO basica:
   - title por pagina/ruta publica si la arquitectura lo permite;
   - description;
   - canonical;
   - Open Graph;
   - Twitter/social cards.
4. Agregar JSON-LD `SoftwareApplication` o `Product` en pagina comercial.
5. Evitar indexacion de rutas operativas y privadas con `noindex` o metadata equivalente cuando aplique.
6. Mantener rutas operativas funcionales.
7. Ejecutar checks locales disponibles.

## Fuera de alcance

- No publicar Web.
- No tocar Azure SQL.
- No usar Google Search Console.
- No cambiar Cloudflare.
- No implementar redireccion `www` -> apex si requiere DNS/edge externo; documentar pendiente para Infra si no se puede resolver en app.
- No redisenar la landing.

## Criterios de aceptacion

- `robots.txt` existe y no devuelve HTML de la SPA en local.
- `sitemap.xml` existe y no devuelve HTML de la SPA en local.
- Home y `/producto` tienen title, description, canonical, OG/Twitter y JSON-LD donde aplique.
- Rutas operativas no quedan incluidas en sitemap.
- Rutas operativas no se rompen.
- `npm run qa:check` o checks locales equivalentes pasan, salvo limitacion documentada.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Trabajo local solamente.

## Handoff esperado

Crear o actualizar `tasks/TASK-490-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos cambiados:
Verificacion ejecutada:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

