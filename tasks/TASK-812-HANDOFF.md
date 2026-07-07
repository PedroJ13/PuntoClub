Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Definicion funcional
Tarea completada: TASK-812 - Definir KPIs reales del centro de comunicaciones

Resultado:
- Se define el significado funcional de los KPIs reales del centro de comunicaciones.
- No se implemento codigo.
- No se cambio API.
- No se cambio Web.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Decision general:
- Los KPIs deben mostrar datos reales de la empresa autenticada.
- No deben mostrar valores estaticos ni placeholders.
- Deben recalcularse al cargar/actualizar el centro de comunicaciones.
- Si no se pueden cargar, Web debe mostrar estado seguro como `-` o mensaje breve, nunca numeros falsos.
- Los datos deben derivarse server-side desde la sesion autenticada; el frontend no debe ser autoridad de `companyId`.

KPI 1: Operativos
- Definicion MVP:
  - cantidad de tipos de correos operativos configurados como activos para la empresa.
- Tipos considerados:
  - bienvenida al registrar cliente;
  - compra registrada;
  - canje/redencion;
  - beneficio o membresia, si existe configuracion operativa para ese tipo;
  - otro tipo operativo existente en la configuracion actual si Backend ya lo modela.
- Regla:
  - contar solo los operativos activos/habilitados.
  - si no hay configuracion persistida todavia, Backend debe usar defaults reales del sistema, no un numero quemado en Web.
- Copy sugerido:
  - label: `Operativos`
  - tooltip futuro: `Correos automaticos activos para acciones del programa.`

KPI 2: Suscritos
- Definicion MVP:
  - cantidad de clientes de la empresa con email valido y preferencia promocional activa.
- Regla SQL/API:
  - cliente pertenece a empresa autenticada;
  - email no nulo/no vacio;
  - email con formato minimo valido segun regla existente;
  - `promotional_status` efectivo = `subscribed`.
- Si no existe preferencia explicita, el estado efectivo actual se considera `subscribed`, segun comportamiento vigente.
- No contar clientes sin email.
- No contar clientes dados de baja o suprimidos.
- Copy:
  - label: `Suscritos`

KPI 3: Bajas
- Definicion MVP:
  - cantidad de clientes de la empresa con baja promocional efectiva.
- Regla:
  - contar clientes cuyo `promotional_status` efectivo sea `unsubscribed`.
  - no contar `suppressed` como baja normal; si existen suprimidos, se pueden reportar en metadatos internos o tarea futura.
- Copy:
  - label: `Bajas`

KPI 4: Promociones
- Definicion MVP:
  - estado operativo global del envio promocional real.
- Valor esperado:
  - `Pausadas` cuando el feature flag/setting de envio promocional real este desactivado.
  - `Activas` cuando el envio promocional real este habilitado.
- Razon:
  - Para el usuario del piloto, este KPI responde si se pueden enviar promociones reales, no cuantas campañas existen.
- Metadatos recomendados opcionales:
  - `campaignDraftCount`;
  - `campaignSentCount`;
  - `promotionalSendEnabled`;
  - `maxRecipientsPerSend`.
- Web puede seguir mostrando solo `Pausadas`/`Activas` en el KPI principal y usar metadatos despues.

Contrato API recomendado:
- Endpoint autenticado:
  - `GET /api/companies/{companyId}/communications/summary`
- Autoridad:
  - backend debe validar que `{companyId}` coincide con empresa de la sesion o derivarlo internamente.
- Respuesta sugerida:
  - `operationalActiveCount: number`
  - `promotionalSubscribedCount: number`
  - `promotionalUnsubscribedCount: number`
  - `promotionalSendStatus: "paused" | "active"`
  - `promotionalSendStatusLabel: "Pausadas" | "Activas"`
  - `campaignDraftCount?: number`
  - `campaignSentCount?: number`
  - `generatedAt: ISO timestamp`

Reglas de seguridad:
- No exponer correos, nombres ni listas de clientes en el endpoint de resumen.
- No exponer secrets, flags internos crudos ni nombres de app settings.
- No confiar en conteos del frontend.
- No enviar correos reales.

Criterios Backend/API:
- Implementar calculo server-side por empresa autenticada.
- Usar la misma regla de elegibilidad promocional que el modulo de destinatarios cuando aplique a `Suscritos`.
- Incluir tests para:
  - clientes sin email no cuentan como suscritos;
  - clientes con baja cuentan en bajas;
  - clientes sin preferencia explicita cuentan como suscritos si tienen email valido;
  - `Promociones` refleja flag/setting de envio real;
  - aislamiento por empresa.

Criterios Web:
- Reemplazar valores estaticos actuales:
  - `5`;
  - `128`;
  - `9`;
  - `Pausadas` hardcodeado.
- Mostrar loading discreto al cargar.
- Mostrar `-` o mensaje seguro si falla el endpoint.
- Actualizar al entrar al centro de comunicaciones y al presionar actualizar si aplica.
- No mostrar numeros falsos durante error o carga.

Criterios QA:
- Validar que los KPIs ya no son estaticos.
- Validar datos mock/local coherentes.
- Validar que Web no rompe mobile/desktop.
- Validar que error de API no muestra datos falsos.
- No tocar Azure SQL salvo tarea posterior explicita.
- No enviar correos reales.

Uso Azure SQL:
- No.
- Motivo: definicion funcional solamente.

P0/P1:
- Ninguno.

Riesgos o pendientes:
- Si la configuracion de correos operativos no esta totalmente persistida por tipo, Backend debe documentar los defaults reales usados para `Operativos`.
- Si existen estados `suppressed`, queda pendiente decidir si se agrega KPI separado futuro.

Siguiente recomendado:
- Ejecutar TASK-813 con Backend/API.
- Ejecutar TASK-814 con Web Dev.
- Ejecutar TASK-815 con QA local.
