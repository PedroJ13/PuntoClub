# TASK-234 - Separar Admin empresas en pagina propia

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

Product Owner quiere que `Admin empresas` tambien se comporte como pagina separada, similar a `/company-registration`, y no como una seccion mezclada dentro de la app operativa.

Actualmente se accede desde `/` usando el menu lateral `Admin empresas`.

## Objetivo

Crear una ruta/pagina separada para administracion de empresas, manteniendo la seguridad temporal por token interno.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-227-HANDOFF.md`, `tasks/TASK-231-HANDOFF.md`, `tasks/TASK-232-HANDOFF.md` y `tasks/TASK-233-HANDOFF.md`.
- Definir y habilitar una ruta limpia para admin, recomendada:

```text
/admin-companies
```

- Al abrir `/admin-companies`, mostrar solo:
  - encabezado publico/app;
  - panel de acceso interno por token;
  - solicitudes de empresa;
  - drawer/modal relacionados con admin.
- Ocultar por completo:
  - Operaciones;
  - Mi empresa;
  - Reportes;
  - registro publico de empresa;
  - paneles operativos no relacionados.
- El menu lateral puede no mostrarse en esta pagina o mostrarse solo si no confunde; priorizar pagina admin aislada.
- Mantener el acceso desde el menu `Admin empresas` si existe, pero debe navegar a `/admin-companies`.
- Mantener token solo en memoria de la pestana, sin `localStorage` ni `sessionStorage`.
- No exponer token interno, links de invitacion, cookies, passwords ni hashes.
- No romper `/`, `/login`, `/company-registration` ni `/company-invitations/accept`.

## Criterios de aceptacion

- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/admin-companies` abre Admin empresas como pagina propia.
- Al hacer scroll no aparecen secciones operativas ni registro de empresa.
- Desde el menu `Admin empresas`, si existe, se llega a `/admin-companies`.
- El token interno sigue funcionando solo en memoria.
- El panel de token colapsa cuando el acceso interno queda activo.
- Aprobar desde resumen/detalle y modal in-app siguen disponibles.

## Entregable

Crear o actualizar `tasks/TASK-234-HANDOFF.md` con:

- Resultado.
- Ruta implementada.
- Cambios realizados.
- Rutas verificadas.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA/PO Test.
