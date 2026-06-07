Equipo:
Web Dev

Tarea completada:
TASK-109 - Crear pantalla de configuracion de empresa piloto.

Cambios realizados:
- Agregue acceso `Empresa` en el encabezado.
- Agregue panel `Empresa piloto` para ver y editar configuracion operativa.
- El panel muestra:
  - nombre;
  - email;
  - telefono;
  - logo URL como enlace `Ver logo` si existe y es http(s);
  - porcentaje de puntos;
  - estado;
  - fecha de actualizacion.
- Agregue loading, error API, error de validacion y confirmacion visible de guardado.
- El panel no carga reportes ni datos pesados automaticamente.
- No implemente auth, selector de empresa ni multiempresa.
- No cambie API, SQL, Caja, Reporte ni Auditoria salvo navegacion minima y labels de auditoria para settings.

Ruta/API consumida:
```text
GET /api/companies/{companyId}/settings
PATCH /api/companies/{companyId}/settings
```

Payload enviado por la UI:
```json
{
  "name": "Punto Club Piloto",
  "email": "piloto@puntoclub.test",
  "phone": "+50622224444",
  "logoUrl": "https://example.com/logo.png",
  "pointsPercentage": "7.5"
}
```

Archivos modificados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `docs/TASK_BOARD.md`
- `tasks/TASK-109-HANDOFF.md`

Evidencia local:
- Servidor local usado: `http://127.0.0.1:4183`.
- Modo de prueba: `Mock local` inyectado solo en navegador/headless para validacion.
- Estado inicial validado:
  - fuente `Mock local`;
  - formulario de empresa visible;
  - nombre `Cafe Central`;
  - email `hola@cafecentral.test`;
  - telefono `+50622223333`;
  - porcentaje `5`;
  - estado `Activa`.
- Reporte y Auditoria mantienen estado inicial sin consulta pesada:
  - `Consulte un rango de fechas para ver la actividad.`
  - `Consulte un rango de fechas para ver eventos recientes.`

Validaciones:
- Entrada invalida probada:
  - nombre vacio;
  - email `bad-email`;
  - telefono `123`;
  - logo URL `ftp://logo.test/a.png`;
  - porcentaje `101`.
- Mensaje general:
  - `Revise los campos marcados.`
- Mensajes por campo:
  - `El nombre es requerido y debe tener 160 caracteres o menos.`
  - `El email debe tener un formato valido y 254 caracteres o menos.`
  - `El telefono debe tener entre 7 y 32 caracteres.`
  - `El logo URL debe ser una URL http(s) valida.`
  - `El porcentaje debe ser mayor que 0 y menor o igual que 100.`

Guardado exitoso:
- Valores guardados en mock:
  - nombre `Punto Club Piloto`;
  - email `piloto@puntoclub.test`;
  - telefono `+50622224444`;
  - logo URL `https://example.com/logo.png`;
  - porcentaje `7.5`.
- Confirmacion visible:
  - `Configuracion guardada.`
- Logo mostrado como:
  - `Ver logo`.

Auditoria local:
- Despues del guardado, consulta local de auditoria mostro:
  - `Auditoria cargada: 1 eventos.`
  - evento `Configuracion actualizada`;
  - entidad `Empresa`, `ID 1`;
  - resumen `Configuracion actualizada: name, email, phone, logoUrl, pointsPercentage.`

Pruebas responsive:
- Desktop `1366x900`:
  - `overflowX=false`;
  - `clientWidth=1351`;
  - `scrollWidth=1351`;
  - panel empresa ancho `1240`.
- Mobile `390x900`:
  - `overflowX=false`;
  - `clientWidth=390`;
  - `scrollWidth=390`;
  - panel empresa ancho `370`.

Pruebas ejecutadas:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Validacion browser/headless via Chrome DevTools Protocol contra servidor local.

Evidencia publicada:
- No se ejecuto validacion publicada en esta tarea.
- Motivo: el alcance Web Dev fue implementacion local y handoff; TASK-110 queda bloqueada para QA hasta deploy de API/UI/auditoria de settings segun tablero.
- No se hizo PATCH contra ambiente publicado para evitar modificar configuracion real de la empresa piloto desde esta tarea.

Resultado:
Completado localmente. La UI de configuracion de empresa piloto queda lista para review/deploy y posterior QA publicada.

Riesgos o pendientes:
- Pendiente deploy de frontend con esta pantalla.
- Pendiente confirmar que API publicada tenga `PATCH /settings` desplegado antes de QA.
- Pendiente QA TASK-110 despues de deploy.
