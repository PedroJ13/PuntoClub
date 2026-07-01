Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Observabilidad
Tarea completada: TASK-607 - Definir consulta visible de correos enviados

Resultado:
- Se define una consulta visible para revisar correos operativos enviados, fallidos u omitidos.
- La consulta debe cubrir correos de:
  - bienvenida / registro de cliente;
  - compra;
  - canje.
- El objetivo es evitar diagnosticos manuales repetidos por SQL cuando una empresa pregunte si un correo salio.
- Esta tarea no implementa codigo, SQL ni cambios de Azure.

Modelo funcional:
- Crear una vista de consulta dentro de la app para empresas y/o administracion interna.
- Nombre sugerido:
  - `Correos enviados`
  - o `Historial de correos`
- Ubicacion recomendada:
  - Para empresa: `Mi empresa > Comunicaciones > Correos operativos`.
  - Para soporte/admin futuro: panel interno con filtro por empresa.

Datos a mostrar:
- Fecha/hora.
- Tipo:
  - `Bienvenida`;
  - `Compra`;
  - `Canje`.
- Cliente:
  - nombre si esta disponible;
  - email destino;
  - telefono opcional si ayuda a identificar.
- Estado:
  - `Enviado`;
  - `Fallido`;
  - `Omitido`;
  - `Pendiente` si existe.
- Motivo o detalle:
  - cliente sin email;
  - correo desactivado por configuracion;
  - ACS no configurado;
  - error del proveedor;
  - evento duplicado;
  - aceptado/enviado por proveedor.
- Asunto.
- ID de proveedor si existe, visible solo como referencia tecnica compacta.
- Entidad relacionada:
  - customer id para bienvenida;
  - purchase id para compra;
  - redemption id para canje.

Filtros requeridos:
- Rango de fechas.
- Tipo de correo.
- Estado.
- Busqueda por cliente:
  - nombre;
  - email;
  - telefono.
- Para admin interno, filtro por empresa.

Reglas de seguridad:
- Empresas solo pueden ver correos de su propia empresa autenticada.
- No exponer connection strings, tokens, headers, cookies ni payload completo de ACS.
- No mostrar cuerpos completos si contienen datos sensibles; para MVP basta asunto, tipo, estado y destinatario.
- Si se muestra error, debe ser un mensaje sanitizado y no stack trace.
- No permitir reenvio desde esta pantalla en MVP; solo consulta.

Fuente de datos:
- Usar las tablas ya creadas:
  - `dbo.OperationalEmailEvents`;
  - `dbo.OperationalEmailMessages`;
  - `dbo.OperationalEmailAttempts`.
- La vista/API debe unir evento, mensaje e ultimo intento para mostrar el estado mas util.
- No se requiere nueva tabla para el MVP de consulta.

Contratos sugeridos:
- Empresa autenticada:
  - `GET /api/my-company/operational-emails?from=&to=&type=&status=&search=&limit=`
- Alternativa consistente con rutas existentes:
  - `GET /api/companies/{companyId}/operational-emails?...`
  - siempre validando que `companyId` coincida con la sesion.
- Admin interno futuro:
  - `GET /api/internal/operational-emails?companyId=&...`
  - protegido por mecanismo interno existente.

Estados esperados:
- `sent`: correo intentado y aceptado/enviado por adaptador/proveedor.
- `failed`: hubo intento y fallo.
- `skipped`: no se intento enviar por regla/configuracion.
- `pending`: registrado pero aun no finalizado, si aplica.

Limitaciones a documentar en UI:
- `Enviado` confirma que Punto Club/ACS acepto o proceso el envio segun el registro disponible.
- No siempre confirma que el mailbox final lo puso en bandeja de entrada.
- Para entregabilidad final puede requerirse diagnostico ACS/monitoring adicional.

Prioridad recomendada:
- P1 operativo.
- Motivo: ya hay correos operativos reales y soporte necesita responder rapido si un cliente recibio o no el correo.

Tareas siguientes sugeridas:
- SQL DEV: preparar query/base de consulta con indices existentes y revisar performance.
- Backend/API: exponer endpoint seguro de consulta.
- Diseno / UX: definir pantalla simple y copy de estados.
- Web Dev: implementar la vista.
- QA: validar con datos locales/mock y luego publicado con sesion real/controlada.

Uso Azure SQL:
- No.
- Motivo: definicion funcional de observabilidad; no se consulto ni modifico DB real.

Riesgos o pendientes:
- Si se necesita confirmar entregabilidad final de ACS, podria requerir integracion adicional con logs/eventos de ACS.
- Revisar si el estado `sent` actual representa aceptacion del proveedor o entrega final antes de poner copy definitivo.
- Evitar exponer detalles tecnicos excesivos a empresas; para admin interno se puede mostrar mas detalle.

Siguiente recomendado:
- Crear tarea Backend/API o SQL DEV para definir e implementar la consulta de correos operativos.
