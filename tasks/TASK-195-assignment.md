# TASK-195 - Conectar UI de Mi empresa con logo

Equipo responsable: Web Dev

## Contexto

La pantalla `Mi empresa` ya existe y la operacion autenticada esta aprobada. Falta conectar una experiencia minima para subir/ver logo de empresa cuando Backend/API entregue endpoints de logo privado.

Esta tarea depende de TASK-194 para contrato final.

## Objetivo

Agregar a la Web una experiencia simple y usable para cargar, ver y actualizar el logo de la empresa autenticada.

## Alcance

- Depende de TASK-194.
- En `Mi empresa`, permitir seleccionar imagen de logo.
- Aceptar solo tipos soportados por Backend/API.
- Mostrar preview local antes de subir si es sencillo.
- Mostrar logo actual si existe.
- Enviar upload con sesion/cookie cuando corresponda.
- No enviar `companyId` como autoridad.
- Manejar errores:
  - archivo muy grande;
  - tipo no permitido;
  - sesion requerida;
  - error API controlado.
- Mantener layout responsive basico.
- No usar token, password ni cookie en logs/handoff.

## Entregable

Crear o actualizar `tasks/TASK-195-HANDOFF.md` con:

- Resultado.
- Pantallas/rutas modificadas.
- Contrato usado.
- Estados de UI cubiertos.
- Pruebas ejecutadas.
- Pendientes o bloqueos.
