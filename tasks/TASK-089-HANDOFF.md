Equipo:
Product / Architect / Release

Tarea completada:
TASK-089 - Preparar backlog post-piloto inmediato.

Archivos cambiados:
- `docs/POST_PILOT_BACKLOG.md`
- `tasks/TASK-089-HANDOFF.md`

Estructura propuesta:
- Bloqueos P0/P1.
- Mejoras P2 antes de ampliar piloto.
- Pulido P3.
- Post-MVP.
- Decisiones de producto.
- Decisiones operativas Azure/SQL.

Plantilla de tarea:
- Se agrego en `docs/POST_PILOT_BACKLOG.md`.
- Incluye equipo, contexto, objetivo, alcance, no tocar, dependencias y handoff esperado.

Criterios de priorizacion:
- Hotfix:
  - P0/P1;
  - integridad de datos;
  - compra/redencion bloqueada;
  - ambiente publicado roto;
  - requiere QA despues del deploy.
- Siguiente batch:
  - P2 repetidos;
  - friccion antes de ampliar piloto;
  - ajustes operativos no urgentes.
- Diferir:
  - P3 sin impacto operativo;
  - post-MVP;
  - decisiones sin evidencia suficiente;
  - cambios de complejidad alta para el aprendizaje esperado.

Recomendacion de proceso:
- Usar `docs/POST_PILOT_BACKLOG.md` como bandeja de clasificacion despues del primer piloto.
- No abrir hotfixes sin severidad y evidencia.
- No mezclar P0/P1 con mejoras P2/P3 en el mismo batch.
- Pulso debe analizar patrones despues de la sesion piloto.
- Product / Architect / Release decide si seguir, pausar o ampliar piloto con base en severidad, no por volumen de notas.

Riesgos o pendientes:
- No hay hallazgos reales cargados todavia.
- La estructura debe alimentarse despues de TASK-086/TASK-087 y/o la sesion piloto real.
- No se implemento codigo.
- No se cambio Azure.
- No se cerraron decisiones sin evidencia de piloto.

Siguiente recomendado:
- Ejecutar TASK-086 y TASK-087.
- Despues de la sesion piloto, usar TASK-088/Pulso para analizar senales y alimentar este backlog.
