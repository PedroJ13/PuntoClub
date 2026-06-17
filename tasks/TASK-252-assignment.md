# TASK-252 - Confirmar deploy Web de configuracion de membresias

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

TASK-249 no aprobo porque la Web publicada no contiene la navegacion ni paneles de `Membresias`.

TASK-248 implemento la UI localmente. TASK-251 debe confirmar API publicada.

## Objetivo

Publicar/confirmar la Web con seccion `Membresias` y metodos de `customerApi`.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-248-HANDOFF.md`, `tasks/TASK-249-HANDOFF.md` y `tasks/TASK-251-HANDOFF.md`.
- Publicar o disparar deploy Web si hace falta.
- Validar bundle publicado:
  - navegacion `Membresias`;
  - `data-section-target="memberships"`;
  - paneles/listas de planes y beneficios;
  - `listMembershipPlans`;
  - `listMembershipBenefits`;
  - llamadas a `/api/membership-plans`;
  - `loyaltyMembershipsEnabled`.
- Confirmar que `Admin empresas` sigue fuera del menu normal.
- Confirmar que no se usa `localStorage`, `sessionStorage` ni `window.confirm`.
- No romper `/`, `/login`, `/company-registration`, `/admin-companies` ni operacion de puntos.

## Entregable

Crear o actualizar `tasks/TASK-252-HANDOFF.md` con:

- Resultado.
- Commit/deploy si aplica.
- Marcadores publicados confirmados.
- Rutas verificadas.
- Riesgos o pendientes para QA.
