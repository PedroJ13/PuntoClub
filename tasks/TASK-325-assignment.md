# TASK-325 - Retirar o documentar regla temporal de firewall SQL

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra / Azure
Round: 60
Depende de: TASK-321, TASK-323
Estado: Assigned
Prioridad: P1 seguridad operativa

## Objetivo

Retirar la regla temporal de firewall SQL usada para desbloquear el smoke, o documentar explicitamente por que debe quedar activa por un periodo corto.

## Contexto

Se creo regla temporal:

- `tmp-task321-sql-smoke-200-229-6-68`
- IP: `200.229.6.68`
- Server: `sqlserver-pj13-brazil`
- Resource group: `resource_group_main`

La regla se abrio para confirmar `dbo.Companies` y desbloquear `PILOT_COMPANY_ID`/smoke API.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-321-HANDOFF.md`
- `tasks/TASK-323-HANDOFF.md`

## Alcance

1. Confirmar si la regla temporal sigue existiendo.
2. Si ya no es necesaria, retirarla:

```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name tmp-task321-sql-smoke-200-229-6-68
```

3. Si aun se necesita, documentar:
   - motivo;
   - responsable;
   - fecha/hora estimada de retiro.
4. No tocar otras reglas de firewall.

## Criterios de aceptacion

- La regla temporal queda retirada, o queda justificacion clara y fecha de retiro.
- No se exponen secretos.
- No se eliminan reglas ajenas.

## Handoff esperado

Crear o actualizar `tasks/TASK-325-HANDOFF.md` con:

- Resultado.
- Estado final de la regla temporal.
- Comando/accion ejecutada.
- Si queda abierta, razon y siguiente paso.
