Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UX envio promocional
Tarea completada: TASK-623 - Mostrar resultado visible y persistente al enviar campana

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-623-HANDOFF.md`

Implementacion:
- El mensaje de estado de `Enviar campanas` ahora usa un contenedor enfocable con `tabindex="-1"`.
- Despues de confirmar un envio real y recibir respuesta del API, la UI muestra un bloque persistente con:
  - total enviados;
  - total fallidos;
  - total omitidos;
  - detalle por destinatario cuando el API devuelve `recipients`.
- El resultado queda visible despues del render de campanas/clientes y no se borra al cerrar el flujo exitoso.
- La pantalla hace scroll/foco al resultado para evitar que el usuario sienta que no paso nada.
- Los errores del API se muestran con foco y scroll.
- Para errores genericos del API se muestra el mensaje real cuando no contiene senales sensibles como password, secret, token, key o connection string.
- Para motivos por destinatario se normalizan razones conocidas:
  - `missing_email`
  - `not_found`
  - `suppressed`
  - `unsubscribed`
  - `provider_not_sent`
  - `send_failed`

Reglas preservadas:
- No se cambiaron contratos API.
- No se cambiaron reglas backend de envio.
- No se activo ni desactivo ningun feature flag.
- No se habilito envio fuera del flujo actual.
- Se mantiene limite MVP de 5 destinatarios.
- Se mantiene seleccion manual de destinatarios.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\index.html app\src\app.js app\styles.css`

Resultado:
- Validacion sintactica aprobada.
- `git diff --check` aprobado.
- El cambio queda listo para QA local visual.

Uso Azure SQL:
- No.
- Motivo: ajuste local de UX/frontend; no requiere datos reales.

Riesgos o pendientes:
- Falta QA visual en navegador para confirmar scroll/foco en desktop/mobile.
- Falta QA con sesion real o API local autenticada para observar el bloque con respuesta real del endpoint.
- Publicacion queda para una tarea de release posterior.
