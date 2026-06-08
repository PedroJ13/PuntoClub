# TASK-160 - Implementar Backend auth propia MVP de empresas

Equipo responsable: Backend API

## Dependencia

Esperar `tasks/TASK-159-HANDOFF.md`.

## Contexto

Punto Club ya tiene registro de empresa, aprobacion, invitaciones con token hash y pantalla publica de invitacion. Entra External ID queda pausado para piloto. El acceso se hara con password propio MVP y sesion server-side.

## Objetivo

Implementar el flujo Backend/API minimo:

- aceptar invitacion con token + password;
- crear usuario owner con password hash;
- marcar invitacion como aceptada;
- activar empresa si corresponde;
- login con email + password;
- crear sesion server-side;
- logout;
- `GET /api/me` resolviendo empresa desde sesion;
- endpoints privados futuros deben derivar companyId desde sesion, no desde frontend.

## Alcance

- Leer `docs/DECISION_LOG.md`, `docs/API_CONTRACTS.md`, `docs/DATA_MODEL.md`.
- Leer `tasks/TASK-159-HANDOFF.md`.
- Usar algoritmo de hash fuerte disponible en runtime Node, con salt y comparacion segura.
- Cookie de sesion: `HttpOnly`, `Secure` en prod, `SameSite=Lax`, expiracion definida.
- No guardar password plano, token raw de sesion, token raw de invitacion ni cookies en logs.
- Mantener endpoints internos con `INTERNAL_ADMIN_TOKEN` como mecanismo temporal separado.

## Entregable

Crear o actualizar `tasks/TASK-160-HANDOFF.md` con:

- Resultado.
- Cambios realizados.
- Endpoints implementados.
- Variables/configuracion requeridas.
- Pruebas ejecutadas.
- Riesgos o pendientes.
