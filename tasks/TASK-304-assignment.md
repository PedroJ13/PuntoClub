# TASK-304 - Aplicar copy UI, estados vacios y errores accionables

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 43
Depende de: TASK-302
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Aplicar en la Web el glosario y copy final definidos por Copy / Gramatica para mejorar claridad en pantallas, botones, estados vacios y errores.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `tasks/TASK-302-HANDOFF.md`

## Alcance

Aplicar textos claros y consistentes en:

- Registro de empresa.
- Invitacion y crear acceso.
- Login/logout.
- Atender cliente.
- Puntos.
- Membresias y beneficios.
- Mi empresa.
- Reportes.
- Admin empresas si aparece en pagina interna.

Priorizar:

- labels y placeholders;
- botones principales;
- mensajes de exito;
- mensajes de error;
- estados vacios;
- confirmaciones dentro de la app;
- nombres consistentes de puntos/membresias/beneficios.

## Criterios de aceptacion

- No quedan errores obvios de ortografia en flujos principales.
- Estados vacios explican el siguiente paso.
- Errores son accionables.
- No se cambia logica de negocio.
- No se usa `window.confirm`, `localStorage` ni `sessionStorage`.
- Mantener `Atender cliente` como nombre principal del flujo operativo.

## Handoff esperado

Crear o actualizar `tasks/TASK-304-HANDOFF.md` con:

- Resultado.
- Textos/pantallas tocadas.
- Archivos tocados.
- Evidencia local/publicada si aplica.
- Riesgos o notas para QA.
