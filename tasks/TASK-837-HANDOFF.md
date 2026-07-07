Equipo: QA
Tarea validada: TASK-837 - Validar persistencia de logo despues de Actualizar
Ambiente: Web publicada `https://puntoclubcr.com/app` con sesion real/controlada de Aurisbel. Fecha QA: 2026-07-07 13:54:58 -06:00.
Resultado: no aprobado

Checks ejecutados:
- Se revisaron `tasks/TASK-834-HANDOFF.md`, `tasks/TASK-835-HANDOFF.md` y `tasks/TASK-836-HANDOFF.md`.
- Se valido sesion publicada activa de Aurisbel Pasteleria.
- Estado inicial:
  - Header con fallback `AP`.
  - `Mi empresa > Logo`: `Sin logo cargado`.
- Se uso logo PNG autorizado para QA:
  - Archivo: `puntoclub-task837-logo.png`.
  - El Product Owner selecciono el archivo en el navegador interno por restriccion del runtime sobre `input[type=file]`.
- Se presiono `Subir logo`.
- Se valido resultado inmediato de subida:
  - UI mostro `Logo actualizado`.
  - Header cambio de fallback `AP` a imagen.
  - `active-company-logo-image.src`: `https://api.puntoclubcr.com/api/my-company/logo?v=2026-07-07T19%3A48%3A02.000Z`.
  - `active-company-logo-fallback`: oculto.
  - Preview de `Mi empresa > Logo` mostro imagen interna con la misma URL.
- Se presiono `Actualizar`.
- Se valido resultado despues de `Actualizar`:
  - Header volvio a fallback `AP`.
  - `active-company-logo-image`: oculto/sin `src`.
  - `Mi empresa > Logo` volvio a mostrar `Sin logo cargado`.
  - Quedo estado contradictorio temporal: texto `Logo actualizado` junto a `Sin logo cargado`.
- Se refresco navegador.
- Se valido resultado despues de refresh:
  - Aurisbel siguio activa.
  - Header siguio con fallback `AP`.
  - Logo no reaparecio.
- Se cerro sesion.
- Product Owner inicio sesion nuevamente con Aurisbel.
- Se valido resultado despues de logout/login:
  - Aurisbel volvio activa.
  - Header siguio con fallback `AP`.
  - `Mi empresa > Logo` mostro `Sin logo cargado`.
  - Preview de logo oculto/sin `src`.
- No se borro ni reemplazo logo fuera de la prueba autorizada.

Hallazgos:
- P1: El logo subido aparece inmediatamente despues de `Subir logo`, pero se pierde al presionar `Actualizar`.
- P1: El logo tampoco reaparece despues de refresh ni despues de logout/login.
- P2: Despues de `Actualizar`, la pantalla puede mostrar estado contradictorio (`Logo actualizado` y `Sin logo cargado`) antes de refresh.
- No hubo errores de consola relevantes durante el flujo observado.

P0/P1:
- P1 abierto: Persistencia visible de logo no cumple el criterio de aceptacion. El flujo autorizado logra mostrar logo inmediatamente tras subirlo, pero `Actualizar` vuelve el header y la vista de Logo al fallback `AP` / `Sin logo cargado`, y el logo no persiste tras refresh ni logout/login.

P2/P3:
- P2 abierto: Estado visual contradictorio despues de `Actualizar`: mensaje `Logo actualizado` coexistiendo con `Sin logo cargado`.

Evidencia:
- Antes de subir:
  - Header: fallback `AP`, imagen oculta/sin `src`.
  - `Mi empresa > Logo`: `Sin logo cargado`.
- Despues de `Subir logo`:
  - `Logo actualizado`.
  - Header imagen visible.
  - URL de imagen: `/api/my-company/logo?v=2026-07-07T19%3A48%3A02.000Z`.
  - Fallback `AP` oculto.
- Despues de `Actualizar`:
  - Header: fallback `AP`.
  - Imagen de header oculta/sin `src`.
  - `Mi empresa > Logo`: `Sin logo cargado`.
- Despues de refresh:
  - Header: fallback `AP`.
  - Sin imagen activa.
- Despues de logout/login:
  - Header: fallback `AP`.
  - `Mi empresa > Logo`: `Sin logo cargado`.
  - Preview image hidden/sin `src`.
- Console errors relevantes: ninguno observado.

Uso DB cloud: Si, motivo y alcance
- Si. Validacion en web publicada con sesion real de Aurisbel contra API/datos reales.
- Alcance: subida autorizada de logo QA, lectura de UI/API via Web, presionar `Actualizar`, refresh y logout/login.
- No se uso SQL directo.
- No se borraron logos.
- No se reemplazo logo fuera de la prueba autorizada.

Riesgos o pendientes:
- La correccion de TASK-834/TASK-836 no queda validada en publicado para el caso principal de persistencia.
- TASK-835 sigue bloqueada para ver metadata SQL directa por firewall; puede ayudar a determinar si falla persistencia SQL/blob o el contrato `settings` publicado.
- El logo QA puede haber quedado subido en storage/API inmediatamente despues del POST, pero no se observa desde `settings` tras `Actualizar`/refresh/login.

Siguiente recomendado:
- Backend/API revisar en publicado `GET /api/companies/{companyId}/settings` despues de `POST /api/my-company/logo`: debe devolver `logoUrl`, `logoContentType` y `logoUpdatedAt`.
- Web Dev revalidar que `Actualizar` no borre el estado visual si el endpoint de settings devuelve logo.
- SQL DEV/Infra, si es necesario, ejecutar verificacion de metadata desde ambiente permitido para confirmar `logo_blob_path`, `logo_content_type` y `logo_updated_at` de Aurisbel.
