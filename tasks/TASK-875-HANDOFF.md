# TASK-875 - Handoff

Equipo: QA

Tarea validada: TASK-875 - Preparar checklist QA para staging phase 1

Ambiente: Documentacion local del repo. Fuente principal revisada: `docs/STAGING_ENVIRONMENT_PHASE1.md`. Tambien se revisaron `docs/README.md`, `docs/MVP_RELEASE_STATUS.md` y `docs/QA_TEST_PLAN.md`.

Resultado: aprobado

Checks ejecutados:
- Se preparo checklist de smoke seguro para staging phase 1.
- Se considero que staging phase 1 duplica Web/API, pero puede apuntar temporalmente a Azure SQL productiva.
- Se incluyeron controles para home/producto, login/logout, `/app`, flujo operativo seguro, Mi empresa, reportes, admin empresas, rutas publicas, CORS/cookies y correos/campanas.
- Se definieron limites explicitos para no enviar correos/campanas reales ni hacer pruebas destructivas o masivas.
- Se definieron severidades P0/P1/P2/P3 para hallazgos esperados.

Hallazgos:
- Staging phase 1 es apto para validar deploy Web/API, rutas, configuracion, auth, CORS/cookies y regresion visual/funcional de bajo impacto.
- Staging phase 1 no es apto para pruebas masivas, limpieza de datos, migraciones destructivas ni campanas/correos reales porque puede usar SQL productiva.
- El smoke debe usar empresa/cuenta QA controlada y datos marcados `QA-STAGING-*`.
- `INTERNAL_ADMIN_TOKEN` de staging debe ser distinto al de produccion y nunca debe pegarse en handoffs, capturas o logs.
- Correos operativos/promocionales deben estar deshabilitados, mockeados o restringidos por bandera; cualquier envio real requiere aprobacion explicita del Product Owner y destinatario autorizado.
- No existen en el repo `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` ni `tasks/TASK-875.md` al momento de esta preparacion.

P0/P1:
- Sin P0/P1 abiertos para este entregable de plan.

P2/P3:
- P2: Staging phase 1 conserva riesgo operacional si apunta a SQL productiva; el checklist limita la prueba, pero no elimina el riesgo hasta phase 2 con SQL staging separado.
- P3: faltan docs operativos nuevos mencionados por proceso (`docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md`) en el workspace local.

Evidencia:

## Checklist QA staging phase 1

### 0. Preflight obligatorio

- [ ] Confirmar URL Web staging y URL API staging.
- [ ] Confirmar que Web staging consume API staging, no API productiva.
- [ ] Confirmar si API staging apunta a SQL productiva o a otra base.
- [ ] Confirmar empresa/cuenta QA autorizada para pruebas.
- [ ] Confirmar que no se ejecutaran migraciones SQL desde staging.
- [ ] Confirmar que no se haran pruebas de carga ni creacion masiva de datos.
- [ ] Confirmar flags de correos/campanas: deshabilitados, mock, o controlados.
- [ ] Confirmar que cualquier token admin staging se usa solo desde canal seguro y no se registra en evidencia.

Severidad:
- P0 si Web staging llama a API productiva por error.
- P0 si staging expone o modifica datos de otra empresa.
- P1 si no se puede determinar a que API/SQL esta apuntando staging.
- P1 si correos/campanas reales quedan habilitados sin aprobacion.

### 1. Home/producto y assets

- [ ] Abrir home staging.
- [ ] Confirmar contenido principal de Punto Club y marca correcta.
- [ ] Confirmar que CSS/JS cargan sin errores visibles.
- [ ] Confirmar cache busting o versionado esperado en assets.
- [ ] Probar refresh fuerte y navegacion inicial.
- [ ] Validar desktop y mobile basico.

Severidad:
- P1 si home no carga o muestra pagina default.
- P2 si hay errores visuales que degradan confianza pero no bloquean login.
- P3 si hay detalle menor de copy/espaciado.

### 2. Rutas publicas

- [ ] Abrir `/`.
- [ ] Abrir `/company-registration`.
- [ ] Abrir `/company-invitations/accept` sin token y confirmar estado controlado, sin 404.
- [ ] Abrir `/company-invitations/accept?token=invalid-staging-qa` y confirmar rechazo controlado.
- [ ] Abrir ruta profunda inexistente y confirmar fallback esperado sin romper assets.
- [ ] Confirmar que rutas publicas no envian cookies/credenciales privadas innecesarias cuando no aplica.

