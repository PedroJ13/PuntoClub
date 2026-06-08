# TASK-158 - Conectar Web con flujo Crear acceso y login

Equipo responsable: Web Dev

## Dependencias

Esperar:

- `tasks/TASK-156-HANDOFF.md` completado.
- `tasks/TASK-157-HANDOFF.md` completado o con contrato Backend suficiente.

## Contexto

La pantalla publica `/company-invitations/accept?token=...` ya muestra invitacion valida y CTA `Crear acceso`, pero actualmente el acceso esta bloqueado por copy hasta que login este listo.

## Objetivo

Conectar la experiencia Web para que una empresa invitada pueda iniciar `Crear acceso` usando Entra External ID y volver al flujo de Punto Club sin exponer token ni secretos.

## Alcance

- Leer `tasks/TASK-156-HANDOFF.md` y `tasks/TASK-157-HANDOFF.md`.
- Reusar la pantalla publica de invitacion actual.
- Activar CTA solo cuando la configuracion de auth este completa.
- Manejar estados: configuracion incompleta, login cancelado, error de identidad, invitacion invalida/expirada, acceso creado/existente.
- No almacenar token de invitacion en logs ni UI visible.
- No exponer secretos en frontend.
- Mantener experiencia publicada funcional para Operaciones, Mi empresa y Reportes.

## Entregable

Crear o actualizar `tasks/TASK-158-HANDOFF.md` con:

- Resultado.
- Cambios realizados o bloqueo.
- Rutas/pantallas afectadas.
- Variables publicas requeridas.
- Pruebas locales/publicadas ejecutadas.
