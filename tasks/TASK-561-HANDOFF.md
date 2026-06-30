Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Promociones
Tarea: TASK-561 - Definir alcance MVP real de envio de promociones

Resultado:
- Se define el alcance MVP real para envio de promociones/campanas.
- Se confirma que promociones son una fase separada de correos operativos.
- Se mantiene el sender actual de Azure/ACS Email por costos en la primera prueba controlada.
- Se confirma que no se enviara desde correos ni dominios de empresas en MVP.
- Se define una primera fase piloto con volumen bajo, seleccion manual y baja promocional obligatoria.

Decision principal:
- No se debe simplemente desbloquear el boton `Enviar campañas`.
- Antes de enviar promociones reales, el sistema debe tener:
  - destinatarios elegibles;
  - baja promocional server-side;
  - limites por campana/empresa;
  - confirmacion explicita antes de enviar;
  - historial por destinatario;
  - proteccion para no afectar correos operativos.

Alcance MVP aprobado:
1. Crear promocion/campana
- La empresa puede crear un borrador de promocion.
- Campos MVP:
  - nombre interno;
  - asunto;
  - mensaje/cuerpo en texto controlado;
  - incluir puntos disponibles: si/no;
  - estado: `draft`, `ready`, `sending`, `sent`, `cancelled`, `failed`.
- Fuera de esta primera fase:
  - imagenes/banner;
  - HTML libre;
  - programacion futura;
  - plantillas avanzadas;
  - segmentacion compleja.

2. Seleccionar destinatarios
- MVP: seleccion manual desde lista de clientes de la empresa.
- Mostrar solo clientes con:
  - email valido;
  - no dados de baja de promociones;
  - no suprimidos por rebote/fallo permanente si existe marca.
- Permitir:
  - seleccionar algunos clientes;
  - marcar todos los elegibles dentro del limite permitido;
  - ver conteo de seleccionados.
- No enviar a multiples destinatarios visibles en un solo correo.
- Cada destinatario debe recibir su propio correo.

3. Incluir puntos disponibles
- Si la empresa activa `incluir puntos disponibles`, el sistema toma snapshot de puntos al preparar/enviar.
- El correo debe mostrar un texto tipo:
  - `Tienes {points.currentBalance} puntos disponibles en {company.name}.`
- Si no hay saldo o no se puede calcular, no bloquear la campana; mostrar copy neutro o no incluir el bloque.

4. Baja promocional
- Obligatoria antes de enviar promociones reales.
- Cada correo promocional debe incluir link o mecanismo de baja.
- La baja:
  - solo aplica a promociones/marketing;
  - no elimina puntos;
  - no elimina membresias;
  - no elimina beneficios;
  - no bloquea correos operativos criticos.
- El backend debe respetar la baja server-side, no solo ocultarla en UI.

5. Limites iniciales
- Mientras se use Azure Managed Domain actual:
  - piloto promocional muy bajo;
  - maximo recomendado: 5 destinatarios por campana;
  - maximo recomendado: 10 correos promocionales por hora global, respetando limite ACS;
  - no habilitar a todas las empresas sin decision posterior.
- Con custom domain futuro:
  - se puede revisar limite mayor segun TASK-512.
- El sistema debe bloquear si se exceden limites configurados.

6. Confirmacion de envio
- Antes de enviar, mostrar resumen:
  - nombre de campana;
  - asunto;
  - cantidad de destinatarios;
  - empresa;
  - si incluye puntos;
  - aviso de que se enviaran correos reales.
- Requerir confirmacion explicita.
- Usar idempotency key para evitar doble envio por doble click o retry.

7. Historial basico
- Registrar:
  - campana;
  - destinatarios;
  - email destino;
  - snapshot de puntos si aplica;
  - estado por destinatario: `pending`, `sent`, `failed`, `skipped`;
  - motivo de skip/fallo;
  - provider_message_id si existe.
- La UI debe mostrar al menos conteos:
  - enviados;
  - fallidos;
  - omitidos;
  - total seleccionados.

Sender / remitente:
- Mantener sender actual de Azure/ACS Email de Punto Club en esta fase por costos.
- No enviar desde Gmail/Outlook/correo propio de empresas.
- No suplantar dominio de empresas.
- Display name recomendado para promos:
  - `Punto Club - {NombreEmpresa}` si ACS/configuracion lo permite;
  - si no, mantener `Punto Club` y poner empresa claramente en subject/cuerpo.
- `reply-to` puede ser correo de empresa si esta configurado y validado.

Flujo funcional MVP:
1. Empresa entra a `Enviar campañas`.
2. Crea/edita borrador promocional.
3. Revisa preview.
4. Selecciona destinatarios elegibles.
5. Confirma envio real.
6. Sistema envia uno por uno, respetando limites.
7. Sistema registra resultado por destinatario.
8. Empresa ve resumen/historial.

Reglas de bloqueo:
- Bloquear envio si:
  - promociones no estan habilitadas por feature flag;
  - no existe mecanismo de baja promocional;
  - no hay destinatarios elegibles;
  - se excede limite por campana o global;
  - no hay configuracion ACS disponible;
  - la campana no esta en estado enviable;
  - falta confirmacion explicita.

Fuera de alcance de este MVP:
- Envio masivo abierto.
- Envio desde dominio de cada empresa.
- Custom domain ACS.
- Event Grid/delivery events completos.
- Imagenes/banner.
- Editor HTML libre.
- Programacion futura.
- Segmentacion avanzada.
- A/B testing.
- Adjuntos.
- Automatizaciones recurrentes.

Dependencias recomendadas:
- SQL DEV:
  - migracion para preferencias promocionales, baja, campanas, destinatarios y mensajes.
- Backend/API:
  - endpoints de campanas, destinatarios, preview, baja promocional y envio controlado.
- Web Dev:
  - UI real de `Enviar campañas`, seleccion manual, preview, confirmacion e historial.
- Diseno / UX:
  - copy de baja promocional, confirmacion de envio y plantillas.
- QA:
  - mocks locales;
  - QA publicado sin envio real;
  - luego envio real controlado a mailbox aprobado.
- Infra:
  - confirmar limites actuales ACS y si conviene custom domain antes de abrir a mas empresas.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- Tarea documental/de decision.

Riesgos:
- El Azure Managed Domain tiene limites bajos y no es ideal para promociones reales.
- Promociones sin baja pueden afectar reputacion y cumplimiento.
- Promociones sobre el mismo sender pueden afectar entregabilidad de correos operativos si se abusa.
- Envio accidental masivo debe prevenirse por backend, no solo UI.

Siguiente recomendado:
- Crear tareas separadas para:
  - SQL DEV: modelo/migracion promocional MVP.
  - Backend/API: contratos y envio promocional controlado.
  - Diseno / UX: copy/flujo de baja, preview y confirmacion.
  - Web Dev: UI real de crear/enviar campanas.
  - QA local: validacion con mocks y sin envios reales.

Movimiento de tablero sugerido:
- TASK-561 a Done.
