# TASK-080 - Evaluar endurecimiento operativo SQL pre-piloto

## Equipo

Infra / Azure

## Contexto

TASK-079 retiro la regla temporal SQL de auditoria. Permanece la regla existente:

```text
AllowAllWindowsAzureIps
```

TASK-074 tambien documento que Azure SQL serverless puede estar en `Paused`/`Resuming`, lo que puede causar latencia inicial durante el piloto.

## Objetivo

Evaluar opciones de endurecimiento operativo para Azure SQL antes del piloto, sin aplicar cambios todavia.

## Alcance

- Revisar riesgo de mantener `AllowAllWindowsAzureIps`.
- Proponer opciones para que Azure Functions siga conectando a SQL sin abrir mas de lo necesario.
- Revisar impacto de SQL serverless con `autoPauseDelay=60`.
- Proponer opciones:
  - mantener serverless con runbook;
  - ajustar auto-pause;
  - mover a provisioned temporalmente durante piloto;
  - otra alternativa razonable.
- Estimar impacto operativo/costo cualitativo.
- Indicar que cambios requeririan aprobacion explicita del usuario.

## No tocar

- No cambiar firewall.
- No cambiar tier/SKU SQL.
- No cambiar connection strings.
- No crear recursos.
- No imprimir secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-080-HANDOFF.md
```

Incluye:

- Riesgos actuales.
- Opciones recomendadas.
- Pros/contras.
- Acciones sugeridas para Product / Architect / Release.
- Que decision requiere aprobacion del usuario antes de ejecutar.
