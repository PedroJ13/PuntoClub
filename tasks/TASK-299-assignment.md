# TASK-299 - Compactar tarjetas de membresia y beneficios

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 40
Depende de: TASK-298
Estado: Assigned

## Objetivo

Compactar visualmente las tarjetas/paneles de membresia y beneficios dentro de `Atender cliente`, para que ocupen menos alto y se puedan escanear mejor.

## Contexto

Product Owner valido que el flujo ya funciona bien, pero observo que las tarjetas de membresia/beneficios se ven demasiado altas y pesadas visualmente.

Ejemplos observados:

- Tarjeta de membresia activa con `Renovar membresia`.
- Tarjetas de beneficios con `Registrar uso`.
- Mucho espacio vertical interno entre titulo, descripcion, metadata y boton.

## Alcance

1. Leer:
   - `tasks/TASK-297-HANDOFF.md`
   - `tasks/TASK-298-HANDOFF.md`
2. Ajustar CSS/layout de las tarjetas de membresia y beneficios para hacerlas mas delgadas:
   - reducir padding vertical;
   - reducir separaciones internas;
   - mantener legibilidad;
   - mantener botones visibles y faciles de presionar;
   - evitar solapes en desktop y mobile.
3. Mantener la informacion esencial:
   - nombre de membresia/beneficio;
   - estado/tipo;
   - fechas o limites relevantes;
   - accion principal.
4. No cambiar logica de negocio ni contratos API.
5. Publicar si el flujo habitual del proyecto lo requiere.

## Criterios de aceptacion

- Las tarjetas de membresia/beneficios se ven mas compactas en desktop.
- En mobile no se solapan textos, chips ni botones.
- Los botones `Renovar membresia` y `Registrar uso` siguen visibles y funcionales.
- No se rompen los paneles bajo demanda de `Atender cliente`.
- No reaparece `Transacciones de membresia` vacia para clientes sin membresia.
- No usar `window.confirm`, `localStorage` ni `sessionStorage`.

## Fuera de alcance

- Redisenar toda la paleta o identidad visual.
- Cambios de API/SQL.
- Cambios al flujo de pago/activacion de membresia.

## Handoff esperado

Crear o actualizar `tasks/TASK-299-HANDOFF.md` con:

- Resultado.
- Archivos tocados.
- Evidencia de desktop/mobile si aplica.
- Confirmacion de deploy si aplica.
- Riesgos o notas para QA.
