# TASK-884 - Handoff

Equipo: QA

Tarea validada: TASK-884 - Reintentar smoke autenticado staging con sesion asistida

Ambiente: Web staging `https://calm-coast-0fabaec0f.7.azurestaticapps.net`; API staging `https://func-puntoclub-stg-br-001.azurewebsites.net/api`; empresa visible: Aurisbel Pasteleria; fecha de ejecucion: 2026-07-09. Sesion iniciada directamente por Product Owner en navegador interno, sin exponer credenciales.

Resultado: aprobado con observaciones

Checks ejecutados:
- Se solicito al Product Owner iniciar sesion directamente en el navegador interno, sin pegar credenciales en chat ni handoff.
- Se valido `/app` autenticado con empresa Aurisbel Pasteleria y menu operativo visible.
- Se valido refresh de `/app`: la sesion persiste y vuelve al shell operativo autenticado.
- Se valido Mi empresa en modo solo lectura: submenus Perfil, Logo, Acceso, Membresias y Comunicaciones visibles.
- Se valido Reportes en modo solo lectura: pantalla carga sin error y queda lista para seleccionar rango/filtros.
- Se valido Comunicaciones / Enviar campanas en modo solo lectura: subnavs visibles, promociones en estado `Pausadas`, boton `Enviar campaña` deshabilitado sin seleccion.
- Se valido que no se ejecutaron compras, canjes, campanas, envios, migraciones, limpiezas, cambios de settings, exportaciones ni uploads.
- Se valido logout: muestra `Sesion cerrada`, vuelve a login y `/app` queda bloqueado sin menu interno.
- Se confirmo `app-config.js` publicado: Web staging apunta a API staging y no a produccion.

Hallazgos:
- Login asistido por PO funciono; QA no recibio ni registro password.
- `/app` autenticado carga correctamente con Aurisbel Pasteleria.
- Refresh mantiene la sesion autenticada.
- Logout invalida la sesion visible; reabrir `/app` redirige a login.
- Mi empresa carga en modo lectura, pero el bloque de logo muestra: `Logo configurado, pero no pudimos cargar la imagen.`
- Reportes carga sin errores visibles en estado inicial.
- Comunicaciones carga con KPIs y subnavs; `PROMOCIONES` aparece como `Pausadas`.
- Enviar campanas no permite envio inmediato: 0 seleccionados y boton de envio deshabilitado.
- Staging sigue leyendo datos reales/controlados de la empresa porque phase 1 apunta a SQL productiva; no se listan datos sensibles en este handoff.
- Admin empresas positivo no se ejecuto porque PO/Infra no cargo el token staging en la UI durante esta prueba. La condicion de la tarea era validarlo solo si PO/Infra cargaba el token.

P0/P1:
- Sin P0/P1 abiertos en el alcance ejecutado.

P2/P3:
- P2: Mi empresa > Logo indica que hay logo configurado, pero no pudo cargar la imagen en staging. Puede deberse a storage/container staging o a datos productivos apuntando a recurso no disponible desde staging.
- P2: Staging phase 1 usa SQL productiva temporalmente; las pantallas autenticadas pueden mostrar datos reales de la empresa. Se mantuvo alcance read-only.
- P2: Admin empresas positivo queda pendiente hasta que PO/Infra cargue `INTERNAL_ADMIN_TOKEN` staging por canal seguro en la UI.
- P2 heredado de TASK-880: no hay marca visual `STAGING` en la UI.

Evidencia:
- `/app` autenticado: visible `Aurisbel Pasteleria`, `Atender cliente`, `Mi empresa`, `Reportes`, `Enviar campanas`.
- Refresh `/app`: mantiene empresa y menu operativo; no vuelve a login.
- Mi empresa: visible submenus `Perfil`, `Logo`, `Acceso`, `Membresias`, `Comunicaciones`; estado del programa `Activa`.
- Mi empresa observacion: `Logo configurado, pero no pudimos cargar la imagen.`
- Reportes: visible `Reporte de actividad`, filtros `Fecha desde`, `Fecha hasta`, `Tipo`, botones `Consultar` y `Exportar CSV`; no se ejecuto consulta/export.
- Comunicaciones: visible `OPERATIVOS 3`, `SUSCRITOS 17`, `BAJAS 0`, `PROMOCIONES Pausadas`; boton `Enviar campaña` deshabilitado con 0 seleccionados.
- Logout: visible `Sesion cerrada`; reabrir `/app` redirige a login y no muestra menu interno.
- `app-config.js` staging:
  - `window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net";`
  - `window.PUNTO_CLUB_COMPANY_ID = "6";`
  - `window.PUNTO_CLUB_USE_MOCK_API = false;`
- No se detectaron referencias visibles a API productiva durante la revision; `app-config.js` no contiene `api.puntoclubcr.com`.

Uso DB cloud: Si, indirecto y limitado. La Web/API staging consultaron datos autenticados y read-only contra SQL productiva temporal de phase 1. No se hicieron escrituras, migraciones, limpiezas, compras, canjes, campanas, envios ni cambios de configuracion.

Riesgos o pendientes:
- Revisar logo en staging para decidir si el container `company-logos-staging` debe tener datos de prueba, fallback distinto o configuracion de lectura separada.
- Ejecutar admin empresas positivo solo lectura cuando PO/Infra cargue el token staging en la UI por canal seguro, sin exponerlo.
- Agregar marca visual de entorno staging para reducir riesgo operativo.
- Priorizar SQL staging phase 2 para evitar exposicion/uso de datos productivos en QA autenticada.

Siguiente recomendado:
- Infra/Web revisar configuracion de logo staging o documentar que no se valida en phase 1.
- Product/Infra cargar token admin staging directamente en UI si se requiere cerrar admin positivo.
- Mantener staging read-only mientras apunte a SQL productiva, salvo tareas explicitas con datos `QA-STAGING-*`.
