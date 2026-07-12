Equipo: Ejecucion Tecnica
Modo: Web Dev
Tarea completada: TASK-987 - Aplicar copy de acceso en staging

Resultado:
Se aplico y publico en Web staging la oleada de copy de acceso para login, recuperacion de acceso, invitacion de empresa y restablecimiento de contrasena. El cambio mantiene el CTA publico `Solicitar acceso`, evita promesas o detalles tecnicos y conserva los flujos sin cambios funcionales.

Archivos cambiados:
- app/index.html
- app/src/app.js
- tasks/TASK-987-HANDOFF.md

Resumen de textos ajustados:
- `/login`:
  - `Acceder a mi panel` -> `Acceder al panel`.
  - Soporte: `Ingresa con el correo de acceso de tu empresa.`
  - CTA publico mantiene `Solicitar acceso` hacia `/company-registration`.
  - Recuperar acceso mantiene copy seguro: `Si el correo está registrado, enviaremos instrucciones...`.
- `/company-invitations/accept`:
  - `Crea el acceso de tu empresa` -> `Configura el acceso de tu empresa`.
  - `correo invitado` -> `correo autorizado`.
  - Estado valido: `Invitación revisada`.
  - Boton de alta: `Configurar acceso`.
- `/company-password-reset`:
  - `Crear nueva contraseña` -> `Restablecer contraseña`.
  - Mensaje valido de enlace ya no expone email: `Enlace revisado. Define una nueva contraseña para recuperar el acceso.`
- Estados dinamicos:
  - Loading/errores de login y acceso usan `panel` / `configurar acceso` de forma consistente.

Publicacion staging:
- Rama: `staging`
- Commit Web: `98aa95c` (`TASK-987 apply access copy staging`)
- Workflow: `Deploy Punto Club frontend staging`
- Run: https://github.com/PedroJ13/PuntoClub/actions/runs/29173329388
- Resultado workflow: success
- URL staging validada: https://calm-coast-0fabaec0f.7.azurestaticapps.net/

Validacion ejecutada:
- `npx prettier --check app/index.html app/src/app.js` - OK
- `node --check app/src/app.js` - OK
- Busqueda focal de textos antiguos del alcance - OK; no quedan:
  - `Crea el acceso`
  - `Crear acceso`
  - `correo invitado`
  - `Acceder a mi panel`
  - `Enlace válido`
- Smoke visual local con Playwright en 1366x768, 1024x768 y 390x844 - OK:
  - `/login` con recuperacion abierta.
  - `/company-invitations/accept` sin token real.
  - `/company-password-reset` sin token real.
  - Sin overflow horizontal.
  - Sin textos tecnicos visibles del alcance como `endpoint`, `payload` o `flag`.
- Smoke visual publicado en staging con Playwright en 1366x768, 1024x768 y 390x844 - OK con los mismos checks.
- No se ejecutaron submits reales.

Uso Azure SQL: No. Tarea Web/copy y validacion visual; no requirio datos reales ni consultas SQL.

P0/P1:
- Ninguno detectado.

P2/P3:
- Ninguno detectado en las rutas de acceso revisadas.

Riesgos o pendientes:
- No se tocaron API, SQL, auth, sesiones, cookies, passwords, ACS, sender, DNS, flags ni produccion.
- No se enviaron correos reales de recuperacion.
- No se aceptaron invitaciones reales ni se crearon accesos reales.
- Los terminos tecnicos existentes en modulos internos fuera del alcance, como campañas/admin, no fueron modificados.

Siguiente recomendado:
- QA focal de TASK-988 en staging para validar copy de acceso, recuperacion abierta e invitacion/restablecimiento sin token real antes de decidir promocion a produccion.
