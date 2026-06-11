# TASK-213 - Aportar evidencia redaccionada de login exitoso

Equipo responsable: PO Test

## Contexto

TASK-212 confirmo que el fix post-login ya esta publicado en el bundle Web, pero QA no pudo aprobar el happy path porque no tiene credenciales reales ni evidencia redaccionada.

No se deben compartir passwords, cookies, tokens ni links con token.

## Objetivo

Validar como Product Owner que el login real ya no queda atrapado en `/login` y aportar evidencia redaccionada suficiente para que QA cierre TASK-212.

## Alcance

- Abrir `https://calm-dune-075dc5c0f.7.azurestaticapps.net/login`.
- Iniciar sesion con una empresa real de prueba usando credenciales por canal seguro local, sin pegarlas en chat ni handoff.
- Confirmar que despues de `Entrar` la app muestra el panel operativo, idealmente `Operaciones`.
- Confirmar que la URL cambia de `/login` a `/` o que ya no queda visualmente atrapada en login.
- Refrescar la pagina con sesion activa y confirmar que sigue en panel operativo.
- Cerrar sesion y confirmar que vuelve a login.
- No mostrar password, cookies, tokens, links de invitacion ni datos sensibles.

## Evidencia permitida

- Captura redaccionada donde se vea:
  - empresa activa;
  - panel operativo visible;
  - sin password visible;
  - sin tokens/cookies/links tokenizados.
- Texto breve con resultado de:
  - login correcto;
  - refresh con sesion activa;
  - logout.

## Entregable

Crear o actualizar `tasks/TASK-213-HANDOFF.md` con:

- Resultado.
- Evidencia redaccionada o descripcion segura.
- Confirmacion de que no se expusieron passwords, cookies, tokens ni secretos.
