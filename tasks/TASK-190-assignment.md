# TASK-190 - Validar rate limiting auth propia publicado

Equipo responsable: QA

## Contexto

TASK-189 implementara rate limiting/lockout para auth propia. Esta validacion debe ejecutarse despues de que SQL/API esten aplicados y publicados.

## Objetivo

Validar en ambiente publicado que los limites de intentos funcionan sin exponer password, token, cookie ni datos sensibles.

## Alcance

- Revisar handoffs TASK-187, TASK-188 y TASK-189.
- Validar login con credenciales invalidas controladas:
  - intentos fallidos hasta activar limite;
  - respuesta `429 TOO_MANY_ATTEMPTS` o contrato final aprobado;
  - mensaje no revela si email existe.
- Validar que login correcto de cuenta no bloqueada sigue funcionando si QA/PO provee evidencia segura; si no, dejarlo como evidencia PO requerida.
- Validar accept invitacion con token sintetico/no real:
  - no exponer token;
  - limite responde con contrato esperado cuando sea viable sin dañar invitaciones reales.
- Confirmar que no se imprimen passwords, tokens, cookies ni hashes.
- Verificar regresion basica:
  - `/api/me` sin sesion sigue `401`;
  - operacion autenticada no se rompe segun evidencia PO o smoke seguro.

## Entregable

Crear o actualizar `tasks/TASK-190-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
