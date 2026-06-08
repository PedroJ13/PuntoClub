# TASK-156 - Completar configuracion Microsoft Entra External ID

Equipo responsable: Infra / Azure

## Contexto

La pantalla publica de invitacion real ya fue aprobada por QA en TASK-154 y la invitacion expuesta fue rotada/reemitida en TASK-155.

El siguiente bloqueo real para activar `Crear acceso`, login y password es Microsoft Entra External ID. Tareas anteriores confirmaron que no se deben crear apps en `Default Directory`.

## Objetivo

Completar o coordinar la configuracion manual de Microsoft Entra External ID para Punto Club y entregar valores publicos seguros que Backend/API y Web Dev puedan usar en la siguiente ronda.

## Alcance

- Revisar `tasks/TASK-135-HANDOFF.md` y `tasks/TASK-139-HANDOFF.md`.
- Confirmar si ya existe tenant/directorio External ID correcto para Punto Club.
- Configurar o guiar la configuracion manual necesaria en Azure Portal.
- No crear apps en `Default Directory`.
- No guardar secretos en repo.
- No imprimir client secrets.
- No modificar codigo.
- No crear recursos no aprobados.

## Valores requeridos para entregar

Documentar solo valores publicos/no secretos, si estan disponibles:

- Tenant/directory correcto de External ID.
- Tenant ID o domain publico.
- Client ID de la app frontend/public client, si aplica.
- Authority/issuer esperado.
- Redirect URI(s) configuradas para frontend publicado.
- Logout redirect URI(s), si aplica.
- User flow/policy usado para sign up/sign in, si aplica.
- Audiencia/API app registration para backend, si aplica.
- Estado de CORS/redirects relevantes.

## Si queda bloqueado

Si requiere intervencion manual del Product Owner, deja un bloqueo accionable con pasos exactos de portal, pantalla y valores que el Product Owner debe confirmar. No avances creando configuraciones en el directorio equivocado.

## Entregable

Crear o actualizar `tasks/TASK-156-HANDOFF.md` con:

- Resultado: completado o bloqueado.
- Que se configuro o que falta.
- Valores publicos seguros disponibles.
- Pasos exactos para Product Owner si queda bloqueado.
- Confirmacion de que no se expusieron secretos.
