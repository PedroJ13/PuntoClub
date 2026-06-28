# TASK-497 - Publicar solo commit SEO sin desplegar cambios API pendientes

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev / Release
Estado: Completed retroactively
Prioridad: P1 publicacion SEO
Depende de: TASK-492, TASK-493, decision Product / Architect / Release

## Objetivo

Publicar en `origin/main` solamente los cambios SEO/Web aprobados localmente, evitando empujar commits locales pendientes que tambien tocaban `api/**` y podian disparar deploy API.

## Contexto

TASK-493 quedo bloqueada porque `main` local tenia dos commits pendientes:

- `d777038 chore: consolidate project tasks and tooling`
- `7ab94a6 Publish SEO technical updates`

Empujar `main` completo podia publicar cambios API no relacionados con SEO. Product / Architect / Release decidio publicar solo el alcance SEO/Web.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-492-HANDOFF.md`
- `tasks/TASK-493-HANDOFF.md`

## Alcance

1. Crear publicacion SEO-only basada en `origin/main`.
2. Incluir solo archivos Web/SEO necesarios.
3. Excluir cambios `api/**`.
4. Publicar por el flujo Web vigente.
5. Confirmar que no se dispara workflow API.
6. Crear o actualizar `tasks/TASK-497-HANDOFF.md`.

## Fuera de alcance

- No publicar cambios API.
- No tocar Azure SQL.
- No cambiar DNS/Cloudflare.
- No enviar sitemap a Google Search Console.
- No resolver todavia la divergencia del `main` local principal.

## Criterios de aceptacion

- Existe commit publicado SEO-only en `origin/main`.
- Workflow Web termina en success.
- Workflow API no se dispara por este release.
- `robots.txt` y `sitemap.xml` publicados responden como archivos reales.

## Uso de cloud / SQL / servicios externos

Permitido:

- GitHub push.
- GitHub Actions Web.
- Azure Static Web Apps por workflow oficial.
- HTTP checks publicados.

Prohibido:

- Azure SQL.
- Deploy API.
- GSC.
- DNS/Cloudflare.

## Handoff esperado

Crear o actualizar `tasks/TASK-497-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos cambiados:
Commit/deploy:
Verificacion ejecutada:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

