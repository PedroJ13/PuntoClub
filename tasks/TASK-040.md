# TASK-040 - Preparar Static Web Apps y CORS para frontend real

## Estado

Asignada a Infra / Azure.

## Contexto

El flujo clientes ya fue aprobado usando frontend local contra API estable. Falta una URL frontend estable para prueba comoda de usuario/PO.

## Objetivo

Preparar el despliegue de frontend en Azure Static Web Apps o confirmar pasos finales antes de crearlo.

## Alcance

- Proponer nombre de Static Web App.
- Confirmar region/plan.
- Configurar build/deploy para `app/` si se aprueba creacion.
- Definir como se inyectara `app-config.js` sin secretos.
- Actualizar CORS de Azure Functions para el origen real de Static Web Apps cuando exista.

## No tocar

- No crear Static Web Apps sin confirmacion explicita si requiere nuevo recurso.
- No guardar secretos.
- No cambiar API.

## Handoff esperado

Crear `tasks/TASK-040-HANDOFF.md`.
