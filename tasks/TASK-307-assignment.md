# TASK-307 - Sincronizar publicacion Web de UX/copy/iconos

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 45
Depende de: TASK-304, TASK-305, TASK-306
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Corregir la brecha detectada por QA: la Web publicada no refleja completamente los cambios de `TASK-304` y `TASK-305` de copy, iconos y polish visual.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-304-HANDOFF.md`
- `tasks/TASK-305-HANDOFF.md`
- `tasks/TASK-306-HANDOFF.md`

## Alcance

1. Revisar lo publicado contra el estado local/final esperado.
2. Asegurar que la Web publicada refleje los cambios de copy e iconos:
   - `Password` -> `Contrasena` o `Contraseña` segun charset usado;
   - `Confirmar password` -> `Confirmar contrasena` / `Confirmar contraseña`;
   - `Entrar` -> `Iniciar sesion`;
   - `Confirmar compra` -> `Registrar compra`;
   - `Confirmar canje` -> `Redimir puntos`;
   - `Confirmar uso` -> `Aplicar beneficio`;
   - mensajes `Busque...` -> `Busca...` donde aplique;
   - remover/ocultar/alinear `Mock local` y `API real` para experiencia publicada;
   - incluir iconos funcionales en acciones principales, por ejemplo via `data-icon` u otra solucion equivalente documentada.
3. Confirmar deploy a Azure Static Web Apps.
4. Validar assets publicados con cache buster.

## Criterios de aceptacion

- Assets publicados contienen los cambios finales de copy/iconos.
- No quedan labels legacy visibles en flujos principales.
- No aparece `Mock local` como texto visible en experiencia publicada.
- Acciones principales tienen icono + texto o solucion equivalente documentada.
- No se reintroduce `window.confirm`, `localStorage` ni `sessionStorage`.
- No se cambia logica de negocio salvo ajuste menor necesario para UI.

## Handoff esperado

Crear o actualizar `tasks/TASK-307-HANDOFF.md` con:

- Resultado.
- Si era problema de deploy o de cambios faltantes.
- Archivos tocados.
- Evidencia de assets publicados.
- Checks ejecutados.
- Riesgos o notas para QA.
