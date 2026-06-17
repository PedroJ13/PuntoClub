# TASK-224 - Revisar soporte de datos para logo en solicitud de empresa

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: SQL DEV / Data

## Contexto

Product Owner quiere que una empresa pueda cargar logo desde el registro/solicitud de empresa, y que ese logo quede disponible cuando la empresa sea aprobada y entre a operar.

Actualmente existe logo privado de empresa en `Mi empresa`, pero hay que confirmar si el modelo soporta logo desde solicitud inicial o si requiere migracion minima.

## Objetivo

Revisar el modelo SQL y definir/aplicar, solo si es necesario y seguro, el soporte minimo para asociar un logo subido durante la solicitud de empresa y trasladarlo a la empresa aprobada.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/DATA_MODEL.md`, `tasks/TASK-193-HANDOFF.md`, `tasks/TASK-194-HANDOFF.md`, `tasks/TASK-200-HANDOFF.md` y `tasks/TASK-223-HANDOFF.md`.
- Revisar tablas actuales de:
  - `CompanyRegistrationRequests`;
  - `Companies`;
  - almacenamiento/referencia de logo privado.
- Determinar si se requiere migracion para guardar referencia temporal del logo en solicitud.
- Si se requiere migracion:
  - preparar SQL minimo;
  - aplicar solo si hay acceso permitido y la migracion es segura;
  - validar constraints/compatibilidad.
- Si no se requiere migracion:
  - documentar como Backend/API debe usar campos existentes.
- No borrar datos.
- No imprimir secretos.

## Entregable

Crear o actualizar `tasks/TASK-224-HANDOFF.md` con:

- Resultado.
- Modelo actual revisado.
- Migracion aplicada o propuesta no aplicada.
- Campos/contrato de datos recomendado para Backend/API.
- Validacion ejecutada.
- Riesgos o pendientes.
