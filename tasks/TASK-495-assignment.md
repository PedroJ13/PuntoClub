# TASK-495 - Enviar sitemap e inspeccionar URLs en Google Search Console

Equipo: Infra
Modo de ejecucion: Google Search Console
Estado: Pending TASK-489/TASK-494
Prioridad: P2 SEO indexacion
Depende de: TASK-489, TASK-494

## Objetivo

Enviar `https://puntoclubcr.com/sitemap.xml` en Google Search Console e inspeccionar las URLs publicas principales una vez que el dominio este verificado y el sitemap publicado este aprobado.

## Contexto

TASK-489 sigue bloqueada hasta que Product Owner agregue/verifique `sc-domain:puntoclubcr.com` por DNS. TASK-494 debe confirmar que el sitemap publicado existe y es correcto.

Esta tarea solo debe ejecutarse cuando ambas condiciones se cumplan.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `tasks/TASK-489-HANDOFF.md`
- `tasks/TASK-494-HANDOFF.md`
- `C:\Work\Google Search Console\reports\seo-puntoclubcr-com-2026-06-28.md`

## Alcance

1. Confirmar que `sc-domain:puntoclubcr.com` esta verificado en GSC.
2. Confirmar que `https://puntoclubcr.com/sitemap.xml` responde correctamente.
3. Enviar sitemap en GSC.
4. Inspeccionar:
   - `https://puntoclubcr.com/`
   - `https://puntoclubcr.com/producto`
5. Registrar resultado redaccionado.

## Fuera de alcance

- No cambiar DNS.
- No tocar Web/API.
- No usar Azure SQL.
- No corregir SEO tecnico.
- No ejecutar auditoria completa de 28 dias hasta que exista tiempo de datos.

## Criterios de aceptacion

- Sitemap enviado o error documentado.
- URLs principales inspeccionadas o bloqueo documentado.
- No se exponen tokens ni secretos.
- Queda claro si falta esperar propagacion/indexacion.

## Uso de cloud / SQL / servicios externos

Permitido:

- Google Search Console.
- HTTP checks publicados.

Prohibido:

- Azure SQL.
- Cambios DNS.
- Cambios Web/API.

## Handoff esperado

Crear o actualizar `tasks/TASK-495-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Propiedad GSC:
Sitemap:
URLs inspeccionadas:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

