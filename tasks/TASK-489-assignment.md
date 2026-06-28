# TASK-489 - Verificar propiedad sc-domain puntoclubcr.com en Google Search Console

Equipo: Infra
Modo de ejecucion: DNS / Google Search Console
Estado: Ready
Prioridad: P1 SEO indexacion
Depende de: Diagnostico SEO 2026-06-28

## Objetivo

Verificar la propiedad `sc-domain:puntoclubcr.com` en Google Search Console usando DNS, sin cambiar todavia el default de la configuracion local de GSC.

## Contexto

El diagnostico SEO inicial encontro que `puntoclubcr.com` responde correctamente por HTTPS, pero Search Console aun no muestra `sc-domain:puntoclubcr.com` en la cuenta autenticada.

Sin la verificacion de dominio no se puede enviar sitemap ni auditar indexacion real desde GSC.

Reporte base:

- `C:\Work\Google Search Console\reports\seo-puntoclubcr-com-2026-06-28.md`

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `C:\Work\Google Search Console\reports\seo-puntoclubcr-com-2026-06-28.md`

## Alcance

1. Confirmar si `sc-domain:puntoclubcr.com` ya existe en Google Search Console.
2. Si no existe, iniciar alta de propiedad dominio en GSC.
3. Obtener el TXT de verificacion DNS indicado por Google.
4. Entregar al Product Owner la instruccion exacta para agregar el TXT en Cloudflare.
5. Cuando Product Owner confirme que el TXT fue agregado, verificar propiedad en GSC.
6. Confirmar que la propiedad aparece en el listado de sitios.
7. No cambiar el default de `C:\Work\Google Search Console\config.json` sin decision explicita.

## Fuera de alcance

- No tocar codigo de Punto Club.
- No publicar Web/API.
- No modificar Azure SQL.
- No enviar sitemap hasta que exista `/sitemap.xml` real publicado.
- No cambiar DNS que pueda afectar trafico productivo salvo el TXT de verificacion.

## Criterios de aceptacion

- `sc-domain:puntoclubcr.com` queda verificado en GSC, o queda documentado el TXT pendiente de agregar.
- No se rompe resolucion HTTPS de `puntoclubcr.com` ni `www.puntoclubcr.com`.
- El handoff no expone tokens ni secretos.
- Queda claro si el Product Owner debe hacer una accion en Cloudflare.

## Uso de cloud / SQL / servicios externos

Permitido:

- Google Search Console.
- Cloudflare DNS solo para TXT de verificacion, con aprobacion/accion del Product Owner si corresponde.
- Consultas DNS/HTTP no destructivas.

Prohibido:

- Azure SQL.
- Cambios de codigo.
- Cambios de DNS que no sean el TXT de verificacion.

## Handoff esperado

Crear o actualizar `tasks/TASK-489-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Propiedad GSC:
TXT DNS:
Accion requerida del Product Owner:
Verificacion ejecutada:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

