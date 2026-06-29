Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / UX navegacion
Tarea: TASK-528 - Disenar submenus de Mi empresa y pantalla Enviar campanas

Resultado:
- Se define una navegacion secundaria para `Mi empresa` que evita mezclar perfil, logo, acceso y comunicaciones en una sola pantalla larga.
- Se define `Enviar campanas` como vista principal dentro del centro de comunicaciones, separada de configuracion, clientes/preferencias e historial.
- No se cambia el alcance de envio real: campanas siguen bloqueadas hasta dominio, bajas, cuotas y backend real.

Submenu propuesto para Mi empresa:
- `Perfil`
  - Datos visibles de empresa.
  - Estado del programa.
  - Porcentaje de puntos.
  - Guardar configuracion.
- `Logo`
  - Preview actual.
  - Seleccion/subida de logo.
  - Mensajes de validacion.
- `Acceso`
  - Cambio de contrasena de empresa.
  - Campos de contrasena actual, nueva y confirmacion.
- `Comunicaciones`
  - Resumen corto del canal de correos.
  - Entrada directa a `Enviar campanas`.
  - Estado visible de promociones protegidas/bloqueadas.

Reglas UX para Mi empresa:
- Mantener el menu lateral principal igual.
- El submenu debe ser local a `Mi empresa`, no abrir rutas nuevas.
- Al entrar a `Mi empresa`, iniciar en `Perfil`.
- `Acceso` no debe mezclarse con datos fiscales/empresa para reducir ruido.
- `Comunicaciones` desde Mi empresa debe orientar, no duplicar todo el centro.

Pantalla Enviar campanas:
- Ubicacion: seccion principal `Comunicaciones`.
- Submenu local:
  - `Enviar campanas`
  - `Configuracion`
  - `Clientes`
  - `Historial`
- `Enviar campanas` debe contener:
  - nombre interno;
  - asunto;
  - destinatarios;
  - incluir puntos disponibles;
  - mensaje;
  - preview;
  - envio real bloqueado.
- El preview debe quedar junto al formulario para validar asunto, variables, puntos y baja antes de enviar.

Copy recomendado:
- Entrada desde Mi empresa:
  - `Configura correos y prepara campanas sin activar envios reales.`
- Enviar campanas:
  - `Prepara una campana local, revisa destinatarios y valida el preview antes de habilitar envios reales.`
- Bloqueo de envio:
  - `El envio real requiere dominio promocional, baja y cuotas.`

Estados esperados:
- `Enviar campanas` visible y usable localmente.
- Boton de envio real deshabilitado.
- Campanas promocionales bloqueadas en configuracion.
- Clientes dados de baja visibles como no destinatarios promocionales.

Verificacion ejecutada:
- Lectura de TASK-518/TASK-519/TASK-520/TASK-521.
- Revision de estructura actual de `Mi empresa` y `Comunicaciones` en `app/index.html`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.

Riesgos o pendientes:
- Falta validacion visual final tras implementacion Web.
- Falta backend real para guardar vistas/configuracion/campanas.
- Falta QA de navegacion con sesion real cuando se publique.

Siguiente recomendado:
- Web Dev TASK-529 implementa submenu local y vista `Enviar campanas` sin cambiar comportamiento de envio.

Movimiento de tablero sugerido:
- TASK-528 a Done / Needs Review.
