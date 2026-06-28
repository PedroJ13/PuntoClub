# TASK-498 - Revalidar SEO publicado despues de release SEO-only

Equipo: QA
Modo de ejecucion: QA publicado
Estado: Completed retroactively
Prioridad: P1 QA publicado
Depende de: TASK-497

## Objetivo

Revalidar en `https://puntoclubcr.com` que el release SEO-only quedo publicado correctamente y cerro los P1 encontrados en TASK-494.

## Contexto

TASK-494 no aprobo porque el sitio publicado todavia no tenia los cambios SEO. TASK-497 publico el release SEO-only con commit `56b2b27`.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-494-HANDOFF.md`
- `tasks/TASK-497-HANDOFF.md`

## Alcance

1. Validar `https://puntoclubcr.com/robots.txt`.
2. Validar `https://puntoclubcr.com/sitemap.xml`.
3. Validar metadata SEO en `/` y `/producto`.
4. Validar `noindex,nofollow` en rutas operativas revisadas.
5. Confirmar exclusiones del sitemap.
6. Reportar estado de `www.puntoclubcr.com`.
7. Crear o actualizar `tasks/TASK-498-HANDOFF.md`.

## Fuera de alcance

- No corregir codigo.
- No usar Google Search Console.
- No cambiar DNS/Cloudflare.
- No usar Azure SQL.
- No probar flujos autenticados.

## Criterios de aceptacion

- No hay P0/P1 abiertos.
- `robots.txt` no devuelve HTML de la SPA.
- `sitemap.xml` no devuelve HTML de la SPA.
- Home y `/producto` tienen metadata SEO publicada.
- Rutas operativas revisadas tienen `noindex,nofollow`.

## Uso de cloud / SQL / servicios externos

Permitido:

- HTTP/Playwright contra sitio publicado.

Prohibido:

- Azure SQL.
- GSC.
- DNS/Cloudflare.
- Cambios de codigo.

## Handoff esperado

Crear o actualizar `tasks/TASK-498-HANDOFF.md` con:

```text
Equipo: QA
Tarea validada:
Ambiente:
Resultado:
Checks ejecutados:
P0/P1:
P2/P3:
Evidencia:
Limitaciones:
Uso cloud/SQL:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

