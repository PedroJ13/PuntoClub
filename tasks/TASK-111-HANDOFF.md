# TASK-111 HANDOFF - Product / Architect / Release

## Resultado

Completado.

## Decision

No avanzar todavia a Opcion B: multiempresa controlado.

Mantener Punto Club en Opcion A aprobada: empresa piloto unica con configuracion editable, usando `PILOT_COMPANY_ID` como fuente confiable server-side.

## Motivo

La configuracion de empresa piloto ya quedo publicada y aprobada por QA en TASK-110. Esto resuelve el valor operativo inmediato:

- la empresa puede editar datos basicos;
- puede cambiar porcentaje de puntos;
- los cambios afectan compras futuras;
- historicos no se recalculan;
- cambios quedan auditados;
- Caja, Reporte y Auditoria siguen operativos.

Entrar ahora a multiempresa controlado agregaria complejidad en aislamiento, seleccion/identificacion de empresa activa, acceso/auth temporal y QA con dos empresas, antes de tener evidencia suficiente de una segunda empresa real o una necesidad operativa concreta.

## Riesgos revisados para multiempresa

### Aislamiento de datos

El modelo ya usa `company_id` en las entidades principales y los endpoints incluyen `companyId`, pero la garantia actual sigue atada a `PILOT_COMPANY_ID`. Para multiempresa real haria falta validar aislamiento con al menos dos empresas y datos cruzados.

### Fuente confiable de `companyId`

Hoy la fuente confiable es configuracion server-side. Permitir que frontend elija empresa seria inseguro sin auth/autorizacion server-side. No se debe implementar selector de empresa operativo como autoridad.

### Auth/acceso temporal

No hay login por empresa ni roles. Multiempresa controlado requeriria decidir mecanismo minimo de acceso antes de permitir que usuarios de empresas distintas operen.

### QA de dos empresas

QA necesitaria matriz nueva: clientes, compras, redenciones, reporte, auditoria y configuracion por dos empresas, incluyendo pruebas negativas de no mezclar datos.

## Siguiente fase recomendada

Ejecutar uso real/piloto con empresa unica y configuracion aprobada.

Antes de multiempresa, esperar una de estas senales:

- hay segunda empresa real lista para probar;
- el piloto confirma necesidad de operar dos empresas;
- se define mecanismo minimo de acceso/auth por empresa;
- Product decide que el siguiente objetivo es ampliar uso, no solo endurecer piloto.

## Tareas propuestas

No se crean tareas nuevas en este momento.

Cuando Product decida entrar a Opcion B, las primeras tareas sugeridas serian:

- SQL DEV: validar aislamiento multiempresa con dos empresas y constraints.
- Backend API: proponer fuente confiable de empresa activa sin confiar en frontend.
- Infra / Azure: evaluar mecanismo minimo de acceso por empresa.
- QA: preparar matriz de aislamiento con dos empresas.

## Estado de release

Configuracion de empresa piloto queda cerrada como funcionalidad publicada aprobada.

## Pendientes

- Mantener multiempresa controlado como siguiente opcion, no como fase activa.
- Usar datos de piloto real para decidir si se activa Opcion B.
