Equipo: Infra
Modo de ejecucion: Configuracion / Promociones envio real
Tarea completada: TASK-589 - Activar flag de envio promocional solo para prueba PO

Resultado:
- Se activo `PROMOTIONAL_EMAIL_SEND_ENABLED=true` en Azure Functions para la ventana de prueba controlada del PO.
- Function App: `func-puntoclub-prod-br-001`.
- Resource group: `resource_group_main`.
- No se cambio sender.
- No se cambiaron secretos.
- No se ejecuto envio promocional real.

Configuracion confirmada:
- `PROMOTIONAL_EMAIL_SEND_ENABLED`: `true`.
- `ACS_EMAIL_CONNECTION_STRING`: configurado, valor no expuesto.
- `ACS_EMAIL_SENDER_ADDRESS`: configurado, valor no expuesto.
- `ACS_EMAIL_SENDER_DISPLAY_NAME`: configurado, valor no expuesto.

Verificacion ejecutada:
- Consulta segura de app settings con valores sensibles ocultos.
- Smoke publicado sin sesion:
  - `GET /api/companies/6/promotional-campaigns?limit=1&status=all`
  - Resultado: `401 UNAUTHORIZED`.
- No se llamo endpoint de envio.
- No se envio ningun correo.

Rollback:
- Para desactivar inmediatamente el envio promocional:

```powershell
az functionapp config appsettings set `
  --name func-puntoclub-prod-br-001 `
  --resource-group resource_group_main `
  --settings PROMOTIONAL_EMAIL_SEND_ENABLED=false
```

Condiciones para prueba PO:
- Usar solo destinatarios controlados por PO.
- Confirmar desde la UI antes de enviar.
- No probar por scripts ni llamadas directas salvo nueva tarea explicita.
- Si llega correo a destinatario no seleccionado, revertir el flag a `false` inmediatamente.
- Si ACS falla o hay comportamiento inesperado, revertir el flag a `false` y crear tarea Backend/API.

Uso Azure SQL:
- No.
- Motivo: solo se modifico configuracion de Azure Functions y se hizo smoke que corta en autenticacion `401` antes de operar datos.

Riesgos o pendientes:
- El flag queda activo hasta que se revierta manualmente o por nueva tarea.
- Se recomienda crear tarea de Infra/Release para apagar el flag despues de la prueba PO.
