# TASK-239 - Corregir Mi empresa autenticada y ocultar Admin empresas del menu

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

Product Owner encontro dos problemas despues de login de empresa:

1. En `Mi empresa` se muestra el formulario publico de `Registrar empresa`.
2. El menu de empresa muestra `Admin empresas`, pero ese acceso debe ser interno y estar separado en `/admin-companies`.

TASK-238 define el comportamiento UX esperado.

## Objetivo

Ajustar la Web para que una empresa autenticada vea su panel de empresa, no el registro publico, y no vea accesos internos de administracion.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-238-HANDOFF.md`, `tasks/TASK-110-HANDOFF.md`, `tasks/TASK-200-HANDOFF.md`, `tasks/TASK-233-HANDOFF.md` y `tasks/TASK-234-HANDOFF.md`.
- En sesion autenticada:
  - `Mi empresa` debe mostrar datos/configuracion de la empresa activa;
  - debe permitir editar lo ya soportado por API;
  - debe mostrar logo/fallback si aplica;
  - no debe mostrar formulario publico de `Registrar empresa`.
- En menu de empresa autenticada:
  - ocultar `Admin empresas`.
  - mantener `Operaciones`, `Mi empresa`, `Reportes`.
- Mantener `/admin-companies` accesible por URL directa para uso interno.
- Mantener `/company-registration` accesible como pagina publica aislada.
- No romper `/login`, `/`, `/company-invitations/accept`.
- No usar `localStorage` ni `sessionStorage` para token interno.
- No exponer tokens, passwords, cookies, hashes ni links tokenizados.

## Criterios de aceptacion

- Login empresa -> menu no muestra `Admin empresas`.
- Login empresa -> `Mi empresa` muestra datos/configuracion de la empresa activa, no registro publico.
- `/company-registration` sigue mostrando registro publico aislado.
- `/admin-companies` sigue mostrando admin interno aislado.
- Operaciones y Reportes siguen navegables.

## Entregable

Crear o actualizar `tasks/TASK-239-HANDOFF.md` con:

- Resultado.
- Cambios realizados.
- Rutas verificadas.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA/PO Test.
