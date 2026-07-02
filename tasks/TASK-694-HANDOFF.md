Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-694 - Decidir publicacion de UX imagen pendiente en campanas

Resultado:
- Se revisaron `TASK-691`, `TASK-692` y `TASK-693`.
- Se aprueba publicar el ajuste Web de UX para imagen pendiente en campanas.
- No se aprueban cambios API, SQL, ACS, storage, DNS, CORS ni feature flags.
- No se autoriza envio real de correos durante la publicacion.

Handoffs procesados:
- `tasks/TASK-691-HANDOFF.md`
- `tasks/TASK-692-HANDOFF.md`
- `tasks/TASK-693-HANDOFF.md`

Decision de publicacion:
- Aprobar publicacion Web.
- Incluir:
  - `app/index.html`
  - `app/src/app.js`
  - handoffs `TASK-691` a `TASK-694`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados

Alcance aprobado:
- Web evita falso positivo de imagen seleccionada pero no guardada.
- Texto del bloque `Imagen opcional` aclara que se debe presionar `Agregar imagen` para guardar antes de enviar.
- Si hay imagen local pendiente de subir:
  - el boton de envio queda deshabilitado;
  - el boton muestra `Guarda la imagen`;
  - si se intenta enviar por otra ruta, se muestra error claro.
- Despues de subir o eliminar imagen, la UI recalcula el estado de envio.

QA / validacion:
- `TASK-692` no quedo aprobada completa en publicado por falta de sesion/credenciales PO para crear campana real editable y recargar contra API publicada.
- La validacion local/estatica confirma que el ajuste evita asumir como guardada una imagen solo seleccionada localmente.
- Queda pendiente QA publicado con sesion real/controlada.

Infra:
- `TASK-693` elimino la regla temporal SQL neutralizada de `TASK-690`.
- Locks SQL quedaron restaurados.
- No quedan reglas temporales abiertas por ese diagnostico.

Reglas de release:
- No enviar correos reales.
- No cambiar `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No tocar API.
- No tocar Azure SQL.
- No tocar ACS ni sender.
- No tocar storage.
- No tocar DNS/CORS/app settings.

Uso Azure SQL:
- No en esta tarea.
- Motivo: decision de release Web.
- Referencia: Infra uso Azure CLI en `TASK-693` solo para limpiar firewall/locks, sin datos.

Riesgos o pendientes:
- P1 pendiente de validacion publicada: confirmar persistencia real de imagen despues de recarga.
- Si una empresa intenta enviar con una imagen seleccionada pero no guardada, la publicacion propuesta debe bloquear ese falso positivo.

Siguiente recomendado:
- Ejecutar `TASK-695` para commit y push controlado Web.
- Luego repetir QA publicado con sesion real/controlada: crear campana editable, subir imagen, recargar, confirmar persistencia y no enviar correos reales.
