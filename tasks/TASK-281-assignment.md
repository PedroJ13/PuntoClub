# TASK-281 - QA navegacion Puntos y Membresias

Equipo: QA
Round: 24
Depende de: TASK-280
Estado: Assigned

## Objetivo

Validar en Azure que la navegacion por tipo de fidelizacion quedo clara y que Puntos/Membresias funcionan como modulos separados.

## Alcance

1. Leer `tasks/TASK-280-HANDOFF.md`.
2. Validar con Web publicada:
   - menu para empresa con puntos y membresias;
   - `Puntos` reemplaza `Operaciones`;
   - `Membresias` es modulo operativo independiente;
   - `Mi empresa` contiene configuracion de empresa y membresias;
   - `Reportes` conserva reportes;
   - `Admin empresas` no aparece para empresa normal.
3. Validar busqueda contextual:
   - buscar cliente en `Puntos`;
   - verificar mensaje/boton `Ir a Membresias` cuando aplique;
   - buscar cliente en `Membresias`;
   - verificar mensaje/boton `Ir a Puntos` cuando aplique.
4. Validar que cambiar entre modulos conserve cliente seleccionado o busqueda cuando sea posible.
5. Revisar regresion visible:
   - login;
   - registro de cliente;
   - compra/redencion de puntos;
   - activacion/renovacion/uso de beneficios de membresia;
   - reportes.

## Validaciones minimas

- Web publicada carga.
- Menu esperado visible.
- No se mezclan formularios de puntos y membresias.
- `Operaciones` no queda como nombre principal si la empresa usa puntos.
- `Admin empresas` oculto para empresa normal.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- Si no hay sesion real, dejar como bloqueo parcial lo que requiera datos autenticados.

## Handoff esperado

Actualizar `tasks/TASK-281-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Flujos validados.
- Hallazgos P1/P2/P3.
