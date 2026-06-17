# TASK-312 - QA final UX/copy/iconos despues de publicacion

Equipo: QA
Round: 48
Depende de: TASK-310, TASK-311
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Revalidar la pasada UX/copy/iconos despues de publicar frontend consolidado y confirmar Backend/API.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-309-HANDOFF.md`
- `tasks/TASK-310-HANDOFF.md`
- `tasks/TASK-311-HANDOFF.md`

## Alcance

Validar ambiente publicado:

- Registro de empresa.
- Admin empresas.
- Invitacion y crear acceso.
- Login/logout.
- Atender cliente.
- Puntos: compra, redencion e historial.
- Membresias y beneficios.
- Mi empresa.
- Reportes.
- Responsive desktop/mobile.
- Correos si hay evidencia segura de Backend/API.

## Validaciones minimas

- No quedan labels legacy criticos de TASK-309:
  - `Password`;
  - `Confirmar password`;
  - `Confirmar compra`;
  - `Confirmar canje`;
  - `Confirmar uso`;
  - `Mock local` / `API real` visibles para empresa normal.
- Login y acciones principales usan copy final.
- Acciones principales tienen icono + texto o alternativa equivalente documentada.
- Terminologia consistente: puntos, membresias, beneficios, Atender cliente, Mi empresa, Reportes.
- Estados vacios y errores son accionables.
- No hay overflow horizontal ni solapes desktop/mobile.
- No aparece `Admin empresas` para empresa normal.
- No hay regresion funcional P0/P1 en flujos principales.

## Handoff esperado

Crear o actualizar `tasks/TASK-312-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia por pantalla/flujo.
- Hallazgos P0/P1/P2/P3.
- Recomendacion de cierre o siguiente round.
