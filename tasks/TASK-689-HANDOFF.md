Equipo: QA
Tarea validada: TASK-689 - Confirmar imagen activa de campana TEST Imagen
Ambiente: Publicado en https://puntoclubcr.com/app con sesion real/controlada de Aurisbel Pasteleria. API publicada https://func-puntoclub-prod-br-001.azurewebsites.net/api. Fecha/hora QA: 2026-07-02 08:17:12 -06:00.
Resultado: no aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, tasks/TASK-676-HANDOFF.md, tasks/TASK-680-HANDOFF.md, tasks/TASK-681-HANDOFF.md, tasks/TASK-682-HANDOFF.md.
- Nota de contexto: tasks/TASK-689.md no existe en este checkout; se uso como fuente la tarea pegada por el Product Owner.
- Sesion publicada visible con empresa Aurisbel Pasteleria y menu Enviar campanas.
- Se abrio Enviar campanas y se confirmo que la campana `TEST Imagen - TEST Imagen` aparece como campana seleccionada.
- Se confirmo via inventario de assets/red observado por el navegador que la pantalla llamo:
  - GET /api/companies/8/promotional-campaigns?status=all&limit=10
  - GET /api/companies/8/promotional-campaigns/10
  - GET /api/companies/8/promotional-campaigns/10/preview
  - GET /api/companies/8/promotional-recipients?status=all&limit=25
- Se abrio `Ver preview` para la campana seleccionada.
- Se inspecciono el DOM/render de imagenes luego de abrir preview.
- Se reviso inventario de assets observados en pagina tras abrir preview.
- Se intento abrir directamente el endpoint API de campaign en una pestana nueva autenticada para leer JSON, pero el navegador bloqueo la navegacion con `net::ERR_BLOCKED_BY_CLIENT`.
- No se enviaron correos reales.
- No se solicitaron, copiaron ni registraron passwords, cookies, tokens ni secretos.

Hallazgos:
- P1: La campana publicada `TEST Imagen - TEST Imagen` no muestra imagen activa en la UI ni en preview. El bloque de imagen queda en `Sin imagen`; el `<img alt="Preview de imagen de campaña">` queda sin `src`, no visible y con `naturalWidth=0`, `naturalHeight=0`.
- P1: Tras abrir preview, el inventario de assets no muestra ninguna URL `/api/public/promotional-campaign-images/...`; solo se observa `favicon.ico` como imagen cargada. Por lo tanto no hay URL publica de imagen para validar con 200 en esta campana.
- Limitacion QA: no se pudo leer directamente el body JSON de `GET campaign` / `preview` por bloqueo del navegador al abrir el endpoint API en pestana nueva. Aun asi, la UI publicada consumio esos endpoints para `companyId=8`, `campaignId=10` y renderizo el resultado sin imagen.

P0/P1:
- P1 abierto: `TEST Imagen - TEST Imagen` no tiene/renderiza imagen activa en preview publicado, pese al objetivo de validar imagen activa.

P2/P3:
- Ninguno nuevo.

Evidencia:
- Empresa visible: Aurisbel Pasteleria.
- Campana seleccionada: `TEST Imagen - TEST Imagen`.
- Assets observados:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/8/promotional-campaigns/10`
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/8/promotional-campaigns/10/preview`
  - No aparece ningun asset `promotional-campaign-images`.
- Preview abierto muestra asunto `TEST Imagen` y cuerpo promocional, pero sin imagen.
- DOM de imagen de campana: alt `Preview de imagen de campaña`, `src` vacio, no visible, `naturalWidth=0`, `naturalHeight=0`, contenedor con texto `Sin imagen`.
- Intento de lectura directa JSON del endpoint API bloqueado por navegador: `net::ERR_BLOCKED_BY_CLIENT`.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicado con sesion real/controlada sobre ambiente productivo de Punto Club.
- Alcance: lectura UI/API indirecta de campanas y preview para Aurisbel Pasteleria. No se consulto Azure SQL directamente desde QA, no se modificaron datos y no se enviaron correos reales.

Riesgos o pendientes:
- Pendiente Backend/API o Web Dev confirmar si la campana `campaignId=10` deberia tener imagen activa en base de datos. Desde Web publicada no se renderiza imagen y no hay URL publica observable.
- Pendiente revalidar `GET campaign` y `preview` con una herramienta/API autorizada que permita ver el JSON autenticado sin exponer cookies, o despues de corregir la campana/datos.
- Si la imagen fue eliminada o nunca quedo asociada, preparar una campana de prueba con imagen activa antes de reintentar QA.

Siguiente recomendado:
- Backend/API o Release debe confirmar/repairar la imagen activa de `TEST Imagen - TEST Imagen` en publicado y luego pedir revalidacion QA. No ejecutar envio real hasta que preview y URL publica de imagen queden aprobados.
