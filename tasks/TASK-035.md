# TASK-035 - Habilitar CORS o same-origin para API estable

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-034 no fue aprobada porque la API estable responde a llamadas directas, pero Azure Functions no devuelve headers CORS para el frontend local.

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

Frontend local usado por Web Dev:

```text
http://127.0.0.1:4173
http://127.0.0.1:4175
```

## Objetivo

Permitir que la UI en navegador consuma la API estable sin bloquearse por CORS.

## Alcance

- Elegir una ruta:
  - habilitar CORS en Azure Functions para origen local de prueba, o
  - definir same-origin si hay alternativa inmediata.
- Configurar CORS sin usar wildcard permanente si se puede evitar.
- Validar `OPTIONS`, `GET` y `POST` con headers CORS esperados.
- No crear Static Web Apps todavia salvo decision explicita.

## No tocar

- No guardar secretos.
- No crear otra DB.
- No cambiar contratos API.
- No abrir CORS amplio permanente sin documentar riesgo.

## Handoff esperado

Crear `tasks/TASK-035-HANDOFF.md`.
