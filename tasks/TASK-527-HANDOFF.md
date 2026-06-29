Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Navegacion y alcance
Tarea: TASK-527 - Redefinir navegacion Mi empresa y flujo Enviar campanas

Resultado:
- Se redefine la navegacion objetivo del panel operativo.
- `Mi empresa` pasa a ser un grupo con submenus.
- La seccion externa actual `Comunicaciones` debe renombrarse a `Enviar campanas`.
- La configuracion de comunicaciones debe moverse dentro de `Mi empresa > Comunicaciones`.
- El envio real debe seguir bloqueado salvo decision explicita posterior de prueba controlada.

Decision de navegacion:
- Menu lateral principal:
  - `Atender cliente`
  - `Mi empresa`
    - `Overview`
    - `Membresias`
    - `Comunicaciones`
  - `Reportes`
  - `Enviar campanas`
- `Mi empresa` debe poder actuar como grupo expandible/colapsable o como item que abre por defecto `Overview` y muestra subopciones.

Mi empresa > Overview:
- Debe contener lo que hoy esta en la pantalla principal de `Mi empresa`:
  - estado del programa;
  - actualizado;
  - logo;
  - carga/preview de logo;
  - nombre;
  - correo;
  - telefono;
  - porcentaje de puntos;
  - aviso de accesos gestionados desde panel interno;
  - cambiar contrasena;
  - guardar configuracion.
- Objetivo:
  - administrar datos base de la empresa.

Mi empresa > Membresias:
- Debe contener todo lo relacionado con membresias y beneficios:
  - planes de membresia;
  - crear/editar plan;
  - beneficios de membresia;
  - crear/editar beneficio;
  - estados vacios de planes/beneficios;
  - acciones de actualizar/crear.
- Objetivo:
  - administrar oferta de membresias y beneficios de la empresa.

Mi empresa > Comunicaciones:
- Debe contener configuracion y plantillas de comunicaciones:
  - switches de correos operativos;
  - bienvenida al registrar cliente;
  - compra registrada;
  - canje/redencion;
  - beneficio/membresia;
  - configuracion de campañas promocionales, si aplica;
  - incluir puntos por defecto;
  - reply-to;
  - plantillas/preview base;
  - clientes/preferencias y bajas, si se mantiene como administracion.
- Objetivo:
  - configurar como se comunican los eventos automaticos y preparar el marco de campañas.
- No debe ser el lugar principal para ejecutar/envio de campañas puntuales.

Enviar campanas:
- Reemplaza el menu externo que hoy se llama `Comunicaciones`.
- Debe enfocarse en ejecutar campañas puntuales:
  - seleccionar comunicacion/promocion/campana;
  - ver preview;
  - listar clientes elegibles que no se hayan dado de baja;
  - marcar todos;
  - seleccionar algunos clientes;
  - ver conteo de seleccionados;
  - mostrar estado de envio real bloqueado por ahora;
  - explicar requisitos para envio real: baja, cuotas, dominio/sender aprobado y control server-side.
- Como hay pocos clientes, el primer flujo puede listar clientes directamente.
- Debe excluir visualmente clientes:
  - dados de baja de promociones;
  - sin correo;
  - suprimidos por rebote cuando exista ese estado.
- Para prueba caliente futura:
  - no activar desde esta tarea;
  - requiere decision separada Product / Architect / Release;
  - requiere limites bajos y confirmacion explicita.

Reglas de alcance:
- La reorganizacion es UI/local inicialmente.
- No se activan endpoints reales.
- No se activan correos reales.
- No se cambia ACS.
- No se cambia SQL.
- El boton de envio real debe seguir bloqueado hasta que una tarea explicita apruebe prueba controlada.

Implicaciones para tareas siguientes:
- Diseno / UX:
  - definir patron visual de submenu dentro de `Mi empresa`;
  - definir pantalla `Enviar campanas`;
  - evitar duplicar contenido entre `Mi empresa > Comunicaciones` y `Enviar campanas`.
- Web Dev:
  - mover la UI existente de comunicaciones a la nueva estructura;
  - renombrar menu externo a `Enviar campanas`;
  - crear seleccion local/mock de clientes elegibles con marcar todos/seleccion parcial;
  - preservar bloqueo de envio real.
- QA:
  - validar navegacion desktop/mobile;
  - validar que las secciones quedaron en el lugar correcto;
  - validar que no se envio nada real;
  - validar que clientes dados de baja/no aptos no aparezcan como elegibles para envio.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- Tarea documental/de decision.

Riesgos o pendientes:
- Riesgo de confusion si `Comunicaciones` y `Enviar campanas` duplican funciones.
- Riesgo de que usuarios crean que el envio real esta activo; la UI debe mantener copy claro de bloqueo.
- Pendiente decidir en tarea separada si se hara prueba caliente real con pocos clientes.

Siguiente recomendado:
- TASK-528 Diseno / UX: disenar submenus de `Mi empresa` y pantalla `Enviar campanas`.
- TASK-529 Web Dev: implementar UI local/mock.
- TASK-530 QA: validar localmente navegacion y bloqueo de envio.
- TASK-531 Product / Architect / Release: decidir alcance de prueba caliente para envio real, solo si se quiere activar.

Movimiento de tablero sugerido:
- TASK-527 a Done / Needs Review.
