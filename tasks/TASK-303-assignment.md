# TASK-303 - Aplicar copy de correos server-side

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 43
Depende de: TASK-302
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Actualizar los textos y formato de los correos generados server-side para que queden claros, consistentes y seguros.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-302-HANDOFF.md`

## Alcance

Identificar correos generados por Backend/API y aplicar el copy aprobado en TASK-302 para:

- solicitud recibida por empresa;
- notificacion interna de nueva solicitud;
- invitacion a empresa aprobada;
- reenvio de invitacion;
- acceso creado, si existe server-side;
- correos de membresia solo si ya existen implementados.

Validar que cada correo tenga:

- asunto claro;
- saludo;
- contexto breve;
- accion principal;
- cierre profesional;
- nota de seguridad cuando incluya invitacion;
- no exposicion de tokens ni secretos en logs/handoffs.

## Criterios de aceptacion

- Correos server-side usan copy consistente de TASK-302.
- No se cambian contratos publicos salvo necesidad documentada.
- No se registran tokens completos en logs ni handoffs.
- Tests backend pasan o se documenta por que no se pudieron ejecutar.

## Handoff esperado

Crear o actualizar `tasks/TASK-303-HANDOFF.md` con:

- Resultado.
- Correos tocados.
- Archivos tocados.
- Tests ejecutados.
- Riesgos o notas para QA.
