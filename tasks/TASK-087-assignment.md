# TASK-087 - Ejecutar smoke operativo pre-sesion

## Equipo

QA

## Contexto

Antes de una sesion piloto real, se necesita una verificacion rapida del ambiente publicado usando el runbook operativo.

Documentos:

```text
docs/PILOT_RUNBOOK.md
tasks/PO_TEST_CLIENTES_FLOW.md
```

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que el ambiente esta listo inmediatamente antes de una sesion piloto: frontend carga, API responde, SQL esta online/responsive y el flujo minimo no presenta errores criticos.

## Alcance

- Ejecutar pasos relevantes de `docs/PILOT_RUNBOOK.md`.
- Confirmar frontend publicado carga con `API real`.
- Confirmar `/api/companies/1/settings` responde `200`.
- Confirmar SQL esta `Online` o se reanuda correctamente.
- Ejecutar una busqueda simple sin crear datos.
- Ejecutar, si Product lo autoriza para esta verificacion, un flujo corto con datos QA:
  - registrar cliente;
  - compra;
  - redencion;
  - historial.
- Confirmar sin P0/P1.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-087-HANDOFF.md
```

Incluye:

- Resultado listo/no listo.
- Checks ejecutados.
- Hora de ejecucion.
- Datos QA creados si aplica.
- Hallazgos P0/P1/P2/P3.
- Recomendacion para ejecutar o pausar la sesion piloto.
