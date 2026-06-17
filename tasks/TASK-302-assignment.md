# TASK-302 - Auditoria Copy / Gramatica y glosario de producto

Equipo: Ejecucion Tecnica
Modo de ejecucion: Copy / Gramatica
Round: 42
Depende de: Ninguna
Estado: Assigned
Prioridad: P1 pre-lanzamiento

## Objetivo

Auditar y proponer copy final para textos visibles, estados vacios, errores, botones y correos de Punto Club, usando espanol claro, natural y consistente.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/NEXT_PHASE_UX_COPY_POLISH.md`
- `chat-start/PRODUCT_ARCHITECT_RELEASE.md`

## Alcance

Revisar textos en:

- Registro de empresa.
- Aprobacion/admin de empresas.
- Invitacion y crear acceso.
- Login/logout.
- Atender cliente.
- Puntos.
- Membresias y beneficios.
- Mi empresa.
- Reportes.
- Emails de solicitud, invitacion, aprobacion/reenvio y acceso.

Definir:

- glosario oficial de nombres:
  - `Atender cliente`;
  - `Puntos`;
  - `Membresias`;
  - `Beneficios`;
  - `Registrar compra`;
  - `Redimir puntos`;
  - `Activar membresia`;
  - `Renovar membresia`;
  - `Aplicar beneficio`;
  - `Mi empresa`;
  - `Reportes`;
  - `Admin empresas`;
- textos recomendados para estados vacios;
- textos de errores accionables;
- nombres de botones principales;
- asuntos y cuerpo base de correos.

## Criterios de aceptacion

- Lista textos actuales problemáticos y reemplazos propuestos.
- Corrige tildes, mayusculas, terminos mezclados y frases largas.
- Define asuntos y estructura base para correos.
- No expone tokens, secretos ni links reales con token.
- No implementa codigo.

## Handoff esperado

Crear o actualizar `tasks/TASK-302-HANDOFF.md` con:

- Resultado.
- Glosario final sugerido.
- Tabla `Texto actual` / `Texto sugerido`.
- Plantillas/copy base de correos.
- Recomendaciones para Backend/API y Web Dev.
