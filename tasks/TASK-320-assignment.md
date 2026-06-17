# TASK-320 - Desbloquear acceso SQL para confirmar empresa activa de smoke

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra / Azure + SQL validacion
Round: 56
Depende de: TASK-318, TASK-319
Estado: Assigned
Prioridad: P1 release-blocker

## Objetivo

Desbloquear el acceso operativo necesario para confirmar que empresa activa debe usar el smoke API (`PILOT_COMPANY_ID`) o crear/restaurar una empresa piloto minima si no existe ninguna activa.

## Contexto

`TASK-319` quedo bloqueada porque:

- La conexion directa a Azure SQL fue bloqueada por firewall.
- IP reportada: `200.229.6.68`.
- Azure CLI no tenia sesion/login operativo desde el entorno.
- La API publicada retorno `404 COMPANY_NOT_FOUND` para ids `1..500` en `/companies/{id}/settings`.

Base objetivo:

- Server: `sqlserver-pj13-brazil`
- DB: `sql-db-puntoclub`

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-318-HANDOFF.md`
- `tasks/TASK-319-HANDOFF.md`
- `docs/SQL_AZURE_CONNECTION_NOTES.md` si existe

## Alcance

1. Habilitar acceso temporal seguro a Azure SQL para la IP operativa o usar una maquina/Cloud Shell con acceso permitido.
2. Ejecutar consulta directa, sin exponer secretos:

```sql
SELECT id, name, status
FROM dbo.Companies
ORDER BY id;
```

3. Confirmar si existe al menos una empresa `active`.
4. Si existe empresa activa:
   - reportar `company_id` y nombre no sensible;
   - actualizar `PILOT_COMPANY_ID` en workflow/config si aplica;
   - relanzar `Deploy Punto Club API`.
5. Si no existe empresa activa:
   - crear/restaurar una empresa piloto minima solo si Product/usuario lo autoriza;
   - reportar el nuevo `company_id`;
   - actualizar `PILOT_COMPANY_ID`;
   - relanzar `Deploy Punto Club API`.
6. Retirar regla temporal de firewall si se creo solo para esta tarea.

## Criterios de aceptacion

- Se conoce el `company_id` activo para smoke, o queda confirmado que no hay empresas activas.
- `PILOT_COMPANY_ID` queda alineado con una empresa activa.
- Workflow `Deploy Punto Club API` se relanza y queda success, o queda un nuevo error claro.
- Si se abre firewall temporal, se retira o se documenta por que queda activo.
- No se exponen connection strings, passwords ni tokens.

## Handoff esperado

Crear o actualizar `tasks/TASK-320-HANDOFF.md` con:

- Resultado: completado, bloqueado o requiere aprobacion.
- IP/regla usada, si aplica, sin secretos.
- Resultado redaccionado de `dbo.Companies`.
- `PILOT_COMPANY_ID` final.
- Workflow run URL y estado.
- Si queda bloqueado, accion exacta requerida del usuario.
