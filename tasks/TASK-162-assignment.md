# TASK-162 - Validar auth propia publicada de empresa

Equipo responsable: QA

## Dependencias

Esperar:

- `tasks/TASK-159-HANDOFF.md`.
- `tasks/TASK-160-HANDOFF.md`.
- `tasks/TASK-161-HANDOFF.md`.
- Deploy publicado si hubo cambios de Backend/API o Web.

## Objetivo

Validar el flujo publicado de auth propia MVP:

1. Invitacion valida.
2. Crear password/acceso.
3. Login recurrente.
4. Sesion activa.
5. Panel empresa carga con empresa correcta.
6. Logout.
7. Sesion expirada/invalida maneja error controlado.
8. Frontend no manda `companyId` como autoridad en endpoints privados nuevos.

## Checks minimos

- No se aceptan passwords debiles si Backend definio politica minima.
- No se expone password, password hash, cookie, token de sesion ni token de invitacion en UI/logs/handoff.
- El link de invitacion aceptado no puede reutilizarse para crear otro usuario.
- Login incorrecto responde controlado.
- `/api/me` o equivalente deriva empresa desde sesion.
- Regresion rapida: Operaciones, Mi empresa y Reportes siguen accesibles segun estado esperado.

## Entregable

Crear o actualizar `tasks/TASK-162-HANDOFF.md` con:

- Resultado: aprobado / no aprobado / bloqueado.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Riesgos.
- Confirmacion de seguridad sin secretos.
