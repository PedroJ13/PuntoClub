# TASK-090 - Ejecutar y documentar sesion piloto controlada

## Equipo

PO Test

## Contexto

El ambiente esta listo para ejecutar la primera sesion piloto controlada:

- Guion preparado en `tasks/TASK-086-HANDOFF.md`.
- Smoke pre-sesion aprobado en `tasks/TASK-087-HANDOFF.md`.
- Runbook operativo en `docs/PILOT_RUNBOOK.md`.
- Backlog post-piloto preparado en `docs/POST_PILOT_BACKLOG.md`.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Ejecutar la sesion piloto controlada y documentar hallazgos reales del operador/empresa.

Prioridad de esta etapa:

- validar operacion real;
- confirmar que el flujo funciona de punta a punta;
- capturar bloqueos o fricciones operativas.

Los cambios de UX, colores, estilo visual o pulido quedan para despues, salvo que impidan completar una operacion real.

## Alcance

- Ejecutar calentamiento con `docs/PILOT_RUNBOOK.md` 10 a 15 minutos antes.
- Seguir el guion de `tasks/TASK-086-HANDOFF.md`.
- Documentar:
  - quien opero o perfil del operador;
  - fecha/hora;
  - datos ficticios o reales autorizados;
  - pasos completados;
  - dudas del operador;
  - errores o bloqueos;
  - mejoras sugeridas;
  - decision preliminar: seguir, pausar, corregir.
- Clasificar hallazgos con severidad sugerida:
  - P0/P1;
  - P2;
  - P3;
  - post-MVP;
  - decision de producto;
  - decision operativa.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No modificar datos fuera de la prueba acordada.
- No registrar informacion sensible sin permiso.
- No convertir observaciones de color/estilo en bloqueos salvo que afecten operacion.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-090-HANDOFF.md
```

Incluye:

- Resultado de la sesion.
- Pasos ejecutados.
- Hallazgos clasificados.
- Datos usados o creados.
- Capturas/notas si aplica.
- Recomendacion preliminar para Product / Architect / Release.