Severidad:
- P1 si rutas publicas o profundas devuelven 404 de hosting.
- P1 si token invalido produce error tecnico/500.
- P0 si una ruta publica expone datos privados o token.

### 3. Login/logout y sesion

- [ ] Login con empresa/cuenta QA autorizada.
- [ ] Confirmar acceso a `/app`.
- [ ] Refrescar `/app` y confirmar persistencia de sesion.
- [ ] Abrir una ruta interna profunda y confirmar que mantiene sesion.
- [ ] Logout y confirmar salida completa.
- [ ] Intentar acceder a `/app` despues de logout y confirmar redireccion/bloqueo.
- [ ] Probar credenciales invalidas sin exponer password en evidencia.
- [ ] Probar sesion vencida o cookie ausente, si es viable, y confirmar mensaje claro.

Severidad:
- P1 si login valido no entra.
- P1 si logout no limpia sesion.
- P0 si se accede a datos autenticados sin sesion.
- P2 si el mensaje de sesion vencida es confuso pero seguro.

### 4. `/app` y shell operativo

- [ ] Confirmar empresa activa visible y coherente.
- [ ] Confirmar menu principal: Atender cliente, Mi empresa, Reportes, Enviar campanas y opciones esperadas.
- [ ] Confirmar que refresh no deja la UI en blanco.
- [ ] Confirmar que no aparecen errores globales de API.
- [ ] Validar responsive basico en desktop y mobile.

Severidad:
- P1 si `/app` no renderiza con sesion valida.
- P1 si menu principal navega a modulo incorrecto.
- P2 si hay overflow mobile que no bloquea flujo critico.

### 5. Flujo operativo seguro

Usar solo datos controlados `QA-STAGING-*`.

- [ ] Buscar un cliente QA existente por nombre/correo/telefono.
- [ ] Si se permite crear data, crear un cliente QA con identificador unico y correo autorizado/no real o controlado.
- [ ] Registrar una compra pequena con factura unica `QA-STAGING-YYYYMMDD-*`.
- [ ] Confirmar puntos calculados y saldo actualizado.
- [ ] Intentar factura duplicada y confirmar rechazo sin alterar saldo.
- [ ] Intentar monto 0/negativo y confirmar rechazo.
- [ ] Redimir una cantidad pequena solo si hay saldo QA suficiente y aprobacion para alterar ese cliente QA.
- [ ] Intentar redencion mayor al saldo y confirmar rechazo.
- [ ] Confirmar historial de cliente coherente.

Restricciones:
- No usar clientes reales no autorizados.
- No limpiar/borrar datos.
- No pruebas masivas.
- No ejecutar migraciones.

Severidad:
- P0 si saldo/puntos se calculan mal o se mezclan empresas.
- P1 si no se puede registrar compra QA valida.
- P1 si se acepta duplicado, monto invalido o redencion invalida.
- P2 si mensajes son poco claros pero la integridad se conserva.

### 6. Mi empresa

- [ ] Abrir Perfil y confirmar datos de empresa QA/staging.
- [ ] Confirmar que editar/guardar queda limitado a datos QA aprobados.
- [ ] Abrir Logo y confirmar preview/fallback.
- [ ] No subir/reemplazar logo si usa storage/datos productivos, salvo aprobacion explicita.
- [ ] Abrir Acceso y confirmar cambio de password colapsado/seguro sin ejecutar cambio salvo tarea explicita.
- [ ] Abrir Membresias y confirmar que no se mezcla con otras secciones.
- [ ] Abrir Comunicaciones y confirmar settings visibles.
- [ ] Confirmar que switches de correos/campanas no habilitan envio real sin aprobacion.

Severidad:
- P0 si Mi empresa expone datos de otra empresa.
- P1 si guardar settings rompe la empresa o activa envios reales sin aprobacion.
- P2 si alguna seccion no carga pero no afecta auth/operacion.

### 7. Reportes

- [ ] Abrir Reportes.
- [ ] Confirmar KPIs/tablas cargan para la empresa autenticada.
- [ ] Probar filtros de fecha seguros.
- [ ] Confirmar que exportar, si existe, no incluye datos de otra empresa.
- [ ] Validar responsive basico.

Severidad:
- P0 si reportes mezclan empresas.
- P1 si reportes no cargan por error API.
- P2 si export/formatos fallan pero pantalla principal sirve.

### 8. Admin empresas con token staging

Precondicion: token staging obtenido por canal seguro, distinto a produccion. No pegar token en chat, handoff, logs ni capturas.

