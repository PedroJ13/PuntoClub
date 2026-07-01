Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-633 - Decidir publicacion del manejo de sesion vencida en promociones

Resultado:
- Se revisaron los handoffs `TASK-630`, `TASK-631` y `TASK-632`.
- Se aprueba publicar el ajuste Web de manejo de sesion vencida en promociones.
- La publicacion aprobada incluye solo `app/src/app.js` y handoffs relacionados.

Hallazgos procesados:
- `TASK-630` confirmo que el `401 Authentication is required` al guardar campana corresponde a request sin cookie/sesion valida.
- `TASK-630` no encontro bug confirmado en Backend/API, CORS ni contrato de `createPromotionalCampaign`.
- `TASK-631` implemento manejo Web para `UNAUTHORIZED` y `FORBIDDEN` en flujos de campanas:
  - limpiar identidad local;
  - renderizar estado sin sesion;
  - navegar a `/login`;
  - mostrar `Tu sesión expiró. Accede nuevamente a tu panel.`
- `TASK-632` aprobo QA local:
  - happy path autenticado con mock pudo crear campana y verla seleccionada/listada;
  - sesion vencida con API fake local redirigio a login;
  - no quedo visible el texto tecnico `Authentication is required`.

Decision:
- Publicar el ajuste Web de `TASK-631`.
- No bloquear por falta de QA Web previo, porque el cambio es pequeno, localmente aprobado y reduce confusion operacional.
- Hacer QA/PO publicado posterior al intentar de nuevo el flujo real.

Confirmaciones de alcance:
- No cambiar API.
- No cambiar SQL.
- No cambiar ACS.
- No cambiar sender.
- No cambiar secretos.
- No activar ni desactivar feature flags.
- No reenviar correos.
- No ejecutar envio real desde esta tarea.

Riesgos o pendientes:
- Si con sesion recien iniciada el POST sigue devolviendo `401`, se requiere evidencia de hora exacta y/o cookies/headers del navegador real.
- `TASK-630` observo un `sendPromotionalCampaign` `500` reciente en logs, fuera del alcance directo de esta correccion.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs y validacion local; no requirio datos reales.

Siguiente recomendado:
- Ejecutar `TASK-634` para commit y push controlado del ajuste Web.
