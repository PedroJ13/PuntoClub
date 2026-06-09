# TASK-179 - Usar sesion de empresa como contexto operativo en API

Equipo responsable: Backend API

## Contexto

Auth propia MVP ya fue validada por Product Owner: invitacion, crear acceso/password, login, sesion visible y logout. La siguiente fase funcional es que las operaciones privadas empiecen a usar la empresa autenticada como contexto confiable.

Hasta ahora, parte del MVP operaba con empresa piloto fija. Para multiempresa controlado, el `companyId` efectivo debe salir del backend via sesion validada, no del frontend.

## Objetivo

Preparar Backend/API para que los endpoints operativos usen `companyId` derivado de sesion cuando exista sesion valida.

## Alcance

- Revisar endpoints operativos existentes:
  - clientes;
  - compras;
  - redenciones;
  - settings/empresa;
  - reportes;
  - auditoria.
- Implementar o ajustar helper server-side de contexto de empresa si hace falta.
- Cuando exista sesion valida, usar `companyId` de la sesion.
- No aceptar `companyId` enviado por frontend como autoridad.
- Mantener compatibilidad del piloto actual si el producto todavia permite operacion sin login, pero documentar claramente la regla usada.
- Agregar/actualizar tests unitarios o de integracion necesarios.
- No cambiar schema SQL salvo que sea imprescindible y quede documentado.
- No exponer cookies, tokens, passwords, hashes ni connection strings en logs o handoff.

## Entregable

Crear o actualizar `tasks/TASK-179-HANDOFF.md` con:

- Resultado.
- Endpoints revisados y regla final de contexto por endpoint.
- Si se mantiene fallback a empresa piloto sin sesion, explicar donde y por que.
- Pruebas ejecutadas.
- Riesgos o pendientes.
