# TASK-263 - Web para registrar uso de beneficios de membresia

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 11
Depende de: TASK-257, TASK-260, TASK-262
Estado: Assigned

## Objetivo

Agregar y publicar en la Web el flujo para registrar usos de beneficios de membresia desde la ficha/operacion del cliente.

## Contexto

La UI publicada ya permite activar y consultar membresias del cliente. Falta la parte operativa: cuando una empresa atiende a un cliente con membresia activa, debe poder registrar que uso un beneficio.

## Alcance

1. Revisar handoffs de TASK-257, TASK-260 y TASK-262.
2. En la operacion del cliente, mostrar seccion de membresia activa si existe.
3. Mostrar lista de beneficios disponibles del plan activo.
4. Permitir registrar uso de un beneficio.
5. Mostrar historial reciente de usos de beneficios del cliente.
6. Publicar Web en Azure Static Web Apps.

## Reglas de UX MVP

- Si el cliente no tiene membresia activa, mostrar mensaje breve y no mostrar acciones de uso.
- Si tiene membresia activa, mostrar nombre del plan y estado.
- Cada beneficio debe tener accion clara para registrar uso.
- La confirmacion debe ser mensaje dentro de la app, no `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.
- Mantener la pantalla operativa simple; no redisenar colores/layout global en esta tarea.

## Validaciones minimas

- Build/checks Web pasan.
- Sitio publicado carga.
- Bundle publicado contiene funciones/markers del flujo de uso de beneficios.
- No aparece `window.confirm`, `localStorage` ni `sessionStorage`.
- La UI no muestra acciones de beneficios para cliente sin membresia activa.

## Fuera de alcance

- Cambios esteticos generales.
- Crear reportes nuevos de membresias.
- Avisos por correo.

## Handoff esperado

Actualizar `tasks/TASK-263-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de markers publicados.
- Notas para QA.
