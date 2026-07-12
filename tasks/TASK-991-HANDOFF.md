# TASK-991 - Handoff

Equipo: Ejecucion Tecnica
Modo: Web Dev
Tarea completada: TASK-991 - Aplicar copy de gestion en staging

## Resultado

Se ajusto el copy visible de gestion para Mi empresa, Logo/Acceso/Comunicaciones, Membresias/Beneficios y Reportes, siguiendo la guia de TASK-982 y respetando el alcance de Web Dev.

Textos principales ajustados:
- Mi empresa: loading `Cargando configuracion de empresa...` y validaciones de datos de empresa mas accionables.
- Logo: mensaje de carga `Subiendo logo...`, error visual `No pudimos cargar el logo. Intenta subirlo de nuevo.` y validacion `Usa una imagen PNG, JPG o WebP.`
- Acceso: exito de password simplificado a `Contrasena actualizada.`
- Comunicaciones de Mi empresa: `Puntos ganados y saldo total del cliente.` y exito `Correos operativos guardados.`
- Membresias/Beneficios: acentos visibles en `Duracion`, `Descripcion`, `Dias`, `Dia`; empty states y errores con tono mas claro.
- Reportes: `Reporte diario de membresias` cambio a `Reporte de membresias`; `Eventos recientes` cambio a `Movimientos recientes`; loading/error/empty states alineados a `Consultar` y rango de fechas.

No se tocaron Campanas/Promociones fuera de Mi empresa > Comunicaciones, Admin, API, SQL, auth, sesiones, ACS, sender, flags, reglas de negocio ni datos.

Publicacion staging:
- Commit: `901c84f` (`TASK-991 aplicar copy gestion staging`).
- Rama: `staging`.
- Workflow: `Deploy Punto Club frontend staging`.
- Resultado: `success`.
- URL base staging: `https://calm-coast-0fabaec0f.7.azurestaticapps.net`.

## Archivos cambiados

- `app/index.html`
- `app/src/app.js`
- `tasks/TASK-991-HANDOFF.md`

## Validacion ejecutada

- `npx prettier --check app/index.html app/src/app.js` - OK.
- `node --check app/src/app.js` - OK.
- Busqueda de remanentes en alcance:
  - sin `Reporte diario de membresias`;
  - sin `Eventos recientes`;
  - sin `Puntos ganados y saldo total como snapshot`;
  - sin labels visibles sin acento corregidos en membresias/reportes.
- Smoke local con Playwright en `1366x768`, `1024x768` y `390x844`:
  - textos nuevos presentes;
  - textos anteriores ausentes;
  - sin overflow horizontal;
  - sin login real ni escrituras de datos.
- Smoke publicado sin sesion en Web staging:
  - `GET /app` - 200.
  - `app/src/app.js` publicado - 200.
  - Presentes: `Cargando configuración de empresa`, `Reporte de membresías`, `Movimientos recientes`, `No pudimos cargar el logo. Intenta subirlo de nuevo.`, `No pudimos cargar el reporte. Revisa el rango e intenta de nuevo.`
  - Ausentes: `Puntos ganados y saldo total como snapshot`, `Reporte diario de membresías`, `despues del deploy`, `Cargando reporte...`.

## Uso Azure SQL

No.

## P0/P1

No detectados.

## P2/P3

No detectados.

## Riesgos o pendientes

- `Preview`, `feature flag`, `snapshot` y `Refrescar lista` persisten en Campanas/Promociones porque TASK-991 declara ese modulo fuera de alcance salvo textos compartidos dentro de Mi empresa > Comunicaciones.
- Pendiente QA en Web staging con sesion controlada para revisar visualmente Mi empresa, Membresias/Beneficios y Reportes.

## Siguiente recomendado

QA debe validar TASK-992 en Web staging, sin guardar configuracion, subir logos, cambiar password, crear membresias/beneficios ni exportar CSV real salvo autorizacion explicita.
