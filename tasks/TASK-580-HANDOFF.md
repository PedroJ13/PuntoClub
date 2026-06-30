Equipo: QA
Tarea validada: TASK-580 - Validar companyId distinto con sesion en promociones publicadas
Ambiente: API publicada `https://func-puntoclub-prod-br-001.azurewebsites.net` desde navegador interno con sesion real/controlada activa. Check puntual del pendiente de TASK-579. Sin envio real de correos.
Resultado: aprobado
Checks ejecutados:
- Lectura de contexto aplicable: `AGENTS.md` provisto en la conversacion y handoff `TASK-579-HANDOFF.md`.
- `tasks/TASK-580.md` / `tasks/TASK-580-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Navegacion directa en navegador interno a `GET /api/me` para confirmar sesion activa sin leer ni exponer cookies/tokens/passwords.
- Confirmacion de empresa autenticada: `companyId=8`, `Aurisbel Pasteleria`, usuario owner activo.
- Navegacion directa con la misma sesion a `GET /api/companies/9/promotional-campaigns?limit=5&status=all`, usando un `companyId` distinto al autenticado.
Hallazgos:
- El endpoint de promociones publicado bloquea acceso cross-company con error controlado.
- La respuesta observada para `companyId=9` incluye `error.code=FORBIDDEN` y mensaje `Company session is not allowed to access this company.`.
- No se crearon campanas, no se seleccionaron destinatarios, no se ejecutaron bajas, no se llamo endpoint de envio y no se enviaron correos reales.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existen `tasks/TASK-580.md` ni `tasks/TASK-580-assignment.md`.
Evidencia:
- `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/me` -> sesion activa con empresa autenticada `companyId=8`, `Aurisbel Pasteleria`.
- `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/9/promotional-campaigns?limit=5&status=all` -> cuerpo JSON:
  - `error.code`: `FORBIDDEN`
  - `error.message`: `Company session is not allowed to access this company.`
- La prueba cumple el criterio de TASK-580: bloqueo equivalente controlado para `companyId` distinto con sesion activa.
Uso DB cloud: Si, motivo y alcance: validacion QA publicada contra API productiva con sesion activa; solo dos requests GET de lectura/control de acceso (`/api/me` y promociones con `companyId` distinto). Sin conexion SQL directa, sin scripts SQL, sin writes, sin correos reales.
Riesgos o pendientes:
- TASK-579 habia dejado a `Fatima Arraiz` en baja promocional por alcance de esa prueba; TASK-580 no modifico ese estado.
- Mantener envio real promocional bloqueado hasta decision explicita posterior.
Siguiente recomendado: Product / Architect / Release puede procesar TASK-580 como cierre del pendiente de seguridad de TASK-579 y decidir el estado final del paquete publicado de promociones.
