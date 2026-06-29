Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Email sender
Tarea: TASK-511 - Decidir estrategia de remitente y alcance MVP de correos a clientes

Resultado:
- Decision tomada: en MVP, los correos a clientes deben enviarse usando el sender actual de Azure/ACS Email que Punto Club ya viene usando, no directamente desde el dominio/correo de cada empresa.
- Se mantiene el sender actual por control de costos, menor complejidad operativa y porque ya existe experiencia previa con esa ruta.
- Los correos deben mostrar claramente la empresa relacionada en el nombre visible, encabezado y cuerpo del mensaje.
- El `reply-to` puede ser el correo de la empresa solo si esta configurado y validado como correo de contacto.
- La estrategia de envio directo desde dominios de empresas queda diferida para una fase posterior.

Decision de remitente MVP:
- Remitente tecnico:
  - sender actual de Azure/ACS Email ya configurado para Punto Club.
  - No crear ni migrar a un nuevo sender/dominio para esta fase salvo que Infra lo recomiende por entregabilidad o costo.
- Nombre visible sugerido:
  - Operativos: `Punto Club`
  - Promocionales: `Punto Club - {NombreEmpresa}` o `{NombreEmpresa} via Punto Club`, sujeto a validacion de deliverability.
- Reply-to:
  - correo de contacto de la empresa si existe y esta validado;
  - si no existe, usar correo de soporte/contacto de Punto Club.

Por que no enviar desde el correo de cada empresa en MVP:
- Requiere verificar dominio por empresa.
- Requiere configurar SPF/DKIM/DMARC o equivalentes por dominio.
- Aumenta soporte operativo y probabilidad de errores DNS.
- Puede afectar entregabilidad si una empresa tiene mala reputacion o configuracion deficiente.
- Complica control de rebotes, quejas, bajas y reputacion.

Separacion operativos/promocionales:
- Correos operativos:
  - bienvenida;
  - compra registrada;
  - canje/redencion;
  - beneficio utilizado;
  - membresia, si aplica.
- Correos promocionales:
  - campanas creadas por empresas;
  - promociones puntuales;
  - anuncios comerciales.
- Los promocionales deben tener baja visible y respetar preferencias.
- Los operativos criticos pueden mantenerse activos mientras el cliente participe en el programa.

Alcance MVP:
- Usar ACS Email existente si Infra confirma capacidad, costos y limites.
- Enviar desde el sender actual de Azure/ACS Email que ya usa Punto Club.
- Incluir empresa en subject/cuerpo, no suplantar remitente.
- Usar plantillas controladas.
- Permitir reply-to de empresa.
- Aplicar limites por empresa antes de habilitar campanas:
  - limite diario inicial;
  - limite por campana;
  - proteccion contra reenvios accidentales;
  - aprobacion/confirmacion antes de enviar.

Limites iniciales recomendados:
- Campanas promocionales:
  - no habilitar envio masivo sin TASK-512 de Infra;
  - empezar con un limite bajo por empresa/dia;
  - registrar cada destinatario y resultado;
  - bloquear envio si no hay mecanismo de baja promocional.
- Operativos:
  - enviar best-effort;
  - no bloquear compra/canje/registro si falla correo;
  - registrar fallo para diagnostico.

Dependencias:
- Infra debe confirmar:
  - sender actual de Azure/ACS Email;
  - sender address actualmente permitido;
  - reputacion/deliverability;
  - costos por volumen;
  - limites de ACS Email;
  - manejo de rebotes/quejas si esta disponible;
  - recomendacion de dominio/subdominio separado para promociones.
- SQL DEV debe modelar:
  - preferencias;
  - bajas;
  - campanas;
  - envios;
  - snapshots de puntos.
- Backend/API debe definir contratos y seguridad server-side.
- Diseno / UX debe definir copy y panel de configuracion.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- Tarea documental/de decision.

Riesgos o pendientes:
- Riesgo de reputacion si operativos y promocionales comparten la misma identidad de envio sin controles.
- Riesgo legal/entregabilidad si promociones no tienen baja.
- Riesgo de costo si no hay limites por empresa.
- Pendiente evaluacion tecnica de Infra en TASK-512.

Siguiente recomendado:
- Crear/ejecutar TASK-512 con Infra para evaluar ACS Email, dominio, costos, limites y deliverability.
- Crear/ejecutar TASK-513 con SQL DEV para modelo de datos.
- Crear/ejecutar TASK-514/TASK-515 con Backend/API para contratos/eventos.
- Crear/ejecutar TASK-516/TASK-517 con Diseno / UX para panel y plantillas.

Movimiento de tablero sugerido:
- TASK-511 a Done / Needs Review.
