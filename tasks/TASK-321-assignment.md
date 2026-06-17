# TASK-321 - Abrir firewall SQL temporal para desbloquear smoke API

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra / Azure
Round: 57
Depende de: TASK-320
Estado: Assigned
Prioridad: P1 release-blocker

## Objetivo

Abrir una regla temporal de firewall en Azure SQL para permitir validar `dbo.Companies`, definir `PILOT_COMPANY_ID` correcto y desbloquear el workflow `Deploy Punto Club API`.

## Contexto

`TASK-320` confirmo bloqueo actual:

- Server: `sqlserver-pj13-brazil`
- DB: `sql-db-puntoclub`
- IP publica a permitir: `200.229.6.68`
- Error actual:
  - `Client with IP address '200.229.6.68' is not allowed to access the server`
- `GET /companies/3/settings` sigue devolviendo `404 COMPANY_NOT_FOUND`.
- No se pudo ejecutar la consulta SQL para confirmar companias activas.

Este patron ya se resolvio antes en el proyecto con reglas temporales de firewall.

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/SQL_AZURE_CONNECTION_NOTES.md` si existe
- `tasks/TASK-318-HANDOFF.md`
- `tasks/TASK-319-HANDOFF.md`
- `tasks/TASK-320-HANDOFF.md`

## Alcance

1. Crear regla temporal de firewall en Azure SQL para IP `200.229.6.68`.
   - Nombre sugerido: `tmp-task321-sql-smoke-200-229-6-68`
2. Validar conexion a `sql-db-puntoclub`.
3. Ejecutar consulta:

```sql
SELECT id, name, status
FROM dbo.Companies
ORDER BY id;
```

4. Confirmar si existe una compania `active`.
5. Si existe una compania activa:
   - reportar `company_id` y nombre no sensible;
   - actualizar `PILOT_COMPANY_ID` en workflow o app setting si aplica;
   - relanzar `Deploy Punto Club API`.
6. Si no existe ninguna compania activa:
   - detenerse y documentar;
   - pedir decision Product/usuario antes de crear/restaurar empresa piloto.
7. Si el deploy API queda success, documentar run URL.
8. Retirar regla temporal de firewall si ya no es necesaria, o documentar por que queda activa temporalmente.

## Criterios de aceptacion

- Firewall permite validar SQL desde la IP indicada o se documenta bloqueo exacto.
- Se conoce el `company_id` activo para smoke, o queda confirmado que no hay companias activas.
- `PILOT_COMPANY_ID` queda alineado si existe compania activa.
- Workflow `Deploy Punto Club API` se reintenta si hay compania activa.
- No se exponen connection strings, tokens ni passwords.
- La regla temporal queda retirada o documentada.

## Handoff esperado

Crear o actualizar `tasks/TASK-321-HANDOFF.md` con:

- Resultado: completado, bloqueado o requiere decision.
- Regla de firewall creada/retirada.
- Resultado redaccionado de `dbo.Companies`.
- `PILOT_COMPANY_ID` final si aplica.
- Workflow run URL y estado si se relanzo.
- Siguiente paso recomendado.
