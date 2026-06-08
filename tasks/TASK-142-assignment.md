# TASK-142 - Validar flujo publicado solicitud aprobada e invitacion

Equipo responsable: QA

## Contexto

Esta tarea depende de TASK-140 y TASK-141 publicados.

TASK-138 aprobo la solicitud publica de empresa y confirmo endpoints internos cerrados sin token.
TASK-140 debe conectar aprobacion con invitacion owner.
TASK-141 debe crear pantalla publica de invitacion y validacion de token.

## Objetivo

Validar en ambiente publicado que una solicitud de empresa puede aprobarse de forma controlada y que la invitacion resultante se comporta correctamente sin exponer secretos.

## Dependencias

- Esperar handoff de TASK-140.
- Esperar handoff de TASK-141.
- Esperar deploy publicado de API/Web.
- Si se requiere token admin valido, pedirlo por canal seguro fuera del repo. No pegarlo en handoff.

## Alcance

1. Crear solicitud QA de empresa desde UI publicada.
2. Validar que approve sin token sigue respondiendo 403.
3. Si Product/Infra entrega token por canal seguro:
   - aprobar la solicitud QA;
   - confirmar que la respuesta incluye empresa e invitacion no sensible;
   - confirmar que no aparece token raw ni hash.
4. Validar que el email real no se documenta con secretos. Si no se puede acceder al correo QA, documentar limitacion.
5. Validar pantalla publica de invitacion:
   - token invalido;
   - sin token;
   - estado valido si se dispone de link real por correo seguro.
6. Ejecutar smoke rapido de flujo operativo existente.

## Reglas

- No pegar `INTERNAL_ADMIN_TOKEN`, tokens de invitacion, links completos con token, cookies ni capturas con secretos.
- Si no hay token admin o link real, validar solo los caminos cerrados/publicos y marcar el resto como bloqueado por credenciales.
- Clasificar hallazgos P0/P1/P2/P3.

## Entrega

Actualizar `tasks/TASK-142-HANDOFF.md`.
