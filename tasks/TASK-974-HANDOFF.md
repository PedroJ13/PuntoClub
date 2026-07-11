# TASK-974 - Handoff

Equipo: Web Dev
Modo: Staging / Publicacion Web
Tarea completada: Publicar en staging paquete completo de Campañas
Fecha: 2026-07-11

## Resultado

Completada.

Se publico Web staging con el paquete completo de TASK-970 y TASK-972 para `Enviar campañas`. La publicacion incluye textos corregidos, ausencia de `Configuracion`, semantica de subnavs/paneles y fix responsive de `communication-campaign-controls`.

## Archivos publicados

```txt
app/index.html
app/styles.css
tasks/TASK-970-HANDOFF.md
tasks/TASK-972-HANDOFF.md
```

## Commit y deploy

Commit en rama `staging`:

```txt
44f223b49ae7744582283e135eb0212111e3e90f
Publish staging campaigns visual refresh
```

Workflow:

```txt
Deploy Punto Club frontend staging
Run: 29170114958
URL: https://github.com/PedroJ13/PuntoClub/actions/runs/29170114958
Resultado: success
Job: Deploy Web staging
```

URL staging:

```txt
https://calm-coast-0fabaec0f.7.azurestaticapps.net/
```

## Validacion ejecutada

Checks locales antes de publicar:

```txt
npx prettier --check app/index.html app/styles.css app/src/app.js
Resultado: OK

node --check app/src/app.js
Resultado: OK
```

Verificacion de assets publicados:

```txt
index.html status: 200

Contiene Historial de campañas: si
Contiene Historial local: no
Contiene Crear / actualizar campaña: si
Contiene Crear/Editar campaña: no
Contiene communications-settings-panel/settings title: no
Subnavs con role=tab y aria-controls: si
Paneles con role=tabpanel: si
CSS contiene breakpoint communication-campaign-controls: si
CSS contiene communication-sensitive-action: si
```

Validacion DOM/layout publicada con Playwright:

```txt
Panel validado: Enviar campañas > Crear / actualizar campañas
Formulario: abierto para reproducir caso QA

1024x768:
- horizontalOverflow=false
- scrollWidth=1024
- clientWidth=1024
- communication-campaign-controls: 2 columnas
- formWithinViewport=true
- settingsPanelCount=0
- manageTitle=Crear / actualizar campaña
- historyTitle=Historial de campañas
- tabRoleCount=4
- tabpanelCount=6

768x1024:
- horizontalOverflow=false
- scrollWidth=768
- clientWidth=768
- communication-campaign-controls: 2 columnas
- formWithinViewport=true
- settingsPanelCount=0
- manageTitle=Crear / actualizar campaña
- historyTitle=Historial de campañas
- tabRoleCount=4
- tabpanelCount=6

390x844:
- horizontalOverflow=false
- communication-campaign-controls: 1 columna
- formWithinViewport=true
```

## Uso Azure SQL

No.

## P0/P1

Ninguno.

## P2/P3

- P2 de TASK-971 corregido y publicado: textos `Historial de campañas` y `Crear / actualizar campaña`.
- P2 de TASK-971 corregido y publicado: no hay overflow horizontal en `Crear / actualizar campañas` para `1024x768` ni `768x1024`.
- P3 de TASK-971 corregido y publicado: subnavs/paneles exponen semantica `role=tab`, `aria-controls` y `role=tabpanel`.

## Riesgos o pendientes

- No se hizo login real ni acciones contra API; la validacion publicada fue de assets/DOM/layout sin escrituras.
- No se enviaron campañas reales ni se reintentaron fallidos.
- No se toco produccion.
- No se cambio API, SQL, ACS, sender, feature flags, reglas de baja, envios ni datos.

## Siguiente recomendado

- QA focal en staging para cerrar TASK-971/TASK-974: validar `Crear / actualizar campañas` en `1024x768` y `768x1024`, textos, semantica DOM y ausencia de `Configuracion`.
