# TASK-527 - Redefinir navegacion Mi empresa y flujo Enviar campanas

Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Navegacion y alcance
Estado: Ready
Prioridad: P1 definicion UX/producto

## Objetivo

Redefinir la navegacion del panel operativo para separar configuracion de empresa, membresias, configuracion de comunicaciones y ejecucion de campañas.

## Contexto

La UI publicada de TASK-526 expone una seccion externa llamada `Comunicaciones` con configuracion, campanas, clientes/preferencias e historial en modo mock. El Product Owner solicita reorganizar:

- `Mi empresa`
  - `Overview`
  - `Membresias`
  - `Comunicaciones`
- menu externo `Enviar campanas`.

## Alcance

1. Definir estructura de navegacion.
2. Definir contenido de cada submenu.
3. Definir alcance de `Enviar campanas`.
4. Mantener envio real bloqueado salvo decision posterior explicita.
5. Crear handoff para Diseno / UX y Web Dev.

## Fuera de alcance

- No implementar UI.
- No activar envio real.
- No tocar API.
- No tocar SQL.
- No enviar correos reales.

## Handoff esperado

Crear o actualizar `tasks/TASK-527-HANDOFF.md`.
