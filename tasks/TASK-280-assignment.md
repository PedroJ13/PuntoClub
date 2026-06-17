# TASK-280 - Reorganizar navegacion por tipo de fidelizacion

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 23
Depende de: TASK-279
Estado: Assigned

## Objetivo

Reorganizar la experiencia Web para separar claramente la operacion de `Puntos` y la operacion de `Membresias`, evitando que todo parezca una sola pantalla mezclada.

## Contexto

En una empresa como `DEMO 1`, que tiene puntos y membresias habilitados, el menu actual muestra:

- `Operaciones`
- `Mi empresa`
- `Membresias`
- `Reportes`

Esto confunde porque `Operaciones` en realidad representa puntos, mientras que membresias tambien tiene operacion propia.

## Menu esperado para empresa autenticada

Cuando la empresa tenga puntos y membresias habilitados, el menu izquierdo debe mostrar:

- `Puntos`
- `Membresias`
- `Mi empresa`
- `Reportes`

Reglas:

- `Puntos` reemplaza a `Operaciones`.
- `Puntos` muestra solo la pantalla operativa de puntos:
  - buscar cliente;
  - registrar cliente;
  - registrar compra;
  - redimir puntos;
  - balance de puntos.
- `Membresias` muestra solo operacion de membresias:
  - buscar cliente;
  - activar membresia;
  - renovar membresia;
  - registrar uso de beneficio;
  - historial de usos;
  - transacciones de membresia;
  - seguimiento operativo si aplica.
- `Mi empresa` muestra datos/configuracion de empresa y configuracion de membresias si la empresa tiene membresias habilitadas:
  - datos de empresa;
  - logo/configuracion;
  - planes de membresia;
  - beneficios de membresia.
- `Reportes` conserva todos los reportes:
  - puntos;
  - membresias;
  - auditoria;
  - CSV.
- `Admin empresas` no debe aparecer para una empresa normal autenticada.

## Busqueda de cliente por modulo

`Puntos` y `Membresias` deben tener su propia busqueda de cliente, visualmente consistente pero contextual.

### En Puntos

Al buscar/seleccionar un cliente:

- mostrar datos necesarios para puntos;
- mostrar balance de puntos;
- mostrar acciones de puntos;
- si la empresa tiene membresias habilitadas y el cliente tiene o puede operar membresias, mostrar mensaje contextual:

```text
Este cliente tambien tiene opciones de membresia.
```

Con boton:

```text
Ir a Membresias
```

El boton debe cambiar al modulo `Membresias` conservando el cliente seleccionado o la busqueda.

### En Membresias

Al buscar/seleccionar un cliente:

- mostrar datos necesarios para membresias;
- mostrar membresia activa/vencida si existe;
- mostrar acciones de membresias;
- si la empresa tiene puntos habilitados, mostrar mensaje contextual:

```text
Este cliente tambien puede operar con puntos.
```

Con boton:

```text
Ir a Puntos
```

El boton debe cambiar al modulo `Puntos` conservando el cliente seleccionado o la busqueda.

## Reglas de comportamiento

- Si la empresa solo tiene puntos habilitados, mostrar `Puntos`, `Mi empresa`, `Reportes`.
- Si la empresa solo tiene membresias habilitadas, mostrar `Membresias`, `Mi empresa`, `Reportes`.
- Si tiene ambos, mostrar ambos.
- Al iniciar sesion, abrir por defecto:
  - `Puntos` si puntos esta habilitado;
  - si no, `Membresias`;
  - si no, `Mi empresa`.
- No mezclar formularios de membresias dentro de `Puntos`.
- No mezclar formularios de puntos dentro de `Membresias`.
- Mantener mensajes inline dentro de la app.
- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.

## Fuera de alcance

- Cambios de backend/API salvo que falte un dato indispensable para detectar tipos de fidelizacion.
- Rediseno visual profundo de colores/tipografia.
- Cambiar reglas de negocio de puntos o membresias.
- Crear nuevas funcionalidades de membresia.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Menu publicado contiene `Puntos`, `Membresias`, `Mi empresa`, `Reportes` para empresas con ambos tipos.
- `Operaciones` ya no aparece como item principal cuando corresponde `Puntos`.
- `Admin empresas` sigue oculto para empresa normal.
- `Puntos` y `Membresias` tienen busqueda contextual separada.
- Botones `Ir a Membresias` e `Ir a Puntos` funcionan sin perder el cliente seleccionado cuando sea posible.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-280-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Resumen de cambios.
- Evidencia de checks.
- Evidencia de markers publicados.
- Riesgos o notas para QA.
