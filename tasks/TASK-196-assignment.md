# TASK-196 - Validar logo de empresa publicado

Equipo responsable: QA

## Contexto

TASK-193 confirma storage privado. TASK-194 implementa API de logo. TASK-195 conecta la UI de `Mi empresa`.

Esta tarea debe ejecutarse cuando API/Web esten publicados.

## Objetivo

Validar en ambiente publicado que una empresa autenticada puede cargar y ver su logo sin exponer storage publico ni secretos.

## Alcance

- Revisar handoffs TASK-193, TASK-194 y TASK-195.
- Validar con sesion real/evidencia PO redaccionada si QA no debe manejar credenciales.
- Probar:
  - logo valido PNG/JPG/WebP;
  - archivo no permitido;
  - archivo sobre limite si es viable;
  - refresh de pagina mantiene logo;
  - logout/login conserva logo visible para la empresa.
- Confirmar que no se expone:
  - SAS;
  - connection string;
  - blob publico no aprobado;
  - password/cookie/token.
- Revisar regresion basica de `Mi empresa`, operaciones y auth.

## Entregable

Crear o actualizar `tasks/TASK-196-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
