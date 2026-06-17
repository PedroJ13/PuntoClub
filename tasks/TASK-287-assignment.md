# TASK-287 - Web Atender cliente cliente primero

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 29
Depende de: TASK-284, TASK-285, TASK-286, TASK-289
Estado: Assigned

## Objetivo

Ajustar la Web para que la operacion principal sea `Atender cliente`, con puntos y membresias como acciones dentro de la ficha del cliente.

## Contexto

Las tareas TASK-282/TASK-283 quedan reemplazadas por esta direccion. No se busca tener `Puntos` y `Membresias` como pantallas operativas separadas, sino una entrada principal:

```text
Atender cliente
```

## Alcance

1. Leer handoffs:
   - `tasks/TASK-284-HANDOFF.md`
   - `tasks/TASK-285-HANDOFF.md`
   - `tasks/TASK-286-HANDOFF.md`
   - `tasks/TASK-289-HANDOFF.md`
2. Cambiar menu principal para empresa normal:
   - `Atender cliente`
   - `Mi empresa`
   - `Reportes`
3. En `Atender cliente`, implementar estructura:
   - buscar cliente;
   - resultados;
   - registrar cliente;
   - ficha del cliente seleccionado;
   - resumen de puntos;
   - resumen de membresias;
   - alertas;
   - acciones disponibles.
4. Despues de registrar cliente nuevo, dejarlo seleccionado y mostrar acciones disponibles.
5. Mostrar acciones segun flags de empresa:
   - si puntos habilitado: registrar compra/redimir puntos;
   - si membresias habilitado: pagar membresia, renovar, aplicar beneficio;
   - si ambos: mostrar ambas secciones en la ficha.
6. Mover configuracion de planes/beneficios a `Mi empresa` si no esta ya ahi.
7. Mantener Reportes sin regresion.
8. Publicar Web en Azure Static Web Apps.

## Reglas UX

- El nombre visible debe ser `Atender cliente`.
- No mostrar `Puntos` y `Membresias` como entradas operativas principales en el menu.
- Usar `Pagar membresia` como accion de negocio visible cuando el usuario va a activar o renovar membresia.
- No obligar al usuario a buscar nuevamente despues de registrar cliente.
- No usar `window.confirm`.
- No usar `localStorage` ni `sessionStorage`.

## Fuera de alcance

- Cambios profundos de color/branding.
- Nuevos endpoints salvo que TASK-285 indique que ya existen o que se implemente en tarea separada.
- Nuevas reglas de negocio.
- Correos automaticos.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Menu muestra `Atender cliente`, `Mi empresa`, `Reportes`.
- Registrar cliente desde `Atender cliente` deja cliente seleccionado.
- Cliente seleccionado muestra puntos y membresias segun correspondan.
- Acciones de puntos siguen disponibles.
- Acciones de membresias siguen disponibles.
- Configuracion de membresias vive en `Mi empresa`.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-287-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Resumen de cambios.
- Evidencia de checks.
- Evidencia de markers publicados.
- Riesgos o notas para QA.
