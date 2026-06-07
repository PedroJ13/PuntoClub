# Siguiente fase - Empresa, configuracion y multiempresa

## Proposito

Documento para Product / Architect / Release.

El flujo principal de caja ya esta avanzado y aprobado: clientes, busqueda, compras, puntos, redenciones, historial, reporte operativo y auditoria operativa.

Como la prueba piloto con usuario real queda pendiente, se propone avanzar en una fase que ya estaba contemplada desde el inicio: configuracion de empresa y camino hacia multiempresa.

## Lectura ejecutiva

Punto Club hoy opera como empresa piloto unica.

La arquitectura ya contempla separacion por empresa mediante `Companies`, `company_id` y rutas `/api/companies/{companyId}/...`, pero todavia no existe una experiencia completa para que varias empresas usen el sistema con datos independientes.

La siguiente fase recomendada no deberia saltar directamente a SaaS completo. Conviene construirla en capas:

1. Panel de configuracion de empresa.
2. Preparacion de aislamiento multiempresa real.
3. Login/acceso por empresa.
4. Registro/aprobacion/invitacion de empresas.
5. Admin de empresas.

## Estado actual relevante

Ya existe:

- Tabla/entidad `Companies`.
- Relacion de clientes, compras y redenciones con `company_id`.
- Contratos API con `companyId` en path.
- Decision de fase 1: empresa piloto unica con `PILOT_COMPANY_ID`.
- `GET /companies/{companyId}/settings` contemplado/implementado segun estado previo.
- Base SQL central.
- API estable en Azure Functions.
- Frontend publicado en Azure Static Web Apps.

Todavia falta:

- Pantalla completa de configuracion de empresa.
- Edicion operativa de porcentaje de puntos desde UI.
- Logo gestionado de forma clara.
- Login real por empresa.
- Separacion de acceso por usuario/empresa.
- Registro publico de empresas.
- Aprobacion administrativa.
- Invitaciones.
- Admin para activar/inactivar empresas.

## Decision principal requerida

Antes de crear tareas, Product / Architect / Release debe decidir el alcance de esta fase:

### Opcion A - Configuracion de empresa solamente

Objetivo:

- Seguir con empresa piloto unica.
- Permitir editar datos y porcentaje de puntos.
- No implementar login ni registro de empresas todavia.

Ventaja:

- Rapido, bajo riesgo.
- Mejora operacion real.
- No cambia de golpe el modelo de acceso.

Riesgo:

- Todavia no permite varias empresas reales de forma autoservicio.

### Opcion B - Multiempresa controlado

Objetivo:

- Permitir tener varias empresas creadas manualmente/admin.
- Cada empresa opera con sus propios datos.
- El acceso todavia puede ser controlado por configuracion o mecanismo simple.

Ventaja:

- Avanza hacia uso real con mas de una empresa.
- Evita construir autoservicio completo demasiado pronto.

Riesgo:

- Requiere decidir como se identifica la empresa activa.
- Requiere mas QA de aislamiento.

### Opcion C - SaaS multiempresa completo

Objetivo:

- Registro publico de empresas.
- Admin aprueba.
- Invite por correo.
- Empresa define password.
- Login real por empresa.
- Cada empresa entra a su propio panel.

Ventaja:

- Se alinea con vision completa del producto.

Riesgo:

- Mucho mas grande.
- Toca auth, email, seguridad, admin, UX y QA.
- Puede distraer antes de validar piloto real.

## Recomendacion

Empezar con Opcion A y preparar Opcion B.

No saltar todavia a Opcion C salvo que Product / Release decida que el siguiente objetivo es vender/operar con multiples empresas de inmediato.

## Flujo propuesto

### Round 1 - Panel de configuracion de empresa

Objetivo:

- La empresa piloto puede ver y ajustar su configuracion.

Incluye:

- Ver datos de empresa:
  - nombre
  - email
  - telefono
  - logo URL o logo pendiente
  - porcentaje de puntos
  - estado
- Editar porcentaje de puntos.
- Editar datos basicos.
- Validaciones:
  - porcentaje mayor que 0
  - porcentaje menor o igual a 100
  - email valido si se provee
  - telefono con longitud razonable
