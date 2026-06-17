# TASK-309 - QA revalidacion UX/copy/iconos publicados

Equipo: QA
Round: 46
Depende de: TASK-307, TASK-308
Estado: Completed
Fecha: 2026-06-16

## Resultado

**No aprobado.**

No se logró validar el estado esperado de la pasada final UX/copy/iconos en producción porque la publicación sigue mostrando texto legado y sin `data-icon`.

No se identificaron regresiones funcionales **P0/P1** en esta revisión de contenido.

## Evidencia de verificación (ambiente publicado)

- URL validada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Assets descargados desde publicación:
  - `app/index.html`
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `app/styles.css`

## Hallazgos

### P2 — Copy legacy visible en flujo principal (tareas objetivo)

- `Password` y `Confirmar password` siguen presentes en `index.html` (labels de acceso).
- `Entrar` sigue como CTA principal de login interno y público.
- `Confirmar compra`, `Confirmar canje` y `Confirmar uso` siguen visibles en botones.
- Mensajes/estados con texto legacy:
  - `Busque o registre un cliente para iniciar la atencion.`
  - `Busque un cliente existente.`
- Textos técnicos de error aún con `Password`/`password` en algunos casos (`Correo o password incorrecto.`, `Ingrese el password.`, `Las contraseñas no coinciden.`).

### P2 — Texto técnico `Mock local`/`API real` visible

- En `index.html` persiste:
  - `Mock local` en estado de fuente.
- En `customerApi.js` persisten labels `Mock local` y `API real`.

### P2 — Iconos no verificables en publicado

- No se encontró `data-icon` en `index.html` ni en `src/app.js` descargados desde el ambiente publicado, por lo que no hay evidencia de iconos en botones principales en producción.

### P2 — Terminología de navegación/flujo no totalmente consistente

- `Admin empresas` continúa visible en la barra/nav y títulos.
- No hay garantía de consistencia completa de terminología según `NEXT_PHASE_UX_COPY_POLISH.md` en la build publicada.

## Hallazgos no funcionales

- `app/styles.css` contiene media queries de responsive (`max-width: 860px`, `max-width: 560px`) y ajuste de tablas (`overflow-x: auto`), por lo que no se observó evidencia textual de regresión evidente de layout en esta revalidación estática de assets.
- La verificación funcional de API publicada no mostró rutas de salud operativa (`/health` en 404, `/company-registration-requests` con 403), sin evidencia directa de P0/P1.

## Riesgo

- La experiencia publicada aún no refleja la versión final de copy/iconos esperada; el producto aparece en un estado intermedio entre tareas de ajuste local y publicación real.

## Recomendación y cierre

- Re-deployar frontend con cambios consolidados de `TASK-307/308` y re-ejecutar esta tarea.
- Verificar explícitamente antes de cierre:
  - `Password` → `Contraseña` (labels y errores).
  - `Confirmar password` actualizado.
  - Login con CTA final `Iniciar sesion`.
  - `Confirmar compra` / `Confirmar canje` / `Confirmar uso` reemplazados por copy final.
- Confirmar que no haya `Mock local`/`API real` en UI de empresa normal.
- Confirmar `data-icon` en acciones principales y que cada botón conserve icono + texto donde aplica.
- Validar nuevamente responsive desktop/mobile tras deploy.

