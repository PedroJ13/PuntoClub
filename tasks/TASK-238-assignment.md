# TASK-238 - Definir UX de Mi empresa autenticada y acceso admin interno

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Diseno/UX

## Contexto

Product Owner valido el flujo inicial:

- empresa se registro;
- fue aprobada;
- creo usuario/password;
- hizo login;
- entro a sesion de empresa.

Hallazgos visuales actuales:

1. Dentro de sesion, al entrar a `Mi empresa`, aparece el formulario de `Registrar empresa`. Eso no debe pasar para una empresa ya registrada. Deben aparecer los datos de la empresa y poder editarse.
2. En el menu de una empresa autenticada aparece `Admin empresas`. Ese acceso es interno y debe quedar fuera del panel normal de empresas, en una pagina privada/separada.

## Objetivo

Definir comportamiento UX esperado para:

- `Mi empresa` cuando hay sesion activa;
- visibilidad/acceso de `Admin empresas`.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-110-HANDOFF.md`, `tasks/TASK-200-HANDOFF.md`, `tasks/TASK-233-HANDOFF.md` y `tasks/TASK-234-HANDOFF.md`.
- Definir:
  - que debe mostrar `Mi empresa` autenticada;
  - que campos son editables;
  - donde se muestra/logo/fallback;
  - estados vacios/carga/error;
  - si debe haber link externo a registro publico o no;
  - que `Admin empresas` no debe aparecer en menu de empresa autenticada.
- Mantener `/admin-companies` como pagina separada para uso interno.
- Mantener `/company-registration` como pagina publica separada.

## Entregable

Crear o actualizar `tasks/TASK-238-HANDOFF.md` con:

- Decisiones UX.
- Copy recomendado.
- Estados esperados.
- Recomendaciones para Web Dev.
- Riesgos o pendientes.
