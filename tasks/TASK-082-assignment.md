# TASK-082 - Limpiar mensaje persistente de duplicado

## Equipo

Web Dev

## Contexto

TASK-081 aprobo la regresion MVP publicada sin P0/P1. QA dejo un P3:

```text
Despues de ejecutar duplicados, el mensaje del formulario de registro
`Ya existe un cliente con ese telefono o email. Lo buscamos y seleccionamos.`
queda persistente mientras se operan compra/redencion.
```

No bloquea piloto, pero puede confundir visualmente.

## Objetivo

Limpiar el mensaje persistente de duplicado cuando el usuario cambia de contexto hacia compra, redencion, historial, busqueda o registro exitoso.

## Comportamiento esperado

- El mensaje de duplicado debe mostrarse cuando ocurre el duplicado.
- Al seleccionar/abrir compra, redencion o historial para un cliente, el mensaje del formulario de registro no debe quedar visible si ya no aplica.
- Al registrar compra/redencion, no debe quedar visible un mensaje viejo de duplicado.
- No romper:
  - busqueda sin resultado;
  - registro nuevo;
  - duplicado con seleccion del existente;
  - compra;
  - redencion;
  - historial.

## No tocar

- No cambiar contratos API.
- No cambiar backend/API.
- No cambiar Azure.
- No guardar secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-082-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Archivos modificados.
- Evidencia de duplicado mostrando mensaje.
- Evidencia de que el mensaje desaparece al pasar a compra/redencion/historial.
- Evidencia de que compra, redencion e historial siguen funcionando.
- Pruebas ejecutadas.
