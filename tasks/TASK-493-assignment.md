# TASK-493 - Publicar SEO tecnico y contenido comercial

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Estado: Ready
Prioridad: P1 publicacion SEO
Depende de: TASK-492

## Objetivo

Publicar en `puntoclubcr.com` los cambios locales aprobados de SEO tecnico y contenido comercial.

## Contexto

TASK-490 implemento localmente:

- `robots.txt` real.
- `sitemap.xml` real.
- metadata SEO por ruta.
- canonical.
- Open Graph.
- Twitter Cards.
- JSON-LD.
- `noindex,nofollow` para rutas operativas.

TASK-491 ajusto contenido comercial SEO.

TASK-492 aprobo localmente el bloque sin P0/P1 abiertos.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TOOLS.md`
- `tasks/TASK-490-HANDOFF.md`
- `tasks/TASK-491-HANDOFF.md`
- `tasks/TASK-492-HANDOFF.md`

## Alcance

1. Revisar que los cambios locales de SEO siguen presentes.
2. Ejecutar checks locales antes de publicar:
   - `npm run qa:check`
   - `npm run lint`
   - `npm run format:check`
3. Publicar Web a `puntoclubcr.com` siguiendo el flujo vigente del proyecto.
4. Confirmar que el deploy termina correctamente.
5. Registrar commit, workflow/run o mecanismo de publicacion usado.
6. No tocar API ni Azure SQL.

## Fuera de alcance

- No cambiar DNS.
- No verificar Google Search Console.
- No enviar sitemap a GSC.
- No implementar redireccion `www` -> apex.
- No tocar backend/API.
- No tocar Azure SQL.

## Criterios de aceptacion

- Deploy Web completado sin error.
- `https://puntoclubcr.com/` responde.
- `https://puntoclubcr.com/robots.txt` responde archivo real.
- `https://puntoclubcr.com/sitemap.xml` responde sitemap real.
- Se registra evidencia de publicacion.
- No se hicieron cambios fuera de Web.

## Uso de cloud / SQL / servicios externos

Permitido:

- Deploy Web / Azure Static Web Apps / GitHub Actions segun flujo actual.
- HTTP checks publicados.

Prohibido:

- Azure SQL.
- Cambios API.
- GSC.
- Cloudflare/DNS.

## Handoff esperado

Crear o actualizar `tasks/TASK-493-HANDOFF.md` con:

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

