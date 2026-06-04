# TASK-046 - Revalidar frontend publicado despues del deploy real

## Equipo

Web Dev / QA

## Contexto

TASK-044 no fue aprobada porque la Static Web App mostraba la pagina default de Azure.

TASK-046 debe ejecutarse despues de TASK-045, cuando la URL publicada ya cargue la UI real de Punto Club.

URL esperada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Validar el flujo clientes desde la URL publicada real contra la API estable.

## Alcance

- Abrir URL frontend publicada.
- Confirmar que no es la pagina default de Azure Static Web Apps.
- Confirmar que `app-config.js` carga.
- Confirmar que la UI usa API real.
- Buscar/listar clientes.
- Registrar cliente.
- Buscar cliente recien creado.
- Validar duplicado.
- Validar campos requeridos.
- Probar desktop/mobile basico.
- Confirmar que no hay error CORS desde el hostname real.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No editar Azure.
- No guardar secretos.

## Dependencias

- TASK-045 completada.
- URL publicada cargando UI real.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-046-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 si aparecen y evidencia suficiente para avisar a PO Test.
