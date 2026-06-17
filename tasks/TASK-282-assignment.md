# TASK-282 - Igualar pantalla de Membresias a estructura de Puntos

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 25
Depende de: TASK-280, TASK-281
Estado: Superseded

## Nota Product / Architect / Release

Esta tarea queda reemplazada por el flujo `Atender cliente` / Cliente Primero.

No ejecutar esta tarea salvo nueva instruccion explicita. El rediseño ya no busca hacer `Membresias` igual a `Puntos` como modulos separados, sino unificar la entrada por cliente y mostrar puntos/membresias como acciones dentro de la ficha operativa.

Referencia nueva:

- `docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md`
- `tasks/TASK-284-assignment.md`

## Objetivo

Hacer que la pagina/modulo `Membresias` use la misma estructura visual y operativa que `Puntos`, para que el usuario no tenga que aprender dos pantallas distintas.

## Contexto

El usuario valido que la pantalla de `Puntos` se entiende mejor:

- Buscar cliente.
- Resultados.
- Registrar cliente.
- Panel inferior de operacion.

`Membresias` debe seguir ese mismo patron. La diferencia debe estar en las acciones del panel inferior, no en una composicion visual completamente distinta.

## Estructura esperada en Membresias

La pantalla de `Membresias` debe verse conceptualmente igual a `Puntos`:

1. Panel superior izquierdo:
   - `Buscar cliente para membresias`
   - Campo: telefono, nombre o email.
   - Botones `Buscar` y `Limpiar`.

2. Panel medio izquierdo:
   - `Resultados`
   - Lista de clientes encontrados.
   - Acciones contextuales de membresia por cliente.

3. Panel derecho:
   - `Registrar cliente`
   - Formulario igual o muy similar al de Puntos.
   - Al registrar cliente desde `Membresias`, el siguiente paso debe ser pagar/activar membresia para ese cliente.

4. Panel inferior:
   - `Operacion de membresias`
   - Si no hay cliente seleccionado, mostrar mensaje breve.
   - Si hay cliente seleccionado, mostrar acciones validas para ese cliente:
     - pagar/activar membresia;
     - renovar membresia;
     - registrar uso de beneficio;
     - ver beneficios disponibles;
     - ver historial de usos;
     - ver transacciones.

## Regla clave: pagar membresia

Usar el concepto visible:

```text
Pagar membresia
```

Esto cubre dos casos:

- Cliente nuevo sin membresia: pagar membresia crea/activa la membresia.
- Cliente existente con membresia vencida o renovable: pagar membresia equivale a renovar.

La UI puede seguir llamando internamente a endpoints de activacion o renovacion, pero el usuario debe verlo como una accion coherente.

## Flujo esperado al registrar cliente desde Membresias

1. Usuario entra a `Membresias`.
2. Registra un cliente nuevo.
3. Al completar registro, la app selecciona ese cliente.
4. La app enfoca o abre el panel inferior `Operacion de membresias`.
5. La accion principal visible debe ser `Pagar membresia`.

## Flujo esperado al buscar cliente en Membresias

1. Usuario busca cliente.
2. Selecciona resultado.
3. Panel inferior muestra estado:
   - sin membresia;
   - activa;
   - vencida;
   - renovable.
4. Acciones visibles se ajustan al estado.

## Mensaje contextual hacia Puntos

Si la empresa tambien tiene puntos habilitados, al seleccionar cliente en `Membresias` debe aparecer un mensaje contextual:

```text
Este cliente tambien puede operar con puntos.
```

Con boton:

```text
Ir a Puntos
```

## Reglas de UX

- Mantener la estructura de tarjetas/paneles de `Puntos`.
- Evitar mezclar configuracion de planes/beneficios dentro de operacion de membresias.
- La configuracion de planes/beneficios sigue en `Mi empresa`.
- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.
- No hacer rediseño de colores/tipografia en esta tarea.

## Fuera de alcance

- Cambios de API salvo que falte un dato indispensable.
- Cambiar reglas de negocio de membresias.
- Crear nuevos reportes.
- Correos automaticos.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- `Membresias` muestra estructura equivalente a `Puntos`.
- Registrar cliente desde `Membresias` lleva a operacion/pago de membresia.
- `Pagar membresia` aparece como accion principal cuando aplica.
- Renovacion sigue funcionando bajo el flujo de pagar membresia.
- Configuracion de planes/beneficios permanece en `Mi empresa`.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-282-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Resumen de cambios.
- Evidencia de checks.
- Evidencia de markers publicados.
- Notas para QA.
