# TASK-972 - Handoff

Equipo: Web Dev
Modo: Rediseño visual / Fix Campañas staging
Tarea completada: Corregir textos, semantica y overflow de Campañas
Fecha: 2026-07-11

## Resultado

Completada localmente en rama `staging`.

Se reviso TASK-971 y se corrigio el overflow horizontal del formulario `Crear / actualizar campañas`, manteniendo los textos y semantica ya preparados localmente en TASK-970. No se cambio API, SQL, auth, envios, feature flags, bajas promocionales ni datos.

## Archivos cambiados

```txt
app/index.html
app/styles.css
tasks/TASK-970-HANDOFF.md
tasks/TASK-972-HANDOFF.md
```

Nota: `app/index.html` y `tasks/TASK-970-HANDOFF.md` traen el estado local pendiente de TASK-970. El ajuste nuevo de TASK-972 esta en `app/styles.css`.

## Cambios realizados

- Confirmado localmente `Historial de campañas` en lugar de `Historial local`.
- Confirmado localmente `Crear / actualizar campaña` en lugar de `Crear/Editar campaña`.
- Confirmada ausencia de `Configuracion` dentro del modulo Campañas.
- Confirmada semantica de subnavs/paneles: `role="tab"`, `aria-controls` y `role="tabpanel"`.
- Corregido overflow de `communication-campaign-controls` en tablet: bajo `1100px` el grid colapsa a 2 columnas y el checkbox `Incluir puntos disponibles` ocupa fila completa.

## Validacion ejecutada

Checks locales:

```txt
npx prettier --check app/index.html app/styles.css app/src/app.js
Resultado: OK

node --check app/src/app.js
Resultado: OK
```

Validacion focal local con servidor estatico y Playwright, sin API real ni envios:

```txt
Panel validado: Enviar campañas > Crear / actualizar campañas
Formulario: abierto para reproducir caso QA

1024x768:
- horizontalOverflow=false
- scrollWidth=1024
- clientWidth=1024
- communication-campaign-controls: 2 columnas
- formWithinViewport=true

768x1024:
- horizontalOverflow=false
- scrollWidth=768
- clientWidth=768
- communication-campaign-controls: 2 columnas
- formWithinViewport=true

390x844:
- horizontalOverflow=false
- communication-campaign-controls: 1 columna

360x740:
- horizontalOverflow=false
- communication-campaign-controls: 1 columna
```

Checks DOM locales:

```txt
settingsPanelCount=0
manageTitle=Crear / actualizar campaña
historyTitle=Historial de campañas
tabRoleCount=4
tabpanelCount=6
```

## Uso Azure SQL

No.

## P0/P1

Ninguno.

## P2/P3

- P2 de TASK-971 corregido localmente: overflow en `Crear / actualizar campañas` para `1024x768` y `768x1024`.
- P2/P3 de TASK-971 cubiertos por el paquete local: textos y semantica quedan listos para publicacion.

## Riesgos o pendientes

- No se hizo deploy ni se toco produccion.
- Staging seguira mostrando el estado anterior hasta publicar el paquete local de TASK-970/TASK-972.
- No se enviaron campañas reales ni se ejecutaron acciones sobre destinatarios.

## Siguiente recomendado

- Publicar en staging el paquete de Campañas que incluya TASK-970 y TASK-972.
- QA focal posterior en staging para validar textos, semantica DOM y overflow en `1024x768` y `768x1024`.
