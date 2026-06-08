# TASK-135 - Guiar configuracion manual de Entra External ID

## Equipo

Infra / Azure

## Prioridad

P1

## Contexto

TASK-130 confirmo que la sesion actual esta en `Default Directory` y que no conviene crear apps alli sin confirmar external tenant. Entra External ID queda pendiente/manual.

## Objetivo

Preparar una guia paso a paso para que el Product Owner cree o seleccione el external tenant correcto y entregue los valores necesarios a Backend/Web.

## Alcance

- Crear `tasks/TASK-135-HANDOFF.md` con pasos claros, uno por uno, para:
  - crear/seleccionar external tenant;
  - crear `puntoclub-web`;
  - crear `puntoclub-api`;
  - crear user flow sign-up/sign-in email/password;
  - configurar redirects;
  - obtener issuer/JWKS/client ids/audience;
  - validar `.well-known/openid-configuration`.
- Indicar que no debe usarse `Default Directory` salvo decision explicita.
- Indicar valores que el usuario debe copiar de forma segura.
- No pedir ni guardar secretos en archivos.

## Fuera de alcance

- Crear recursos si no se tiene tenant correcto.
- Implementar auth en API/Web.
- Configurar secrets.

## Entregable

Crear `tasks/TASK-135-HANDOFF.md`.

## Validacion esperada

Product Owner debe poder seguir la guia paso a paso o pasar los valores a Infra/Backend para configurar auth.
