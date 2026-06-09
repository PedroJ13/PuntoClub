# TASK-189 - Implementar rate limiting auth propia en Backend API

Equipo responsable: Backend API

## Contexto

TASK-182 recomendo rate limiting/lockout persistente en SQL para:

- `POST /api/company-auth/login`;
- `POST /api/company-invitations/accept`.

TASK-187 debe preparar soporte SQL y TASK-188 debe confirmar si el limite por IP es confiable en Azure Functions.

## Objetivo

Implementar rate limiting/lockout minimo para auth propia, sin revelar existencia de cuentas ni exponer secretos.

## Alcance

- Depende de TASK-187.
- Usar TASK-188 para decidir si se habilita limite por IP o si queda degradado temporalmente.
- Implementar helpers/repository para:
  - consultar bloqueo vigente;
  - registrar fallo;
  - limpiar fallos en exito;
  - evaluar ventana y bloqueo.
- Login:
  - limitar por email normalizado hasheado;
  - si IP confiable esta disponible, limitar tambien por IP hasheada;
  - mantener mensaje generico de credenciales invalidas;
  - devolver `429 TOO_MANY_ATTEMPTS` cuando aplique.
- Accept invitacion:
  - limitar por token/invitacion hasheada;
  - si IP confiable esta disponible, limitar tambien por IP hasheada;
  - no registrar token raw ni password.
- Actualizar `docs/API_CONTRACTS.md` si cambia contrato de error.
- Agregar tests de ventanas, bloqueo, reset en exito y no exposicion de datos sensibles.

## Entregable

Crear o actualizar `tasks/TASK-189-HANDOFF.md` con:

- Resultado.
- Reglas implementadas.
- Si IP limit quedo activo o diferido.
- Archivos modificados.
- Pruebas ejecutadas.
- Riesgos o pendientes.
