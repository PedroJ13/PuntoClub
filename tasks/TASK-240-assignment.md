# TASK-240 - Validar Mi empresa y menu autenticado

Equipo responsable: QA

## Contexto

TASK-239 debe corregir:

- `Mi empresa` autenticada mostrando registro publico por error;
- `Admin empresas` visible en menu normal de empresa.

## Objetivo

Validar publicado que el menu y la pagina `Mi empresa` funcionan correctamente para una empresa autenticada, sin romper paginas publicas separadas.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-238-HANDOFF.md` y `tasks/TASK-239-HANDOFF.md`.
- Validar en publicado:
  - login empresa o evidencia PO redaccionada;
  - menu autenticado no muestra `Admin empresas`;
  - `Mi empresa` muestra datos/configuracion de empresa activa;
  - `Mi empresa` no muestra formulario publico de `Registrar empresa`;
  - `/company-registration` sigue aislado;
  - `/admin-companies` sigue aislado;
  - Operaciones y Reportes siguen disponibles.
- Ejecutar negativos seguros sin secretos si no hay credenciales reales.

## Entregable

Crear o actualizar `tasks/TASK-240-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Riesgos o pendientes.
