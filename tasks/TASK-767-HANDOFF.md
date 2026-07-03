Equipo: QA
Modo de ejecucion: Datos / Validacion post-limpieza publicada
Tarea completada: TASK-767 - Validar limpieza publicada de campanas promocionales

Estado:
- Bloqueada / no ejecutable.

Archivos cambiados:
- `tasks/TASK-767-HANDOFF.md`

Ambiente:
- No se ejecuto validacion publicada post-limpieza porque TASK-766 no aplico cambios.

Verificacion ejecutada:
- Revision del resultado de TASK-766.

Resultado:
- No hay limpieza publicada que validar.
- TASK-766 quedo detenida antes de `@DryRun = 0`.
- No hubo `COMMIT`.
- No se borraron campanas ni dependencias.
- No se enviaron correos reales.

P0/P1:
- P1 pendiente para release de limpieza: resolver discrepancia entre el criterio de correo `pj13eros@hotmail.com` y la evidencia SQL del recipient reciente de la campana conservada.

P2/P3:
- Ninguno.

Uso Azure SQL:
- No desde QA.
- Motivo: no correspondia validar post-limpieza porque no hubo apply.

Riesgos o pendientes:
- Si Product autoriza un nuevo apply, QA debe revalidar despues:
  - que solo quede `Nuevo - Nueva Bebida`;
  - que conserve imagen/preview;
  - que no aparezcan campanas de prueba;
  - que clientes/puntos/compras/canjes/membresias/preferencias sigan intactos;
  - que no se hayan enviado correos.

Siguiente recomendado:
- Esperar una tarea posterior de apply aprobada con la discrepancia resuelta o aceptada explicitamente.
