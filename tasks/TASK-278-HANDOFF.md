# TASK-278 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Completed with blocker
Fecha: 2026-06-14

## Resultado

No se crearon datos directamente en Azure SQL ni por API porque el escenario requiere acceso real de empresa o acceso SQL con firewall habilitado. Se deja un runbook exacto y seguro para que QA/PO cree el escenario desde la UI con una cuenta existente.

## Evidencia revisada

Se leyeron:

- `tasks/TASK-261-HANDOFF.md`
- `tasks/TASK-264-HANDOFF.md`
- `tasks/TASK-267-HANDOFF.md`
- `tasks/TASK-270-HANDOFF.md`
- `tasks/TASK-274-HANDOFF.md`
- `tasks/TASK-277-HANDOFF.md`

Resultado comun de esos handoffs:

- API/Web de membresias estan publicados y protegidos.
- Falta prueba positiva con sesion real.
- No se deben inventar ni exponer credenciales, cookies, tokens o secretos.

## Intento tecnico seguro

Se intento consultar solo metadatos no sensibles de Azure SQL usando `local-secrets/sql_admin.ps1` sin imprimir secretos.

Resultado:

- Dependencia `mssql` local disponible en `api/node_modules`.
- Conexion a Azure SQL fallo por conectividad/firewall:
  - `ETIMEOUT`
  - `Failed to connect to sqlserver-pj13-brazil.database.windows.net:1433 in 15000ms`

Por regla de TASK-278, al requerir firewall/permisos se bloqueo la preparacion directa y se documentan instrucciones.

## Empresa recomendada para prueba

Usar una empresa activa existente a la que QA/PO pueda iniciar sesion por el canal normal:

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/login`
- No crear credenciales nuevas.
- No compartir password/cookie/token en handoffs.
- Confirmar visualmente que la empresa autenticada es la esperada antes de crear datos.

## Datos a crear desde UI

Usar siempre prefijo:

- `QA E2E Membresias 2026-06-14`

Usar montos `0` para no afectar lectura financiera real.

### 1. Plan activo con beneficio

En `Membresias` crear plan:

- Nombre: `QA E2E Membresias Activa 2026-06-14`
- Duracion en dias: `30`
- Precio: `0`
- Aviso de renovacion: `5`
- Estado: activo

Crear beneficio para ese plan:

- Nombre: `QA E2E Beneficio Cafe 2026-06-14`
- Tipo: producto incluido o cantidad incluida
- Aplica a: texto libre o producto
- Nombre aplicable: `QA Cafe`
- Cantidad incluida: `1`
- Limite de uso: `1`
- Periodo: `month`
- Estado: activo

### 2. Plan corto para vencimiento/renovacion

En `Membresias` crear plan:

- Nombre: `QA E2E Membresias 1 Dia 2026-06-14`
- Duracion en dias: `1`
- Precio: `0`
- Aviso de renovacion: `1`
- Estado: activo

### 3. Clientes de prueba

Crear tres clientes, todos con datos claramente sinteticos:

Cliente A:

- Nombre: `QA E2E Membresias Activa 2026-06-14`
- Telefono: `+50600002781`
- Email: `qa-e2e-activa-20260614@example.test`

Cliente B:

- Nombre: `QA E2E Membresias Renovacion 2026-06-14`
- Telefono: `+50600002782`
- Email: `qa-e2e-renovacion-20260614@example.test`

Cliente C:

- Nombre: `QA E2E Membresias Vencida 2026-06-14`
- Telefono: `+50600002783`
- Email: `qa-e2e-vencida-20260614@example.test`

### 4. Activaciones

En `Membresias > Activar membresia`:

Cliente A:

- Plan: `QA E2E Membresias Activa 2026-06-14`
- Fecha de inicio: `2026-06-14`
- Precio pagado: `0`
- Metodo de pago: `cash`

Cliente B:

- Plan: `QA E2E Membresias 1 Dia 2026-06-14`
- Fecha de inicio: `2026-06-13`
- Precio pagado: `0`
- Metodo de pago: `card`

Cliente C:

- Plan: `QA E2E Membresias 1 Dia 2026-06-14`
- Fecha de inicio: `2026-06-13`
- Precio pagado: `0`
- Metodo de pago: `cash`

Con esto deben existir transacciones `new_membership` para los tres clientes. Cliente B y C quedan vencidos por fecha.

### 5. Uso de beneficio

En `Operaciones`, buscar Cliente A:

- Verificar `Membresia activa`.
- Registrar uso del beneficio `QA E2E Beneficio Cafe 2026-06-14`.
- Fecha de uso: `2026-06-14`
- Cantidad: `1`
- Nota: `QA E2E uso beneficio 2026-06-14`

### 6. Renovacion

En `Operaciones`, buscar Cliente B:

- Debe aparecer accion `Renovar membresia`.
- Metodo de pago: `transfer`
- Monto: `0`
- Confirmar.

Con esto debe existir transaccion `renewal` para Cliente B.

No renovar Cliente C; dejarlo como dato vencido para alertas.

## Validaciones que QA puede ejecutar despues

### Operaciones

- Cliente A muestra membresia activa.
- Cliente A permite registrar uso de beneficio.
- Historial de usos muestra el uso registrado.
- Cliente B permite renovacion y muestra confirmacion inline.
- Cliente B muestra `Transacciones de membresia` con `new_membership` y `renewal`.
- Cliente C queda como vencido/no renovado.

### Membresias

- `Seguimiento > Vencidas` debe incluir Cliente C.
- Si el rango de aviso incluye hoy, el plan de 1 dia puede apoyar validacion de vencimiento.

### Reportes

En Reportes, consultar rango:

- Desde: `2026-06-13`
- Hasta: `2026-06-14`

Validar:

- Reporte de actividad con tipo `Membresias` muestra activaciones/uso de beneficio.
- Auditoria muestra eventos de membresias.
- `Reporte diario - Membresias` muestra:
  - `Membresias nuevas`: al menos `3`
  - `Renovaciones`: al menos `1`
  - `Monto por metodo de pago` con `cash`, `card`, `transfer`
  - montos `0`
- CSV financiero descarga con columnas:
  - `fecha_hora`
  - `fecha_transaccion`
  - `cliente`
  - `telefono`
  - `email`
  - `plan`
  - `tipo`
  - `metodo_pago`
  - `monto`
  - `nota`

## IDs publicables

No hay IDs creados por Ejecucion Tecnica en esta tarea.

Si QA/PO crea los datos desde UI, puede registrar en `tasks/TASK-279-HANDOFF.md` los IDs publicables que devuelva API/UI, evitando incluir credenciales, cookies o tokens.

## Riesgos

- Crear datos desde una empresa real agrega registros QA persistentes. No se deben borrar ni limpiar por esta tarea.
- Usar montos `0` reduce impacto financiero, pero los registros apareceran en reportes.
- Si la empresa ya tiene clientes/planes con nombres similares, usar el prefijo completo con fecha para evitar confusion.
- El acceso SQL directo sigue bloqueado mientras no se habilite firewall o una red permitida.

## Que falta si se quiere preparacion automatizada por Backend/API

Para que Ejecucion Tecnica siembre el escenario por SQL/API en una tarea futura, se necesita una de estas opciones:

- Una sesion real provista por canal seguro y no pegada en el chat; o
- Aprobacion explicita para abrir firewall temporal de Azure SQL, mas confirmacion del `company_id` objetivo; o
- Ejecucion manual del runbook SQL/API por una persona con acceso seguro.

No se requieren credenciales nuevas; se debe usar una cuenta existente con permisos de empresa.
