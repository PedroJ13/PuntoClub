# TASK-200 - Handoff QA

Equipo: QA

Tarea validada: TASK-200 - Revalidar logo de empresa publicado

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Storage logos: `stpuntoclublogosbr001` / `company-logos`
- Fecha QA: 2026-06-09

## Resultado

Aprobado.

QA cierra la validacion publicada de logo privado de empresa con:

- checks seguros sin sesion;
- revision de bundle Web publicado;
- confirmacion de storage privado;
- evidencia PO redaccionada de upload real, refresh y logout/login.

## Checks ejecutados

### Dependencias revisadas

- `tasks/TASK-197-HANDOFF.md`:
  - API de logo privada desplegada en Azure Functions.
  - `GET/POST /api/my-company/logo` activos y protegidos.
  - Deploy API publicado en commit `64ca70791caae502e92e0a4f854c8027e331df18`.

- `tasks/TASK-198-HANDOFF.md`:
  - Web publicada contiene UI de logo en `Mi empresa`.
  - Bundle incluye endpoint `/api/my-company/logo`, `FormData` y `credentials: "include"`.

- `tasks/TASK-199-HANDOFF.md`:
  - PO Test valido upload real con sesion de empresa.
  - Evidencia redaccionada sin password, cookie, token, SAS ni URL privada de blob.

### API publicada sin sesion

- `GET /api/my-company/logo`:
  - Esperado: `401 UNAUTHORIZED`.
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `POST /api/my-company/logo` con PNG sintetico y sin sesion:
  - Esperado: `401 UNAUTHORIZED`.
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

### Web publicada

Se revisaron recursos servidos por Static Web Apps:

- `/`
- `/src/app.js`
- `/src/customerApi.js`

Resultado:

- HTML publicado contiene panel/input de logo.
- `app.js` contiene `Logo listo para subir`.
- `app.js` contiene referencias al input y preview de logo.
- `customerApi.js` contiene `/api/my-company/logo`.
- `customerApi.js` contiene `uploadCompanyLogo`.
- `customerApi.js` contiene `FormData`.
- Upload de logo contiene `credentials: "include"`.
- Upload usa `FormData.append`.

Resultado: aprobado.

### Storage privado

Se intento listar el contenedor de logos de forma anonima:

```text
GET https://stpuntoclublogosbr001.blob.core.windows.net/company-logos?restype=container&comp=list
```

Resultado observado:

- `409 PublicAccessNotPermitted`.
- No se listaron blobs.
- No se expuso contenido.

Resultado: aprobado.

### Evidencia PO Test revisada

Se reviso `tasks/TASK-199-HANDOFF.md`.

Evidencia redaccionada confirmada por Product Owner:

- Empresa/correo visible con sesion real.
- `Mi empresa` abre con sesion real.
- Archivo permitido PNG/JPG/WebP probado.
- Preview/logo visible despues de subir.
- Logo persiste despues de refrescar.
- Logo visible despues de cerrar/iniciar sesion de nuevo.
- Archivo no permitido probado.
- Sin errores visibles reportados.

Resultado: aprobado como evidencia funcional real sin exponer secretos.

### Regresion segura

- `GET /api/me` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- Endpoint operativo con cookie sintetica invalida:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

## Hallazgos

No se encontraron hallazgos nuevos para el alcance de TASK-200.

## P0/P1

Ninguno abierto.

## P2/P3

Ninguno nuevo.

## Evidencia redaccionada

- `GET /api/my-company/logo` sin sesion: `401 UNAUTHORIZED`.
- `POST /api/my-company/logo` sin sesion con PNG sintetico: `401 UNAUTHORIZED`.
- Web publicada contiene UI/cliente de logo:
  - panel/input/preview de logo;
  - `/api/my-company/logo`;
  - `FormData`;
  - `credentials: "include"`.
- Storage anonimo:
  - `409 PublicAccessNotPermitted`.
- PO Test confirmo upload real, persistencia tras refresh, logout/login y rechazo de archivo no permitido.
- `/api/me` sin sesion: `401 UNAUTHORIZED`.
- Endpoint operativo con cookie sintetica invalida: `401 UNAUTHORIZED`.

## Riesgos o pendientes

- QA no manejo credenciales reales ni reprodujo la sesion del Product Owner por seguridad.
- La validacion funcional real de upload/refresh/logout-login se apoya en evidencia PO redaccionada de TASK-199, complementada por checks tecnicos seguros de QA.
- Mantener storage sin acceso anonimo y no exponer SAS/blob URL como contrato publico.

## Siguiente recomendado

Product / Architect / Release puede cerrar el bloque de logo privado de empresa como aprobado en publicado.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token real.
- No se uso SAS.
- No se uso connection string.
- No se imprimieron hashes, cookies, tokens, passwords ni secretos.
- La prueba de POST fue sin sesion y con PNG sintetico minimo.
