Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Limpieza datos promocionales
Tarea completada: TASK-756 - Definir limpieza controlada de marcas de envio promocional de pruebas

Resultado:
- Se define una limpieza controlada para dejar clientes libres de marcas de envio promocional generadas durante pruebas.
- Alcance aprobado: todas las empresas del ambiente actual, porque los envios promocionales reales recientes fueron pruebas controladas del piloto.
- La limpieza debe afectar solo tablas promocionales necesarias para quitar bloqueo por envio previo.
- No se debe borrar clientes, puntos, compras, canjes, membresias, campanas/plantillas, imagenes de campana ni preferencias reales de baja.
- No se debe enviar correos reales.
- No se debe cambiar API, Web, ACS, sender ni flags.

Alcance funcional aprobado:
- Dejar a los clientes elegibles nuevamente disponibles para seleccionar y enviar en pruebas futuras.
- Quitar marcas que hacen que una combinacion `campaignId + customerId` se interprete como ya enviada/incluida.
- Mantener las campanas/plantillas existentes para que puedan seguir siendo seleccionadas o editadas.
- Si una campana quedo en estado `sent`, `failed` o `sending` por pruebas, SQL DEV puede resetearla a `draft` solo si tiene destinatarios de prueba limpiados y siempre documentando conteos antes/despues.

Tablas identificadas:
- `dbo.PromotionalCampaignRecipients`
  - Tabla principal de marcas por campana/cliente.
  - Contiene `campaign_id`, `company_id`, `customer_id`, `recipient_email`, `status`, `sent_at`, `provider_message_id`, `last_error`, etc.
  - Tiene unique index `UX_PromotionalCampaignRecipients_campaign_customer`, que explica el bloqueo anti-duplicado.
- `dbo.PromotionalCampaigns`
  - Contiene campanas/plantillas y estado (`draft`, `ready`, `sending`, `sent`, `cancelled`, `failed`).
  - Puede requerir reset de estado/fechas si una campana de prueba queda como enviada.
- `dbo.CustomerPromotionalEmailPreferences`
  - No tocar, salvo decision explicita separada.
  - Mantiene suscripcion/baja/supresion promocional.
- `dbo.PromotionalUnsubscribeEvents`
  - No tocar, salvo decision explicita separada.
  - Mantiene trazabilidad de bajas.
- `dbo.PromotionalCampaignImages`
  - No tocar.
  - Mantiene imagenes asociadas a campanas.

Reglas de limpieza:
- Permitido:
  - eliminar filas de `dbo.PromotionalCampaignRecipients` asociadas a pruebas promocionales;
  - resetear en `dbo.PromotionalCampaigns` el estado de campanas afectadas por pruebas a `draft`, limpiar `confirmed_at` y `sent_at` si corresponde, y actualizar `updated_at`;
  - hacerlo dentro de transaccion;
  - producir conteos y evidencia antes/despues.
- Prohibido:
  - borrar filas de `dbo.Customers`;
  - modificar saldos/puntos o movimientos;
  - modificar compras/canjes;
  - modificar membresias/beneficios;
  - borrar campanas/plantillas;
  - borrar imagenes;
  - cambiar `CustomerPromotionalEmailPreferences`;
  - borrar `PromotionalUnsubscribeEvents`;
  - cambiar feature flags o configuracion ACS/sender.

Alcance de empresas:
- Aplicar a todas las empresas del ambiente actual, salvo que SQL DEV detecte evidencia clara de envios promocionales no relacionados con pruebas.
- Si SQL DEV detecta registros antiguos o dudosos, debe reportarlos y no borrarlos sin decision adicional.

Requisitos para TASK-757:
- Preparar script SQL operativo seguro, preferiblemente en `database/operations/` o ruta equivalente de scripts operativos.
- El script debe incluir:
  - `SELECT` previo con conteos por empresa, campana, estado y destinatario;
  - detalle suficiente de campañas afectadas (`company_id`, `campaign_id`, nombre, estado, conteo recipients);
  - respaldo logico/evidencia exportable antes del cambio, al menos como query de snapshot;
  - transaccion explicita;
  - `DELETE` controlado de `dbo.PromotionalCampaignRecipients`;
  - `UPDATE` controlado de `dbo.PromotionalCampaigns` solo para campañas afectadas por los recipients eliminados;
  - validacion posterior con conteos en cero para marcas limpiadas;
  - rollback plan antes de ejecutar en Azure SQL.
- No ejecutar contra Azure SQL sin aprobacion de Infra/SQL DEV y sin respetar `docs/AZURE_SQL_COST_GUARDRAILS.md`.

Validacion esperada para TASK-758:
- Verificar que clientes elegibles vuelven a estar seleccionables para pruebas de promociones.
- Verificar que no quedan bloqueados como ya enviados para campanas de prueba.
- Verificar que clientes, puntos, compras, canjes, membresias y bajas promocionales no fueron alterados.
- Verificar en UI que `Enviar campanas` permite seleccionar destinatarios elegibles.
- No enviar correos reales salvo autorizacion explicita del Product Owner.

Uso Azure SQL:
- No.
- Motivo: decision de alcance y revision de estructura desde repo local; no se consultaron ni modificaron datos reales.

Riesgos o pendientes:
- Si existen envios promocionales que no fueron pruebas, una limpieza global podria borrar trazabilidad real. Por eso SQL DEV debe mostrar conteos/detalle antes de ejecutar y detenerse si encuentra datos dudosos.
- Si se limpian recipients pero no se resetea estado de campañas afectadas, algunas campañas podrian seguir no editables/no reenviables por estado `sent`/`failed`/`sending`.
- `TASK-755-HANDOFF.md` y handoffs antiguos siguen locales/no relacionados; no forman parte de esta decision.

Siguiente recomendado:
- Ejecutar TASK-757 con SQL DEV para preparar script seguro y evidencia previa.
- Luego ejecutar TASK-758 con QA para validar post-limpieza.
