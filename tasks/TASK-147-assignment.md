# TASK-147 - Validar invitacion real publicada con link seguro

Equipo responsable: QA

## Contexto

TASK-146 debe generar una invitacion real mediante aprobacion controlada.
El link real de invitacion contiene token y debe recibirse por canal seguro fuera del repo.

## Objetivo

Validar que una invitacion real abre la pantalla publicada de Punto Club y muestra estado valido sin exponer el token.

## Dependencias

- Esperar TASK-146.
- Recibir link real por canal seguro fuera del repo, o marcar bloqueado por falta de link.

## Alcance

1. Abrir el link real de invitacion en navegador.
2. Confirmar que la pagina carga `Punto Club`, no 404.
3. Confirmar que muestra estado de invitacion valida.
4. Confirmar que muestra datos no sensibles esperados:
   - empresa;
   - correo;
   - rol;
   - vencimiento.
5. Confirmar que el token completo no aparece en texto visible.
6. Confirmar que `Crear acceso` sigue deshabilitado o bloqueado de forma clara porque Entra/login no esta listo.
7. Smoke rapido de ruta normal `/` si aplica.

## Reglas

- No pegar link completo con token en el handoff.
- No pegar capturas donde se vea el token.
- No usar ni pedir `INTERNAL_ADMIN_TOKEN` en esta tarea.
- No validar login/password real.

## Entrega

Actualizar `tasks/TASK-147-HANDOFF.md` con aprobado/no aprobado, hallazgos P0/P1/P2/P3 y evidencia redaccionada.
