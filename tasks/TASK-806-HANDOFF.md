Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Limpieza datos QA
Tarea completada: TASK-806 - Definir limpieza de datos QA del release cumpleanos

Resultado:
- Se define alcance controlado para limpieza de datos QA creados durante el release de cumpleanos.
- No se ejecuto SQL.
- No se modificaron datos.
- No se cambio API, Web, ACS, sender ni flags.
- No se enviaron correos reales.

Datos QA candidatos a limpiar:
- Clientes QA sin correo creados durante TASK-785:
  - un cliente QA con fecha de nacimiento;
  - un cliente QA sin fecha de nacimiento;
  - uno de estos fue actualizado con fecha durante la prueba.
- Cliente QA sin correo creado durante TASK-802:
  - fecha de nacimiento `1990-07-07`;
  - creado solo para activar alerta sin disparar correos operativos.
- Campana QA tipo `cumpleanos` sin imagen creada durante TASK-785.
- Registros promocionales asociados a esa campana QA solo si existen y son de prueba.

Criterios obligatorios antes de borrar:
- SQL DEV debe ejecutar consulta previa read-only.
- La consulta previa debe mostrar:
  - conteo de clientes QA candidatos;
  - detalle minimo: `customer_id`, `company_id`, nombre, telefono, email, fecha de nacimiento, fechas de creacion/actualizacion;
  - conteo de campanas QA candidatas;
  - detalle minimo: `campaign_id`, `company_id`, nombre, asunto, tipo, estado, imagen asociada si existe, fechas de creacion/actualizacion;
  - conteo de registros dependientes o asociados que se eliminarian.
- La limpieza debe correr primero en `dry_run = 1`.
- Solo aplicar `dry_run = 0` si los conteos y detalles coinciden con datos QA esperados.
- Usar transaccion y rollback plan.
- Documentar validacion posterior.

Reglas de seguridad:
- No borrar clientes reales.
- No borrar puntos reales.
- No borrar compras reales.
- No borrar canjes reales.
- No borrar membresias.
- No borrar preferencias promocionales reales.
- No borrar eventos de baja reales.
- No borrar campanas reales.
- No borrar imagenes productivas.
- No borrar la campana productiva `Nuevo - Nueva Bebida`.
- No borrar la campana comun real `Energía para el Lunes` u otras campanas visibles no QA.
- No tocar ACS, sender, app settings ni flags.

Orden recomendado de limpieza:
- Identificar campanas QA tipo `cumpleanos` creadas por la validacion TASK-785/TASK-802.
- Si existen registros promocionales asociados a esas campanas QA, limpiarlos primero.
- Limpiar imagenes asociadas solo si la campana QA tiene imagen y se confirma que no es productiva.
- Limpiar la campana QA.
- Identificar clientes QA sin correo creados por estas pruebas.
- Antes de borrar clientes QA, validar que no tengan:
  - compras;
  - canjes;
  - saldo/puntos reales;
  - membresias;
  - beneficios;
  - actividad no QA.
- Si alguno tiene datos transaccionales, no borrarlo sin una decision adicional.

Criterio de identificacion sugerido:
- Usar combinacion de:
  - nombres con prefijo o texto QA observado en los handoffs;
  - email nulo o vacio;
  - fecha de nacimiento usada en pruebas, incluyendo `1990-07-07`;
  - ventana temporal del release de cumpleanos;
  - `company_id` de la empresa donde QA ejecuto pruebas;
  - campanas tipo `cumpleanos` con nombre/asunto QA y sin imagen.
- No usar solamente fecha de nacimiento como criterio de borrado.
- No usar solamente falta de correo como criterio de borrado.

Evidencia de origen:
- TASK-785 reporto creacion de:
  - dos clientes QA sin correo;
  - una campana QA tipo `cumpleanos` sin imagen.
- TASK-802 reporto creacion de:
  - un cliente QA sin correo con fecha `1990-07-07`.

Uso Azure SQL:
- No.
- Motivo: esta tarea solo define la decision/alcance de limpieza.

P0/P1:
- Ninguno.

Riesgos o pendientes:
- La identificacion exacta requiere consulta SQL previa.
- Si los nombres reales de los clientes QA no son suficientemente distintivos, SQL DEV debe detenerse y pedir criterio adicional antes de aplicar `dry_run = 0`.

Siguiente recomendado:
- Ejecutar TASK-807 con SQL DEV para preparar script seguro y correr primero `dry_run = 1`.
