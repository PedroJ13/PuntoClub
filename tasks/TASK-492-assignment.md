# TASK-492 - QA local de SEO tecnico y contenido comercial

Equipo: QA
Modo de ejecucion: QA local
Estado: Pending TASK-490/TASK-491
Prioridad: P1 QA local
Depende de: TASK-490, TASK-491

## Objetivo

Validar localmente que los cambios SEO tecnicos y de contenido funcionan antes de decidir publicacion.

## Contexto

TASK-490 debe resolver SEO tecnico local. TASK-491 debe mejorar copy/contenido comercial. QA debe confirmar que home/producto quedan indexables y que rutas operativas no se rompen ni se incluyen indebidamente en sitemap.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TOOLS.md`
- `tasks/TASK-490-HANDOFF.md`
- `tasks/TASK-491-HANDOFF.md`

## Alcance

1. Validar localmente `/robots.txt`.
2. Validar localmente `/sitemap.xml`.
3. Confirmar que sitemap incluye solo `/` y `/producto`.
4. Confirmar que `/`, `/producto`, `/login` y `/company-registration` siguen respondiendo.
5. Confirmar metadata SEO en home y `/producto`:
   - title;
   - description;
   - canonical;
   - Open Graph;
   - Twitter/social cards;
   - JSON-LD.
6. Confirmar que rutas privadas/operativas no quedan en sitemap.
7. Ejecutar `npm run qa:check` o checks documentados.
8. Clasificar hallazgos P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No publicar Web.
- No usar GSC.
- No cambiar DNS.
- No usar Azure SQL.

## Criterios de aceptacion

- No hay P0/P1 abiertos.
- `robots.txt` y `sitemap.xml` no devuelven HTML de la SPA en local.
- Metadata SEO basica existe.
- La pagina comercial conserva contenido visible y CTA.
- Rutas operativas basicas no se rompen.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Validacion local.

## Handoff esperado

Crear o actualizar `tasks/TASK-492-HANDOFF.md` con:

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

