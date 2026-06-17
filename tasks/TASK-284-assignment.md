# TASK-284 - UX funcional de Atender cliente

Equipo: Diseno / UX
Round: 27
Depende de: docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md
Estado: Assigned

## Decision Product / Architect / Release

El flujo principal se llamara:

```text
Atender cliente
```

No se usara `Caja` como nombre principal en esta fase, porque el flujo no es solo cobrar: primero se identifica al cliente y luego se decide que accion corresponde.

## Objetivo

Definir el wireflow funcional de `Atender cliente`, centrado en cliente primero y acciones despues.

## Contexto

Punto Club ya soporta puntos y membresias. La separacion por modulos (`Puntos` / `Membresias`) ayuda a ordenar, pero en operacion real el empleado primero tiene un cliente enfrente.

La pantalla debe responder:

```text
Tengo un cliente enfrente. Que puedo hacer con el?
```

## Alcance

1. Leer:
   - `docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md`
   - `docs/NEXT_PHASE_MEMBERSHIPS.md`
   - `docs/MVP_RELEASE_STATUS.md`
2. Definir estructura de pantalla `Atender cliente`.
3. Definir estados principales:
   - sin busqueda;
   - buscando;
   - sin resultados;
   - cliente seleccionado;
   - cliente recien registrado;
   - cliente con puntos;
   - cliente con membresia activa;
   - cliente con membresia vencida;
   - cliente con ambos tipos.
4. Definir copy principal y labels.
5. Definir como se muestran las acciones:
   - registrar compra/puntos;
   - redimir puntos;
   - pagar membresia;
   - renovar membresia;
   - aplicar beneficio;
   - ver historial.
6. Definir criterios de QA funcional.

## Reglas de producto

- `Puntos` y `Membresias` dejan de ser entradas operativas separadas en la experiencia principal.
- Puntos y membresias pasan a ser acciones/secciones dentro de la ficha del cliente.
- `Mi empresa` mantiene configuracion:
  - datos de empresa;
  - logo;
  - porcentaje de puntos;
  - planes de membresia;
  - beneficios.
- `Reportes` mantiene reportes y auditoria.
- `Admin empresas` sigue separado/oculto para empresas normales.

## Entregable esperado

Actualizar `tasks/TASK-284-HANDOFF.md` con:

- Decision visual recomendada.
- Wireflow textual.
- Estados de pantalla.
- Copy sugerido.
- Criterios de QA.
- Riesgos o dudas abiertas.
