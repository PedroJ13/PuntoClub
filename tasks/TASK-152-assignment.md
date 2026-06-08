# TASK-152 - Validar invitacion real desde mailbox con evidencia redaccionada

Equipo responsable: PO Test

## Contexto

TASK-150 confirmo que ACS registro envio y delivery agregado exitoso.
TASK-151 no pudo aprobar porque QA no recibio el link real por canal seguro.

El link real contiene un token y no debe copiarse en handoffs, capturas visibles, chats ni documentos.

## Objetivo

Abrir el ultimo correo de invitacion recibido en el mailbox real, usar el link vigente y documentar evidencia redaccionada del estado final de la pantalla.

## Alcance

1. Revisar el mailbox:
   - `pj13eros_business+task146-20260608092947@outlook.com`
   - Si no aparece, revisar el mailbox base asociado.
2. Usar el ultimo correo de invitacion de Punto Club, porque los reenvios rotan el token.
3. Abrir el CTA/link `Crear acceso`.
4. Esperar a que la pantalla deje de mostrar `Validando invitacion...`.
5. Documentar si el resultado final es:
   - invitacion valida;
   - invitacion no disponible;
   - invitacion expirada;
   - error de servicio;
   - se queda cargando indefinidamente.
6. Si se comparte captura, recortar/ocultar la barra de direccion completa para que no se vea el token.
7. Confirmar si se ve:
   - empresa;
   - correo;
   - rol;
   - vencimiento;
   - boton `Crear acceso` deshabilitado o bloqueado por login pendiente.

## Reglas de seguridad

- No pegar el link completo.
- No pegar el token.
- No mostrar barra de direccion con token.
- No compartir capturas con token visible.
- No intentar login/password real.

## Entrega

Actualizar `tasks/TASK-152-HANDOFF.md` con evidencia redaccionada y resultado.
