# TASK-285 - Revision API para ficha Atender cliente

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 28
Depende de: TASK-284
Estado: Assigned

## Objetivo

Revisar si los endpoints actuales soportan la ficha unificada `Atender cliente` sin cambios de API, o si se requiere un contrato agregado minimo.

## Contexto

La nueva pantalla necesita mostrar rapidamente, despues de seleccionar un cliente:

- datos del cliente;
- puntos disponibles;
- membresias activas/vencidas;
- beneficios disponibles/usados;
- transacciones recientes;
- alertas relevantes.

Antes de mover Web, Backend/API debe confirmar si Web puede componer esto con endpoints actuales o si conviene crear un endpoint resumido.

## Alcance

1. Leer:
   - `tasks/TASK-284-HANDOFF.md`
   - `docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md`
   - `docs/NEXT_PHASE_MEMBERSHIPS.md`
2. Inventariar endpoints actuales que Web podria usar.
3. Decidir recomendacion tecnica:
   - usar endpoints existentes; o
   - proponer endpoint agregado, por ejemplo:
     - `GET /api/customers/{customerId}/profile`
     - `GET /api/customers/{customerId}/summary`
4. Si no hace falta implementar, documentarlo.
5. Si hace falta endpoint, definir contrato exacto y crear una tarea posterior recomendada, sin implementarlo salvo instruccion explicita del Product / Architect / Release.

## Fuera de alcance

- No implementar codigo si la tarea concluye que solo hace falta decision/contrato.
- No cambiar SQL.
- No cambiar Web.

## Handoff esperado

Actualizar `tasks/TASK-285-HANDOFF.md` con:

- Endpoints actuales relevantes.
- Decision: endpoints existentes vs endpoint agregado.
- Contrato propuesto si aplica.
- Riesgos de performance/latencia.
- Recomendacion para Web Dev.
