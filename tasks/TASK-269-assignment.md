# TASK-269 - Web de alertas internas de vencimiento de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 15
Depende de: TASK-268
Estado: Assigned

## Objetivo

Mostrar en la Web alertas internas de membresias proximas a vencer y vencidas.

## Contexto

El correo automatico de vencimiento queda diferido. La primera version debe permitir que la empresa vea internamente que membresias requieren seguimiento.

## Alcance

1. Revisar handoff de TASK-268.
2. En el area de Membresias o Reportes, mostrar una seccion simple de seguimiento:
   - proximas a vencer;
   - vencidas.
3. Mostrar datos minimos:
   - cliente;
   - plan;
   - vencimiento;
   - estado;
   - dias restantes o dias vencida.
4. Agregar filtro simple de dias si el API lo soporta.
5. Publicar Web en Azure Static Web Apps si hubo cambios.

## Reglas de UX MVP

- Mantener layout actual.
- Usar textos claros:
  - `Proximas a vencer`
  - `Vencidas`
  - `Vence hoy`
  - `Vencio hace N dias`
- No agregar correo automatico.
- No usar `window.confirm`, `localStorage` ni `sessionStorage`.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Marcadores/textos de vencimiento publicados.
- No hay regresion visible en Operaciones, Mi empresa, Reportes ni Login.

## Handoff esperado

Actualizar `tasks/TASK-269-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de textos/markers publicados.
- Notas para QA.
