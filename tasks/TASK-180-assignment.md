# TASK-180 - Conectar Web operativa a sesion de empresa autenticada

Equipo responsable: Web Dev

## Contexto

Auth propia MVP ya fue validada por Product Owner. La UI muestra sesion iniciada y logout funciona. Ahora hay que hacer que la experiencia operativa use esa sesion como contexto de empresa, no un `companyId` confiado desde frontend.

Esta tarea puede avanzar en paralelo con TASK-179 para preparar la web, pero la validacion publicada final depende de que Backend/API entregue la regla operativa de contexto.

## Objetivo

Alinear la Web para que las llamadas operativas privadas viajen con cookie de sesion cuando el usuario esta autenticado y la UI refleje claramente la empresa activa.

## Alcance

- Revisar llamadas de Web a:
  - clientes;
  - compras;
  - redenciones;
  - settings/empresa;
  - reportes;
  - auditoria.
- Asegurar que las llamadas que dependan de sesion usen `credentials: "include"` cuando corresponda.
- No enviar `companyId` desde frontend como autoridad.
- Mostrar de forma clara la empresa activa ya resuelta por sesion.
- Si el usuario no esta autenticado, mantener comportamiento actual solo si Backend/API mantiene fallback de piloto; si no, mostrar estado de login requerido.
- Evitar que la pantalla de invitacion/publica quede afectada por cambios de sesion.
- Validar responsive basico despues del ajuste.

## Entregable

Crear o actualizar `tasks/TASK-180-HANDOFF.md` con:

- Resultado.
- Rutas/pantallas revisadas.
- Llamadas API ajustadas y regla de credentials.
- Comportamiento con sesion iniciada y sin sesion.
- Pruebas ejecutadas.
- Riesgos o pendientes.
