# TASK-266 - Web de reportes para eventos de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Round: 13
Depende de: TASK-265
Estado: Assigned

## Objetivo

Mostrar correctamente eventos de membresias en la pantalla de Reportes.

## Contexto

El usuario ya puede operar clientes, puntos y membresias. Reportes debe ayudar a revisar actividad real, incluyendo activaciones de membresia y usos de beneficios.

## Alcance

1. Revisar handoff de TASK-265.
2. En Reportes, incluir etiquetas legibles para eventos de membresias.
3. Si el filtro de tipo lo permite, agregar opcion para filtrar membresias o incluirlas en la opcion correspondiente.
4. Validar que Exportar CSV incluya eventos de membresias sin romper columnas.
5. Publicar Web en Azure Static Web Apps si hubo cambios.

## Reglas de UX MVP

- Mantener el layout actual.
- Usar textos claros:
  - `Membresia activada`
  - `Beneficio usado`
- No agregar graficos nuevos.
- No usar `window.confirm`, `localStorage` ni `sessionStorage`.

## Validaciones minimas

- Checks Web pasan.
- Sitio publicado carga.
- Reportes mantiene consultas existentes.
- Eventos de membresias tienen textos legibles.
- CSV sigue descargando.

## Fuera de alcance

- Redisenar Reportes.
- Nuevos dashboards.
- Correos de vencimiento.

## Handoff esperado

Actualizar `tasks/TASK-266-HANDOFF.md` con:

- Resultado.
- URL publicada.
- Evidencia de checks.
- Evidencia de marcadores/textos publicados.
- Notas para QA.
