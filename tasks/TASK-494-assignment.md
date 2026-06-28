# TASK-494 - QA publicada de SEO tecnico y contenido comercial

Equipo: QA
Modo de ejecucion: QA publicado
Estado: Pending TASK-493
Prioridad: P1 QA publicado
Depende de: TASK-493

## Objetivo

Validar en `https://puntoclubcr.com` que los cambios SEO publicados funcionan y que `robots.txt` y `sitemap.xml` ya no devuelven HTML de la SPA.

## Contexto

TASK-492 aprobo el bloque localmente. TASK-493 debe publicarlo. Esta tarea valida el resultado publicado antes de enviar sitemap a Google Search Console.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-493-HANDOFF.md`
- `tasks/TASK-492-HANDOFF.md`

## Alcance

1. Validar publicado:
   - `https://puntoclubcr.com/`
   - `https://puntoclubcr.com/producto`
   - `https://puntoclubcr.com/robots.txt`
   - `https://puntoclubcr.com/sitemap.xml`
   - `https://puntoclubcr.com/login`
   - `https://puntoclubcr.com/company-registration`
2. Confirmar que `robots.txt` es `text/plain` y contiene el sitemap.
3. Confirmar que `sitemap.xml` es XML real e incluye solo `/` y `/producto`.
4. Confirmar metadata publicada:
   - title;
   - description;
   - canonical;
   - robots;
   - Open Graph;
   - Twitter Card;
   - JSON-LD.
5. Confirmar que rutas operativas no quedan en sitemap y tienen `noindex,nofollow` cuando aplique.
6. Confirmar que `www.puntoclubcr.com` sigue respondiendo y reportar si no redirige a apex como P3/P2 segun impacto.
7. Clasificar hallazgos P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No cambiar DNS.
- No usar Azure SQL.
- No enviar sitemap a GSC.
- No validar indexacion real de Google.
- No probar flujos autenticados con datos reales.

## Criterios de aceptacion

- No hay P0/P1 abiertos.
- `robots.txt` y `sitemap.xml` publicados no devuelven HTML de la SPA.
- Home y `/producto` tienen metadata SEO publicada.
- Rutas operativas no estan en sitemap.
- Se documentan limitaciones de GSC/indexacion.

## Uso de cloud / SQL / servicios externos

Permitido:

- HTTP checks publicados.
- Inspeccion de HTML publicado.

Prohibido:

- Azure SQL.
- GSC.
- Cloudflare/DNS.
- Cambios de codigo.

## Handoff esperado

Crear o actualizar `tasks/TASK-494-HANDOFF.md` con:

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

