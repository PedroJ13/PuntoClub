# TASK-155 - Rotar invitacion expuesta y reenviar sin publicar token

Equipo responsable: Infra / Azure

## Contexto

La invitacion real `invitationId=1` fue validada visualmente en la web publicada, pero Product Owner compartio una captura donde la barra de direccion mostraba el token real. Por seguridad, ese token debe tratarse como expuesto.

## Objetivo

Rotar o reemitir la invitacion para que el token expuesto deje de ser el token vigente, sin imprimir ni registrar el token raw en archivos, handoffs, consola compartida o commits.

## Alcance

- Usar mecanismo existente de reenvio/rotacion si esta disponible.
- Preferir mailbox base confirmado `pj13eros_business@outlook.com` si el flujo permite reenviar a mailbox confirmado; si no, mantener el correo asociado y dejarlo documentado.
- No exponer token raw.
- No pegar URL completa.
- No cambiar codigo.
- No crear recursos Azure nuevos.
- No tocar Entra External ID.

## Checks requeridos

1. Leer este archivo.
2. Leer `tasks/TASK-146-HANDOFF.md`, `tasks/TASK-148-HANDOFF.md` y `tasks/TASK-150-HANDOFF.md`.
3. Rotar/reemitir la invitacion vigente de forma segura.
4. Confirmar que la operacion retorno exito sin incluir secretos.
5. Si puede validar entregabilidad sin exponer link, documentar senales agregadas seguras.
6. Si no puede rotar por falta de permiso, secreto o endpoint, dejar bloqueo claro para Product Owner.

## Entregable

Crear o actualizar `tasks/TASK-155-HANDOFF.md` con:
- Resultado.
- Accion realizada.
- Mailbox destino usado, si aplica.
- Confirmacion de que no se expuso token raw, hash ni URL completa.
- Pendientes o bloqueos.
