# Decision Log

## 2026-06-02 - Fase 1 sera uso real piloto

Decision: Punto Club fase 1 se tratara como uso real piloto con empresas, no como demo visual.

Motivo: El producto necesita compras, facturas unicas, puntos y redenciones confiables desde el inicio.

Impacto: La arquitectura debe incluir persistencia central, reglas de integridad y separacion por empresa.

## 2026-06-02 - Persistencia inicial con Azure SQL Database

Decision: El plan inicial usara Azure SQL Database minima para el MVP.

Motivo: Se requiere historial, unicidad de facturas, saldo confiable y base para multiempresa futura.

Impacto: Infra y SQL DEV deben definir recursos, modelo, restricciones y costos antes de implementar API/UI.

## 2026-06-02 - Puntos enteros con redondeo al entero mas cercano

Decision: `pointsEarned` sera entero y se calculara como `ROUND(amount * pointsPercentage / 100, 0)` para montos positivos.

Motivo: Simplifica la operacion del piloto y alinea API, SQL y QA con puntos enteros.

Impacto: Backend/API debe calcular puntos server-side; frontend no envia `pointsEarned`. QA usara 25000.00 con 5.00% = 1250 como dato base.

## 2026-06-02 - Empresa inactiva no opera en MVP

Decision: Para MVP, una empresa con `status = inactive` no puede operar. La API debe responder como empresa no disponible usando error generico de no encontrada/no operativa, sin exponer detalles innecesarios.

Motivo: Mantener comportamiento simple y seguro mientras no existe panel administrativo avanzado.

Impacto: Backend/API debe validar `Companies.status = active` antes de operaciones principales. Web Dev debe mostrar un error operativo claro sin prometer reactivacion autoservicio.

## 2026-06-02 - Auth fase 1 en modo empresa piloto unica

Decision: Para fase 1, Punto Club operara en modo empresa piloto unica. La fuente confiable de `companyId` sera configuracion server-side de ambiente, por ejemplo `PILOT_COMPANY_ID=1`; el frontend no puede elegir ni cambiar la empresa operativa.

Motivo: Desbloquea el piloto real sin construir todavia registro publico, aprobacion administrativa, invitaciones, usuarios por empresa o multiempresa autoservicio.

Impacto: Los contratos mantienen `/api/companies/{companyId}` para no romper la forma multiempresa futura, pero Backend/API debe validar que el `companyId` del path coincide con el `PILOT_COMPANY_ID` configurado. Si no coincide, debe responder `404 COMPANY_NOT_FOUND`. Web Dev puede usar un `companyId` configurado no editable para construir rutas, pero no debe tratarlo como autoridad de seguridad.

Riesgo aceptado: El MVP no resuelve usuarios/roles por empresa. Para piloto controlado, el acceso a la app debe limitarse operativamente usando el mecanismo disponible de Azure Static Web Apps o controles de despliegue, y la API mantiene la proteccion minima validando contra configuracion server-side.

## 2026-06-02 - Key Vault y storage de logos diferidos para piloto minimo

Decision: Para el piloto minimo, Key Vault y storage propio de logos quedan diferidos. Los secretos se manejaran como app settings seguros de Azure Functions y Static Web Apps. Los logos usaran URL externa o quedaran fuera hasta decision especifica.

Motivo: Mantener costo y complejidad bajos mientras se valida el flujo principal de clientes, compras, puntos y redenciones.

Impacto: Infra / Azure no debe crear Key Vault ni storage de logos salvo nueva decision. Si aparecen mas secretos, staging permanente, rotacion o carga propia de logos, se reabre como P1 pre-lanzamiento.

## 2026-06-02 - Usar Azure SQL Database existente

Decision: El usuario ya creo una Azure SQL Database para Punto Club. Infra / Azure no debe crear otra base de datos SQL para el piloto.

Motivo: Evitar recursos duplicados, costo innecesario y confusion operativa.

Impacto: Infra / Azure debe inventariar la base existente y documentar servidor, database name, region, tier y forma segura de conexion sin guardar secretos. SQL DEV y Backend/API deben usar esa DB como destino para schema, seed y conexion.

Detalle confirmado: servidor/base `sqlserver-pj13-brazil/sql-db-puntoclub`.

## 2026-06-02 - Validacion API/SQL con firewall temporal

Decision: Para desbloquear validaciones locales inmediatas, se usara una regla temporal de firewall por IP local durante la ventana de prueba, con limpieza obligatoria al terminar. La ruta estable posterior sera Azure Functions con app settings seguros.

Motivo: Permite validar rapido la API contra Azure SQL sin abrir recursos permanentes ni crear Static Web Apps todavia.

Impacto: Backend/API puede ejecutar TASK-028 abriendo una regla temporal documentada, correr smoke test, y cerrar la regla. QA y Web Dev no deben validar hasta que el smoke test sea repetible.
