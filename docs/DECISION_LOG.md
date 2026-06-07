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

## 2026-06-02 - IDs bigint como string en API

Decision: Los ids respaldados por SQL `bigint` pueden devolverse como string en respuestas API.

Motivo: Evita perdida de precision en JavaScript y es consistente con serializacion segura de valores grandes.

Impacto: Backend/API debe documentarlo y Web Dev debe tratar ids como strings opacos. QA no debe marcarlo como P1 mientras el contrato lo acepte.

## 2026-06-06 - Operacion SQL para piloto controlado

Decision: Para el piloto controlado, no se cambiara firewall SQL ni SKU/compute antes de una ventana separada de prueba. Se mantendra Azure SQL serverless y la regla existente `AllowAllWindowsAzureIps` por ahora, con runbook de calentamiento/verificacion antes de sesiones de uso real.

Motivo: TASK-081 aprobo la regresion MVP sin P0/P1 y TASK-078 no encontro problemas de integridad. Cambiar firewall o compute justo antes del piloto podria romper la API o subir costo sin una ventana de validacion dedicada.

Impacto: Infra / Azure debe preparar un runbook operativo de calentamiento. Si el piloto requiere mayor postura de seguridad o menor latencia inicial, se abrira tarea separada para allowlist de IPs outbound de Function App, ajuste de auto-pause o cambio temporal a provisioned.

Riesgo aceptado: `AllowAllWindowsAzureIps` mantiene una superficie de red amplia y SQL serverless puede tener latencia de reanudacion. Se acepta temporalmente para piloto pequeno/controlado, con monitoreo y runbook.

## 2026-06-07 - Siguiente fase sera configuracion de empresa piloto

Decision: La siguiente fase de Punto Club sera Opcion A: configuracion de empresa piloto. Se preparara el camino hacia multiempresa controlado, pero no se implementara todavia Opcion B ni Opcion C.

Motivo: El flujo operativo principal ya esta aprobado, incluyendo caja, historial, reporte y auditoria. Configuracion de empresa aporta valor operativo inmediato con bajo riesgo, sin introducir auth, registro publico, invitaciones o aislamiento multiempresa completo antes de validar mas uso real.

Impacto: Product / Architect / Release libera primero tareas para revisar modelo SQL y luego API/UI/QA de configuracion. El sistema sigue usando `PILOT_COMPANY_ID` como fuente confiable de empresa. El frontend no puede elegir empresa operativa.

Riesgo aceptado: El producto sigue sin multiempresa real/autoservicio. Esa decision se revisara despues de validar configuracion de empresa en TASK-111.

## 2026-06-07 - Multiempresa controlado queda diferido

Decision: Despues de aprobar configuracion de empresa piloto en TASK-110, Punto Club no avanzara todavia a Opcion B: multiempresa controlado. Se mantiene empresa piloto unica con `PILOT_COMPANY_ID` como fuente confiable server-side.

Motivo: La configuracion editable ya aporta el valor operativo inmediato. Multiempresa controlado requiere resolver aislamiento con dos empresas, fuente confiable de empresa activa, acceso/auth por empresa y una matriz QA mas amplia. Sin segunda empresa real o decision comercial explicita, activar esa fase ahora agregaria complejidad antes de tiempo.

Impacto: No se crean tareas nuevas de multiempresa en este momento. La siguiente operacion recomendada es ejecutar uso real/piloto con empresa unica y configuracion aprobada. Opcion B se reabre cuando exista segunda empresa real lista para prueba, o Product decida que ampliar empresas es el siguiente objetivo.

Riesgo aceptado: El producto sigue limitado a una empresa operativa. Se acepta para proteger foco del piloto y evitar un cambio de seguridad/acceso sin necesidad confirmada.

## 2026-06-07 - Reabrir registro multiempresa con invitaciones como fase de diseno

Decision: Se reabre el camino a multiempresa por decision explicita del Product Owner, empezando por una fase de diseno/arquitectura para menu lateral, registro de empresa, invitacion por correo, creacion de password/acceso, logo upload y notificacion interna a `pj13eros_business@outlook.com`.

Motivo: El Product Owner pidio que la aplicacion tenga secciones `Operaciones`, `Mi empresa` y `Reportes`, y que una empresa pueda registrarse, recibir invite, crear password con su correo como usuario y entrar a su panel.

Impacto: La decision de TASK-111 queda superada parcialmente. No se implementa todavia registro multiempresa real. Primero se liberan tareas de Round 1 para UX, Infra y SQL; luego Backend/API define contratos y Web reorganiza UI; finalmente Product / Architect / Release decide arquitectura antes de implementar email/auth/logo/multiempresa.

Riesgo aceptado: Este cambio introduce seguridad, correo transaccional, manejo de password y storage de imagenes. Se controla el riesgo bloqueando implementacion hasta cerrar decisiones de auth, proveedor de email, almacenamiento de logos, modelo SQL y contratos API.

## 2026-06-07 - Arquitectura objetivo para multiempresa controlado

Decision: Punto Club avanzara a multiempresa controlado, no a SaaS multiempresa completo todavia. La arquitectura objetivo sera Azure Communication Services Email para invitaciones/notificaciones, Microsoft Entra External ID para acceso/password y Azure Blob Storage privado para logos.

Motivo: Los handoffs de UX, Infra, SQL y Backend/API muestran que el registro de empresas agrega valor, pero tambien introduce seguridad, correo, identidad, storage y aislamiento de datos. El enfoque controlado permite avanzar sin abrir operacion automatica a empresas no aprobadas.

Impacto: Se liberan tareas para preparar Infra y SQL. La implementacion real de endpoints, auth, invitaciones, upload y operacion multiempresa queda bloqueada hasta aprobar recursos Azure, revisar migracion SQL y mantener validacion QA del flujo operativo actual.

Riesgo aceptado: Durante la transicion, la empresa piloto sigue operando con `PILOT_COMPANY_ID`. Las empresas nuevas podran modelarse como solicitudes/invitaciones, pero no deben operar datos hasta que el `companyId` efectivo salga de auth server-side y mapeo SQL.

Riesgo no aceptado: Auth local con passwords propios, public blob access para logos, tokens de invitacion en texto plano o `companyId` confiado desde frontend.

## 2026-06-07 - Copy y contrato ajustado para registro de empresas

Decision: El flujo de registro de empresa usara copy operativo y controlado. El CTA principal sera `Crear acceso`. El contrato final debe requerir direccion de empresa (`companyAddress`), usar logo privado por blob/API, no aceptar password local y derivar identidad desde JWT de Entra External ID.

Motivo: TASK-122 confirmo que la migracion SQL agrega `company_address` obligatorio, logo privado y `CompanyUsers` basado solo en Entra External ID. TASK-123 definio mensajes para solicitud, invitacion, expiracion, acceso creado y notificacion interna sin exponer detalles tecnicos.

Impacto: Backend/API debe actualizar contratos antes de implementar. Web Dev y Backend/API deben usar el copy aprobado como base. La implementacion productiva sigue bloqueada hasta aprobar recursos Azure y aplicar la migracion.

Riesgo aceptado: Se puede preparar base de validadores/formatters/adapters con mocks antes de recursos reales. No se acepta exponer registro/invitacion productivo sin ACS Email, Entra External ID, storage privado y QA de aislamiento.
