# TASK-242 - Revalidar Mi empresa autenticada despues de correccion publicada

Equipo responsable: QA

## Contexto

TASK-240 no aprobo porque `Mi empresa` publicada seguia apuntando al formulario publico de registro. TASK-241 debe publicar la correccion completa.

## Objetivo

Revalidar que `Mi empresa` autenticada ya no muestra `Registrar empresa` y que el menu de empresa no muestra `Admin empresas`.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-240-HANDOFF.md` y `tasks/TASK-241-HANDOFF.md`.
- Validar en publicado:
  - bundle/HTML/CSS contiene marcadores esperados de TASK-241;
  - menu normal no muestra `Admin empresas`;
  - `Mi empresa` no apunta al formulario publico de registro;
  - `/company-registration` sigue aislado;
  - `/admin-companies` sigue aislado;
  - negativos seguros sin sesion/token siguen protegidos.
- Si hay credenciales reales/evidencia PO:
  - validar login empresa;
  - `Mi empresa` muestra configuracion de empresa activa;
  - no muestra `Registrar empresa`;
  - Operaciones y Reportes siguen navegables.

## Entregable

Crear o actualizar `tasks/TASK-242-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia revisada.
- P0/P1/P2/P3.
- Riesgos o pendientes.
