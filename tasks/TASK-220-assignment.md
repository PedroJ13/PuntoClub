# TASK-220 - Preparar base limpia para prueba completa de empresa

Equipo responsable: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Contexto

Product Owner quiere hacer una prueba completa del flujo real desde una base limpia, entrando como primera empresa sin clientes ni operaciones previas.

La Azure SQL Database existente es `sqlserver-pj13-brazil/sql-db-puntoclub`. No crear otra base de datos.

Esta tarea puede eliminar datos de prueba, por lo que debe ejecutarse con cuidado, dejando evidencia y evitando borrar estructura, migraciones o configuracion tecnica necesaria.

## Objetivo

Preparar la base de datos para una prueba completa controlada:

- mantener una unica empresa inicial utilizable para login;
- dejar esa empresa sin clientes, compras, redenciones, historial operativo y datos de prueba relacionados;
- limpiar solicitudes/invitaciones/sesiones antiguas que puedan confundir la prueba;
- conservar configuracion tecnica, tablas, constraints, indices, migraciones y usuarios.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/DATA_MODEL.md` y cualquier handoff reciente necesario.
- Identificar tablas con datos operativos de:
  - empresas;
  - usuarios/accesos de empresa;
  - solicitudes de registro;
  - invitaciones;
  - sesiones;
  - clientes;
  - compras;
  - redenciones/canjes;
  - auditoria operativa;
  - intentos/limites de auth.
- Antes de borrar datos:
  - hacer conteo por tabla afectada;
  - documentar la empresa/cuenta que quedara como empresa inicial;
  - confirmar si hace falta conservar password/acceso existente o recrear acceso controlado.
- Ejecutar limpieza en orden seguro respetando llaves foraneas.
- No borrar tablas, constraints, indices, stored procedures, migraciones ni usuarios SQL.
- No imprimir passwords, hashes, tokens, connection strings ni secretos.
- Si no hay permiso/firewall/credenciales para ejecutar SQL, dejar la tarea bloqueada con el motivo exacto y el SQL propuesto sin ejecutarlo.

## Criterios de aceptacion

- Existe una empresa inicial activa para que Product Owner pueda iniciar sesion.
- La empresa inicial no tiene clientes ni operaciones previas.
- No quedan solicitudes/invitaciones/sesiones antiguas que confundan la prueba.
- La API/Web deben seguir pudiendo operar con la empresa inicial despues de la limpieza.
- Se entregan conteos antes/despues de las tablas limpiadas, sin datos sensibles.

## Entregable

Crear o actualizar `tasks/TASK-220-HANDOFF.md` con:

- Resultado: completado, bloqueado o no aprobado.
- Empresa/cuenta inicial conservada, redaccionando datos sensibles si aplica.
- Tablas revisadas.
- Conteos antes/despues.
- SQL ejecutado o resumen seguro del procedimiento.
- Validacion posterior recomendada para Backend/API o PO Test.
- Riesgos o pendientes.
