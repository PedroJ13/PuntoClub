Equipo: Infra
Modo de ejecucion: Configuracion / Promociones envio real
Tarea completada: TASK-598 - Pausar flag de envio promocional antes de publicar nuevo flujo

Resultado:
- Se pauso el envio promocional real en Azure Functions.
- `PROMOTIONAL_EMAIL_SEND_ENABLED=false` quedo configurado en la Function App publicada.
- No se cambio sender.
- No se cambiaron secretos.
- No se ejecuto envio promocional real.

Ambiente:
- Function App: `func-puntoclub-prod-br-001`
- Resource group: `resource_group_main`

Configuracion confirmada:
- `PROMOTIONAL_EMAIL_SEND_ENABLED`: `false`
- `ACS_EMAIL_CONNECTION_STRING`: configurado, valor no expuesto.
- `ACS_EMAIL_SENDER_ADDRESS`: configurado, valor no expuesto.
- `ACS_EMAIL_SENDER_DISPLAY_NAME`: configurado, valor no expuesto.

Verificacion ejecutada:
- Smoke publicado sin sesion:
  - `GET /api/companies/6/promotional-campaigns?limit=1&status=all`
  - Resultado: `401 UNAUTHORIZED`
- No se llamo endpoint de envio.
- No se enviaron correos.

Reactivacion posterior:
- Activar solo cuando el nuevo flujo campana/plantilla + seleccion al enviar este publicado y validado:

```powershell
az functionapp config appsettings set `
  --name func-puntoclub-prod-br-001 `
  --resource-group resource_group_main `
  --settings PROMOTIONAL_EMAIL_SEND_ENABLED=true
```

Uso Azure SQL:
- No.
- Motivo: solo se modifico configuracion de Azure Functions y se hizo smoke que corta en autenticacion `401`.

Riesgos o pendientes:
- Mientras el flag este en `false`, la UI/API deben bloquear envio promocional real aunque el flujo nuevo este publicado.
- Requiere nueva tarea/decision para reactivar durante ventana de prueba PO.
