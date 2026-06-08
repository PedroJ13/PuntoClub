# TASK-161 - Activar Web Crear acceso/login con auth propia MVP

Equipo responsable: Web Dev

## Dependencia

Esperar `tasks/TASK-160-HANDOFF.md` y que Backend/API haya entregado contrato usable.

## Contexto

La pantalla publica de invitacion ya valida token y muestra `Crear acceso`, pero el CTA esta deshabilitado porque antes dependia de Entra. La nueva direccion usa password propio MVP y sesion server-side.

## Objetivo

Actualizar Web para permitir:

- abrir link de invitacion valido;
- ingresar password y confirmacion;
- activar acceso de empresa;
- login recurrente con email/password;
- mantener sesion mediante cookie HttpOnly enviada por Backend;
- cargar panel de empresa usando `/api/me` o contrato equivalente;
- no mandar `companyId` como autoridad para endpoints privados.

## Alcance

- No guardar password en localStorage/sessionStorage.
- No mostrar token de invitacion.
- No loggear password, token, cookie ni URL completa con token.
- Manejar estados: password invalido, invitacion expirada, invitacion aceptada, login incorrecto, sesion expirada, logout.
- Mantener Operaciones/Mi empresa/Reportes funcionales para piloto.

## Entregable

Crear o actualizar `tasks/TASK-161-HANDOFF.md` con:

- Resultado.
- Cambios realizados.
- Pantallas/rutas afectadas.
- Pruebas locales/publicadas ejecutadas.
- Riesgos o pendientes.