- Confirmacion visible al guardar.
- Auditoria de cambios si aplica.

Equipos:

- Product / Architect / Release: confirmar alcance y reglas.
- Backend/API: confirmar/ajustar PATCH settings.
- Web Dev: pantalla configuracion.
- QA: validar UI/API publicada.

### Round 2 - Preparacion multiempresa controlada

Objetivo:

- Dejar el sistema listo para operar varias empresas sin autoservicio completo.

Incluye:

- Revisar modelo `Companies`.
- Confirmar constraints por empresa.
- Confirmar que customers/purchases/redemptions/reports/audit no mezclan empresas.
- Definir mecanismo temporal para seleccionar/activar empresa en ambientes controlados.
- Decidir si `PILOT_COMPANY_ID` sigue o se reemplaza por una forma mas flexible.

Equipos:

- Product / Architect / Release: decidir estrategia.
- SQL DEV: revisar integridad multiempresa.
- Backend/API: revisar validaciones de companyId.
- QA: pruebas de aislamiento.

### Round 3 - Login/acceso por empresa

Objetivo:

- Cada empresa entra de forma separada.

Incluye:

- Decision de auth:
  - Azure Static Web Apps auth
  - proveedor externo
  - auth propia minima
- Asociar usuario/correo a empresa.
- Evitar que un usuario acceda datos de otra empresa.
- Definir roles minimos:
  - empresa
  - admin interno

Equipos:

- Product / Architect / Release: decision de auth y alcance.
- Infra / Azure: soporte de auth/secrets/config.
- Backend/API: autorizacion server-side.
- Web Dev: login/estado de sesion.
- QA: permisos y aislamiento.

### Round 4 - Registro, aprobacion e invitacion

Objetivo:

- Empresas pueden solicitar acceso y ser aprobadas.

Incluye:

- Formulario de registro de empresa.
- Admin revisa solicitud.
- Admin aprueba/rechaza.
- Se genera invitacion.
- Empresa define password o completa acceso.

Equipos:

- Product / Architect / Release: flujo y estados.
- Diseno / UX: experiencia de solicitud/aprobacion.
- Backend/API: endpoints de registro/admin/invite.
- Infra / Azure: email/secrets si aplica.
- Web Dev: pantallas publicas/admin.
- QA: flujo completo.

## Riesgos

- Hacer SaaS completo antes de validar piloto puede agrandar demasiado el MVP.
- Cambiar auth sin decision clara puede romper el acceso actual.
- Permitir seleccionar `companyId` desde frontend seria inseguro si no hay autorizacion server-side.
- Logo/upload puede meter storage, costos y seguridad; puede dejarse como URL o diferirse.
- Multiempresa exige QA serio de aislamiento de datos.

## Recomendacion para Product / Architect / Release

- Tema: Siguiente fase empresa/configuracion/multiempresa.
- Motivo: El flujo operativo principal ya esta aprobado; el siguiente valor es permitir que la empresa administre su configuracion y preparar multiempresa.
- Prioridad sugerida: P1 pre-lanzamiento si se busca operar con mas empresas pronto; P2 si se mantiene solo piloto unico.
- Equipo sugerido: Product / Architect / Release primero; luego Backend/API, Web Dev, QA, SQL DEV e Infra segun ronda.
- Documento/tarea sugerida: Usar este documento para crear una ronda inicial de tareas enfocada en panel de configuracion de empresa.
- Riesgo si no se hace: El producto queda funcional para caja, pero limitado operativamente a configuracion manual y empresa piloto unica.

## Preguntas para decidir antes de crear tareas

- La siguiente fase debe permitir solo configurar la empresa piloto o tambien operar multiples empresas?
- El porcentaje de puntos debe afectar compras futuras solamente o tambien recalcular historicos?
- El logo se manejara como URL externa, upload propio o se difiere?
- Quien puede cambiar el porcentaje de puntos?
- Necesitamos auditoria para cambios de configuracion?
- Cual es el minimo aceptable de auth para probar con una segunda empresa?
- Hay una segunda empresa real lista para probar o seguimos preparando plataforma?
