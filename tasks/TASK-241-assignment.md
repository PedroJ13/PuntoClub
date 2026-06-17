# TASK-241 - Publicar correccion completa de Mi empresa autenticada

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

TASK-240 no aprobo porque la publicacion corrigio parcialmente TASK-239:

- `Admin empresas` ya esta oculto del menu normal.
- `/company-registration` y `/admin-companies` siguen aisladas.

Pero el bundle publicado todavia muestra indicios de que `Mi empresa` apunta al formulario publico de registro:

- publicado sigue con `company: elements.registrationCompanyNameInput`;
- falta CSS publicado para ocultar `.company-registration-panel` fuera de `/company-registration`;
- no aparecen copy/fallback esperados de TASK-239.

## Objetivo

Corregir y confirmar publicacion completa de `Mi empresa` autenticada:

- mostrar configuracion/datos de empresa activa;
- no mostrar formulario publico `Registrar empresa`;
- conservar menu sin `Admin empresas`.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-238-HANDOFF.md`, `tasks/TASK-239-HANDOFF.md` y `tasks/TASK-240-HANDOFF.md`.
- Revisar cambios locales vs publicado.
- Asegurar en codigo y bundle publicado:
  - la seccion `company` enfoca/usa configuracion de empresa activa, no `registrationCompanyNameInput`;
  - existe regla CSS que oculta `.company-registration-panel` fuera de `public-registration-mode`;
  - `Datos de empresa actualizados.` esta en bundle;
  - fallback `Sin logo cargado` esta en bundle;
  - `Admin empresas` sigue oculto del menu normal;
  - `/company-registration` sigue aislado;
  - `/admin-companies` sigue aislado.
- Publicar o disparar deploy si hace falta.
- No romper `/`, `/login`, `/company-registration`, `/admin-companies` ni `/company-invitations/accept`.
- No usar `localStorage` ni `sessionStorage`.
- No exponer tokens, passwords, cookies, hashes ni links tokenizados.

## Criterios de aceptacion

- Bundle publicado contiene `company: elements.companyNameInput` o equivalente claro que no use `registrationCompanyNameInput` para la seccion `Mi empresa`.
- CSS publicado contiene regla para ocultar `company-registration-panel` fuera de `public-registration-mode`.
- Menu normal no muestra `Admin empresas`.
- `/company-registration` y `/admin-companies` siguen funcionando.

## Entregable

Crear o actualizar `tasks/TASK-241-HANDOFF.md` con:

- Resultado.
- Cambios realizados.
- Commit/deploy si aplica.
- Marcadores publicados confirmados.
- Rutas verificadas.
- Riesgos o pendientes para QA.
