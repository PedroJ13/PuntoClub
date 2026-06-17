# TASK-309 - QA revalidacion UX/copy/iconos publicados

Equipo: QA
Round: 46
Depende de: TASK-307, TASK-308
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Revalidar la pasada UX/copy/iconos despues de sincronizar Web y confirmar Backend/API publicado.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-306-HANDOFF.md`
- `tasks/TASK-307-HANDOFF.md`
- `tasks/TASK-308-HANDOFF.md`

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
- Correos, si hay evidencia segura de Backend/API.

## Validaciones minimas

- No quedan labels legacy visibles: `Password`, `Confirmar password`, `Confirmar compra`, `Confirmar canje`, `Confirmar uso`.
- `Entrar` no se usa como CTA principal de login si el copy final indica `Iniciar sesion`.
- `Mock local`/`API real` no aparece como texto tecnico visible para empresa normal, o esta alineado como `Modo de prueba`/`Datos reales` si Product decide mantenerlo temporalmente.
- Botones principales tienen icono + texto o alternativa equivalente documentada.
- Terminologia consistente: puntos, membresias, beneficios, Atender cliente, Mi empresa, Reportes.
- Estados vacios y errores son accionables.
- No hay overflow horizontal ni solapes desktop/mobile.
- No aparece `Admin empresas` para empresa normal.
- No hay regresion funcional P0/P1 en flujos principales.

## Handoff esperado

Crear o actualizar `tasks/TASK-309-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia por pantalla/flujo.
- Hallazgos P0/P1/P2/P3.
- Recomendacion de cierre o siguiente round.