- [ ] Abrir `/admin-companies` en staging.
- [ ] Sin token: confirmar bloqueo controlado.
- [ ] Token invalido: confirmar 403/401 controlado.
- [ ] Token staging valido: confirmar listado o estado esperado.
- [ ] Confirmar que no se exponen links/tokens de invitacion raw.
- [ ] No aprobar/rechazar/reemitir solicitudes reales salvo autorizacion explicita.
- [ ] Confirmar que el token no queda en localStorage/sessionStorage si la UI lo maneja en memoria.

Severidad:
- P0 si admin abre sin token o con token incorrecto.
- P0 si se exponen tokens/links sensibles.
- P1 si token staging valido no funciona y bloquea smoke.
- P2 si UX del token es confusa pero segura.

### 9. Comunicaciones, correos y campanas

- [ ] Confirmar visualmente que correos operativos/promocionales estan bloqueados, mockeados o marcados como controlados.
- [ ] Confirmar que Enviar campanas no permite envio real por defecto.
- [ ] Confirmar que preview de campanas funciona sin enviar.
- [ ] Confirmar que historial/listados cargan sin reenvio.
- [ ] Confirmar que botones de envio muestran confirmacion y cantidad real, sin ejecutar envio.
- [ ] No enviar correo operativo/promocional real salvo aprobacion explicita del Product Owner y destinatario autorizado.

Severidad:
- P0 si staging envia campanas reales sin aprobacion.
- P1 si UI permite envio real sin confirmacion/flag.
- P1 si preview/listados fallan con 500.
- P2 si copy no deja claro que staging esta bloqueado/controlado.

### 10. CORS, cookies y origenes

- [ ] Desde Web staging, confirmar llamadas API staging exitosas con cookies.
- [ ] Confirmar `Access-Control-Allow-Origin` acotado a origen staging esperado, no wildcard con credenciales.
- [ ] Confirmar cookies `Secure`, `HttpOnly` cuando aplique y `SameSite` compatible con el origen staging.
- [ ] Confirmar logout invalida/expira sesion.
- [ ] Confirmar API staging rechaza requests sin sesion en endpoints privados.
- [ ] Confirmar API staging rechaza origen no permitido si se prueba de forma segura.

Severidad:
- P0 si endpoints privados responden sin sesion.
- P0 si CORS permite origenes arbitrarios con credenciales.
- P1 si cookies no persisten entre Web staging y API staging.
- P1 si logout no invalida la sesion.

### 11. Responsive basico

- [ ] Desktop 1280px: home, login, `/app`, Atender cliente, Mi empresa, Reportes, Enviar campanas.
- [ ] Mobile aproximado 390px: home, login, menu, Atender cliente, Enviar campanas.
- [ ] Confirmar que botones criticos no se solapan.
- [ ] Confirmar tablas/listas tienen scroll o layout usable.

Severidad:
- P1 si mobile bloquea login o flujo operativo principal.
- P2 si hay overflow con workaround.
- P3 si es solo pulido visual.

### 12. Cierre del smoke

- [ ] Logout final.
- [ ] Registrar datos QA creados o modificados.
- [ ] Confirmar que no se enviaron correos/campanas reales.
- [ ] Confirmar que no se tocaron datos reales no autorizados.
- [ ] Confirmar que no se ejecutaron migraciones ni limpieza SQL.
- [ ] Adjuntar evidencia redaccionada sin secretos.

Uso DB cloud: No para preparar este checklist. Para ejecutar el smoke staging phase 1 podria haber uso indirecto de Azure SQL productiva si API staging apunta a esa base; el alcance debe limitarse a datos QA controlados y quedar declarado en el handoff de ejecucion.

Riesgos o pendientes:
- Staging phase 1 todavia puede afectar SQL productiva si API staging usa la connection string productiva.
- Falta confirmar URL final de Web/API staging y app settings reales antes de ejecutar QA.
- Falta confirmar si correos/campanas quedan bloqueados por flag, mock o restriccion de destinatarios.
- Falta confirmar token admin staging por canal seguro antes de prueba positiva de admin empresas.
- Phase 2 deberia crear SQL staging separada para permitir QA mas amplio sin riesgo a datos productivos.

Siguiente recomendado:
- Infra debe entregar URLs staging, matriz de app settings y confirmacion de flags seguros.
- Backend/API debe entregar smoke endpoints y comportamiento esperado de auth/CORS/cookies en staging.
- Web Dev debe confirmar API base staging y rutas/fallback.
- QA debe ejecutar este checklist solo cuando staging exista, con datos QA controlados y sin envios reales salvo aprobacion explicita.
