Equipo:
Backend/API

Tarea completada:
TASK-004 - Proponer contratos API MVP.

Archivos cambiados:
- docs/API_CONTRACTS.md
- tasks/TASK-004-HANDOFF.md

Verificacion ejecutada:
- Revision estatica contra TASK-004.
- Contratos cubren configuracion de empresa, clientes, compras, redenciones y saldo/historial de cliente.
- Casos negativos cubiertos: factura duplicada, cliente no existe, redencion mayor al saldo, datos invalidos y empresa no valida.
- Validaciones dependientes de SQL alineadas con database/schema.sql y tasks/TASK-003-HANDOFF.md.
- No se implementaron endpoints ni cambios SQL.

Resultado:
Se actualizo docs/API_CONTRACTS.md con rutas MVP, payloads, respuestas, formato de errores, HTTP status esperados y dependencias SQL.

Riesgos o pendientes:
- Auth fase 1 sigue pendiente; hasta definirla, `companyId` en path no debe considerarse confiable por si solo.
- Product / Architect / Release debe confirmar la regla final de redondeo de `pointsEarned`.
- Product / Architect / Release debe decidir si empresa inactiva se responde como 404 generico o error visible.
- La API debe usar dbo.RegisterRedemption o una transaccion equivalente para evitar redenciones concurrentes mayores al saldo.
- Paginacion de listados e historial queda como pendiente si el piloto supera volumen basico.

Siguiente recomendado:
Product / Architect / Release debe revisar pendientes de decision y luego asignar implementacion Backend/API o integracion Web Dev contra estos contratos.
