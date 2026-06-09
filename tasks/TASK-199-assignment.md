# TASK-199 - PO Test valida logo con sesion real

Equipo responsable: PO Test

## Contexto

QA no debe manejar password/cookies/tokens reales. Para validar upload real de logo privado, puede requerirse evidencia del Product Owner con sesion real.

Ejecutar despues de TASK-197 y TASK-198.

## Objetivo

Validar desde la Web publicada que una empresa autenticada puede cargar y ver su logo.

## Alcance

- Iniciar sesion con cuenta de empresa.
- Ir a `Mi empresa`.
- Subir una imagen PNG/JPG/WebP pequena.
- Confirmar que se ve preview/logo.
- Refrescar pagina y confirmar que el logo se mantiene.
- Cerrar sesion e iniciar sesion de nuevo si es viable, confirmar logo visible.
- Probar un archivo no permitido o reportar si no se probo.

## Seguridad

- No compartir password.
- No compartir cookies.
- No compartir tokens.
- No compartir SAS ni URL privada de blob.
- Recortar barra de direccion si contiene informacion sensible.

## Entregable

Crear o actualizar `tasks/TASK-199-HANDOFF.md` con:

- Resultado.
- Flujos probados.
- Evidencia redaccionada.
- Errores visibles si hubo.
- Confirmacion de que no se compartieron secretos.
