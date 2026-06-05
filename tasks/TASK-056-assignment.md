# TASK-056 - Validar API estable despues del workflow de deploy API

## Equipo

QA

## Contexto

TASK-055 debe preparar o ejecutar una ruta formal para deploy repetible de API.

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Validar que la API estable sigue funcionando despues de cualquier cambio/deploy derivado de TASK-055.

## Alcance

- Leer `tasks/TASK-055-HANDOFF.md`.
- Si TASK-055 solo dejo plan y no ejecuto deploy, marcar esta tarea como no ejecutable y explicar por que.
- Si hubo deploy o cambio de configuracion:
  - validar `GET /companies/1/settings`;
  - buscar/listar clientes;
  - crear cliente;
  - registrar compra;
  - consultar saldo;
  - redimir puntos validos;
  - validar saldo insuficiente;
  - validar errores principales sin exponer secretos.
- Confirmar que frontend publicado sigue usando API real sin CORS roto si aplica.

## No tocar

- No implementar cambios.
- No imprimir secretos.
- No cambiar Azure.

## Dependencias

- TASK-055 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-056-HANDOFF.md
```

Incluye resultado aprobado/no aprobado/no ejecutable, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
