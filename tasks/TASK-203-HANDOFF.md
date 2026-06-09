# TASK-203 - Handoff

Equipo responsable: Web Dev

## Resultado

Completado en codigo local. Se implemento un panel interno minimo para administrar solicitudes de empresa e invitaciones.

## Ruta / seccion implementada

- Seccion SPA: `Admin empresas`.
- Boton nuevo en el menu lateral.
- Paneles incluidos:
  - acceso interno temporal;
  - lista de solicitudes;
  - detalle de solicitud;
  - invitacion asociada;
  - acciones de aprobar, rechazar y reenviar invitacion.

## Contratos usados

- `GET /api/company-registration-requests?status=pending&limit=25`
- `POST /api/company-registration-requests/{requestId}/approve`
- `POST /api/company-registration-requests/{requestId}/reject`
- `POST /api/company-invitations/{invitationId}/resend`

El header `x-puntoclub-admin-token` se envia solo como header. No se guarda en `localStorage` ni `sessionStorage`; queda solo en memoria mientras la pagina esta abierta y se puede limpiar desde la UI.

## Estados cubiertos

- Token faltante.
- Token invalido o sin permiso.
- Lista cargando, vacia, filtrada y con resultados.
- Solicitud pendiente.
- Solicitud aprobada.
- Solicitud rechazada.
- Solicitud ya procesada.
- Invitacion ausente.
- Invitacion pendiente.
- Invitacion aceptada.
- Invitacion expirada / no disponible.
- Reenvio de invitacion pendiente sin mostrar token, hash ni link raw.
- Error API controlado.

## Archivos modificados

- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

## Pruebas ejecutadas

```text
node --check app/src/app.js
node --check app/src/customerApi.js
```

Resultado: OK.

```text
Invoke-WebRequest http://127.0.0.1:4173/
```

Resultado: `200`.

Prueba mock API directa:

- token faltante: `FORBIDDEN`;
- token invalido: `FORBIDDEN`;
- lista pending: devuelve solicitudes;
- aprobar solicitud: `approved` con invitacion no sensible;
- reenviar invitacion: `pending`, sin campos `token`, `link` ni `url`;
- rechazar solicitud creada en mock: `rejected`.

Tambien se reviso que la nueva implementacion no introduce `localStorage` ni `sessionStorage`.

## Pendientes / bloqueos

- No se pudo ejecutar smoke visual con navegador headless: Edge/Chrome cerraron antes de exponer CDP en este entorno.
- QA debe validar publicado con token real por canal seguro, sin exponer el valor del header.
- El endpoint nuevo de TASK-201 queda pendiente de deploy API si aun no fue publicado.
- Auth admin final con Entra sigue diferida; este panel usa el token interno temporal indicado para el MVP controlado.
