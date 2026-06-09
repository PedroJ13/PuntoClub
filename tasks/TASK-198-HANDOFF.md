# TASK-198 - Handoff

Equipo responsable: Web Dev

## Resultado

Deploy Web confirmado. La Static Web App publicada contiene la UI de logo privado implementada en TASK-195 para `Mi empresa`.

URL validada:

- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`

Commit con la implementacion validada:

- `64ca70791caae502e92e0a4f854c8027e331df18`
- `https://github.com/PedroJ13/PuntoClub/commit/64ca70791caae502e92e0a4f854c8027e331df18`

Run ID no recuperado en esta validacion; la evidencia se basa en el contenido actualmente servido por Static Web Apps.

## Evidencia de bundle publicado

Archivos publicados inspeccionados:

- `/`
- `/src/app.js`
- `/src/customerApi.js`

Resultados:

- `htmlLength`: `28728`
- `appLength`: `78653`
- `customerApiLength`: `38677`
- `htmlHasLogoFile`: `true`
- `htmlHasLogoPanel`: `true`
- `appHasLogoReadyText`: `true`
- `appHasLogoInput`: `true`
- `appHasLogoPreview`: `true`
- `customerHasMyCompanyLogo`: `true`
- `customerHasUploadCompanyLogo`: `true`
- `customerHasFormData`: `true`
- `uploadHasCredentials`: `true`
- `uploadHasFormDataAppend`: `true`

Esto confirma que el bundle publicado incluye:

- endpoint `/api/my-company/logo`;
- texto `Logo listo para subir.`;
- upload con `FormData` / multipart;
- `credentials: "include"` en el upload.

## Smoke visual publicado

Se valido `Mi empresa` en la Web publicada sin sesion real.

Desktop `1280px`:

- seccion `Mi empresa` visible;
- panel de logo presente;
- input de archivo presente;
- `accept="image/png,image/jpeg,image/webp"`;
- boton `Subir logo` visible;
- preview inicial `Sin logo`;
- sin overflow horizontal.

Mobile `390px`:

- seccion `Mi empresa` visible;
- panel de logo presente;
- input de archivo presente;
- `accept="image/png,image/jpeg,image/webp"`;
- boton `Subir logo` visible;
- preview inicial `Sin logo`;
- sin overflow horizontal.

Observacion adicional: tras esperar la carga de `Mi empresa`, el formulario quedo visible, el panel de logo siguio visible y no hubo overflow horizontal.

## Seguridad

No se uso sesion real, password, cookie, token ni SAS. No se ejecuto upload real.

## Pendientes

- QA/PO deben validar con sesion real el flujo completo de upload, refresco y logout/login.
- La validacion funcional real depende de que el API publicado tambien incluya los cambios de logo correspondientes.
