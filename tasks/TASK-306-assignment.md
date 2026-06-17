# TASK-306 - QA UX, copy, correos e iconos publicados

Equipo: QA
Round: 44
Depende de: TASK-303, TASK-304, TASK-305
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Validar la pasada fuerte de UX, Copy / Gramatica, correos, iconos y visual polish en ambiente publicado.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-301-HANDOFF.md`
- `tasks/TASK-302-HANDOFF.md`
- `tasks/TASK-303-HANDOFF.md`
- `tasks/TASK-304-HANDOFF.md`
- `tasks/TASK-305-HANDOFF.md`

## Alcance

Validar en Web publicada:

- Registro de empresa.
- Admin empresas.
- Invitacion y crear acceso.
- Login/logout.
- Atender cliente.
- Puntos.
- Membresias y beneficios.
- Mi empresa.
- Reportes.
- Responsive desktop/mobile.

Validar correos si hay forma segura de generar o revisar evidencia:

- solicitud recibida;
- notificacion interna;
- invitacion;
- reenvio.

## Validaciones minimas

- No hay errores obvios de ortografia en flujos principales.
- Terminos son consistentes: puntos, membresias, beneficios, Atender cliente, Mi empresa, Reportes.
- Estados vacios indican el siguiente paso.
- Errores son accionables.
- Botones principales tienen icono + texto donde corresponde.
- Contraste y responsive sin solapes ni overflow horizontal.
- No aparece `Admin empresas` para empresa normal.
- No se exponen tokens/secretos.
- No hay regresion P0/P1 funcional en flujos principales.

## Handoff esperado

Crear o actualizar `tasks/TASK-306-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia por pantalla/flujo.
- Hallazgos P0/P1/P2/P3.
- Recomendacion de cierre o siguiente round.
