# TASK-233 - Aislar pagina publica de registro de empresa

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

Product Owner confirmo que `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-registration` ya cae en registrar empresa, pero al hacer scroll todavia se alcanzan/se ven secciones operativas de la aplicacion.

Para empresas nuevas, el link de registro debe sentirse como una pagina publica propia, no como una seccion dentro del panel operativo.

## Objetivo

Ajustar `/company-registration` para que muestre solo la experiencia publica de registro de empresa.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-226-HANDOFF.md`, `tasks/TASK-231-HANDOFF.md` y `tasks/TASK-232-HANDOFF.md`.
- En la ruta `/company-registration`, ocultar por completo:
  - menu lateral;
  - Operaciones;
  - Mi empresa;
  - Reportes;
  - Admin empresas;
  - cualquier panel operativo o autenticado no relacionado con registro publico.
- Mantener visible solo:
  - encabezado publico de Punto Club;
  - estado de sesion/API si ya existe y no confunde;
  - formulario publico de registro de empresa;
  - estado de solicitud recibida.
- Si es mas simple/seguro, usar una vista/pagina publica independiente para `company-registration`.
- No usar hash como solucion principal si la ruta limpia `/company-registration` ya existe.
- Mantener el link actual funcionando:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-registration
```

- No romper `/`, `/login` ni `/company-invitations/accept`.
- No exponer tokens, cookies, passwords ni datos internos.

## Criterios de aceptacion

- Al abrir `/company-registration`, solo se ve registro de empresa y sus estados.
- Al hacer scroll no aparecen paneles operativos.
- Despues de enviar solicitud, no aparece el formulario por defecto salvo accion explicita para enviar otra solicitud.
- `/` sigue mostrando app operativa cuando hay sesion.
- `/login` sigue mostrando login.

## Entregable

Crear o actualizar `tasks/TASK-233-HANDOFF.md` con:

- Resultado.
- Cambios realizados.
- Rutas verificadas.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA.
