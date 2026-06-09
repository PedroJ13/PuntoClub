# TASK-185 - PO Test valida operacion con sesion de empresa

Equipo responsable: PO Test

## Contexto

QA no puede completar la validacion E2E autenticada sin una sesion real o evidencia del Product Owner, porque no debe recibir ni pegar password/cookies/tokens.

Despues de que TASK-183 y TASK-184 confirmen API/Web publicados, Product Owner debe validar la operacion usando su acceso real ya creado.

## Objetivo

Validar desde navegador publicado que una empresa autenticada puede operar el flujo principal usando su sesion.

## Alcance

Con sesion iniciada en la Web publicada:

- Confirmar que se ve la empresa/correo correcto.
- Buscar o registrar un cliente de prueba.
- Registrar una compra.
- Redimir puntos si hay balance suficiente.
- Ver historial/resumen del cliente.
- Consultar reporte.
- Consultar auditoria si esta disponible.
- Cerrar sesion y confirmar estado `Sesion no iniciada`.

## Seguridad

- No compartir password.
- No mostrar cookies.
- No mostrar tokens.
- No mostrar URL con token de invitacion.
- Si se comparten capturas, recortar barra de direccion y cualquier dato sensible.

## Entregable

Crear o actualizar `tasks/TASK-185-HANDOFF.md` con:

- Resultado.
- Flujos probados.
- Empresa/correo visible, sin password/cookie/token.
- Si hubo errores, mensaje exacto visible.
- Evidencia redaccionada suficiente para QA.
