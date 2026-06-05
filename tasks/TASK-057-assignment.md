# TASK-057 - Validar API estable despues del primer run real del workflow API

## Equipo

QA

## Contexto

TASK-055 preparo el workflow formal de deploy API con GitHub Actions + Azure OIDC.

TASK-056 no fue ejecutable porque el workflow aun no habia sido commiteado/pusheado ni ejecutado.

Esta tarea debe ejecutarse despues del primer run real de:

```text
Deploy Punto Club API
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Confirmar que la API estable sigue funcionando despues del primer deploy o intento real del workflow API.

## Alcance

- Leer `tasks/TASK-055-HANDOFF.md` y `tasks/TASK-056-HANDOFF.md`.
- Revisar resultado del workflow `Deploy Punto Club API`.
- Si el workflow fallo:
  - reportar no aprobado;
  - incluir etapa/paso fallido y mensaje relevante sin secretos.
- Si el workflow paso:
  - validar `GET /companies/1/settings`;
  - buscar/listar clientes;
  - crear cliente;
  - registrar compra;
  - consultar saldo;
  - redimir puntos validos;
  - validar saldo insuficiente;
  - validar errores principales sin exponer secretos.
- Confirmar que frontend publicado sigue usando API real y no hay CORS roto si aplica.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- Workflow `.github/workflows/azure-functions-api.yml` commiteado y pusheado.
- Primer run de `Deploy Punto Club API` ejecutado.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-057-HANDOFF.md
```

Incluye resultado aprobado/no aprobado/no ejecutable, run revisado, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
