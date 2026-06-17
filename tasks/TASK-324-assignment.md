# TASK-324 - QA/release de deploy automatico publicado

Equipo: QA
Round: 60
Depende de: TASK-323
Estado: Assigned
Prioridad: P1 release

## Objetivo

Validar que el deploy automatico por `git push` dejo publicado el frontend/API esperado y que se cerraron los bloqueos anteriores de UX/copy/iconos y smoke API.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-312-HANDOFF.md`
- `tasks/TASK-318-HANDOFF.md`
- `tasks/TASK-321-HANDOFF.md`
- `tasks/TASK-323-HANDOFF.md`

## Alcance

1. Revisar GitHub Actions desde evidencia disponible:
   - frontend SWA;
   - API Functions.
2. Validar frontend publicado:
   - no labels legacy criticos (`Password`, `Confirmar password`, `Confirmar compra`, `Confirmar canje`, `Confirmar uso`);
   - botones principales con icono + texto o equivalente;
   - no `Mock local` / `API real` visible para empresa normal.
3. Validar API publicado:
   - smoke API en workflow success;
   - `PILOT_COMPANY_ID` apunta a empresa activa;
   - no 500/404 en settings de empresa piloto.
4. Validar flujos minimos si hay sesion disponible:
   - login;
   - Atender cliente;
   - Mi empresa;
   - Reportes.
5. Clasificar hallazgos P0/P1/P2/P3.

## Criterios de aceptacion

- Workflows necesarios estan en success o queda bloqueo claro.
- Frontend publicado refleja polish UX/copy/iconos.
- API smoke publicado pasa.
- No hay P0/P1 funcional.

## Handoff esperado

Crear o actualizar `tasks/TASK-324-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones, no aprobado o bloqueado.
- Evidencia de workflows.
- Evidencia frontend/API.
- Hallazgos por severidad.
- Siguiente paso recomendado.
