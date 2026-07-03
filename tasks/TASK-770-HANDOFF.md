Equipo: QA
Modo de ejecucion: Datos / Validacion post-limpieza publicada
Tarea completada: TASK-770 - Validar limpieza final de campanas promocionales

Archivos cambiados:
- `tasks/TASK-770-HANDOFF.md`

Ambiente:
- Web publicada: `https://puntoclubcr.com/app?cb=task770`
- API publicada: `https://api.puntoclubcr.com/api`
- Sesion real/controlada: Aurisbel Pasteleria (`company_id = 8`)

Verificacion ejecutada:
- Apertura de Web publicada con cache-buster.
- Confirmacion de sesion real/controlada.
- Navegacion a `Enviar campanas`.
- Revision visual de lista de campanas.
- Apertura de preview.
- Confirmacion de imagen renderizada.
- No se seleccionaron destinatarios para envio.
- No se hizo click en `Enviar campana`.

Resultado:
- Aprobado QA para el alcance de TASK-770.
- En la lista de campanas solo queda visible:
  - `Nuevo - Nueva Bebida`.
- No aparecieron campanas de prueba eliminadas:
  - `QA753`;
  - `QA744`;
  - `TEST Imagen`;
  - `QA TASK`;
  - `Promo clientes frecuentes`;
  - `TEST 2`;
  - `TEST 4`;
  - `QA722`;
  - `QA717`.
- Preview conserva la campana correcta:
  - asunto `Nueva Bebida`;
  - copy promocional visible;
  - puntos disponibles visibles en preview.
- Imagen/preview:
  - imagen publica cargada desde `/api/public/promotional-campaign-images/D750ABD9-206B-456F-9345-8C42A03271C8`;
  - imagen completa con dimensiones reales (`1086x1448` en navegador).
- Estado de envio:
  - `0 seleccionados de 5`;
  - no se envio campana;
  - no se enviaron correos reales.

Validacion de datos:
- Se toma como evidencia SQL post-commit de TASK-769:
  - `PromotionalCampaigns = 1`;
  - `PromotionalCampaignImages = 1`;
  - `PromotionalCampaignRecipients = 1`;
  - preferencias, bajas, clientes, compras, canjes y membresias mantienen conteos post-commit documentados.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno nuevo.

Uso Azure SQL:
- No desde QA.
- Motivo: QA uso Web publicada y la evidencia SQL post-commit de TASK-769.

Riesgos o pendientes:
- La limpieza SQL no borro blobs fisicos asociados a imagenes eliminadas; esto queda fuera del alcance de QA y requiere Infra si Product lo desea.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el bloque de limpieza de campanas promocionales.
