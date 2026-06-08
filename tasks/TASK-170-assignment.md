# TASK-170 - Ajustar Web auth propia si el fallo es CORS/cookie/UX

Equipo responsable: Web Dev

## Dependencia

Esperar `tasks/TASK-169-HANDOFF.md`.

## Contexto

Product Owner llego a pantalla de invitacion valida y formulario de Crear acceso, pero el submit mostro error generico. Backend debe diagnosticar si el fallo es API/SQL o integracion navegador.

## Objetivo

Aplicar ajuste Web solo si TASK-169 indica que el fallo requiere cambios frontend:

- CORS/credentials/cookie strategy.
- Mensaje de error mas especifico usando payload API seguro.
- Reintento o manejo de estados `INVITATION_ALREADY_ACCEPTED`, `COMPANY_USER_ALREADY_EXISTS`, `INVITATION_EXPIRED`.
- Redireccion post-acceso a login.

## Alcance

- No guardar password/token/cookie en storage.
- No mostrar token ni URL completa.
- Mantener `credentials: "include"` solo si la estrategia final lo requiere.
- Si el problema es puramente Backend/API o Infra, no modificar codigo; dejar handoff indicando no aplicable.

## Entregable

Crear o actualizar `tasks/TASK-170-HANDOFF.md` con:

- Resultado.
- Cambios realizados o no aplicable.
- Pruebas locales/publicadas ejecutadas.
- Riesgos pendientes.
