# TASK-254 - Validar configuracion de membresias con sesion real

Equipo responsable: PO Test

## Contexto

TASK-253 aprobo tecnicamente la publicacion de configuracion de membresias:

- migracion SQL aplicada;
- API publicada con endpoints de membresias;
- Web publicada con seccion `Membresias`;
- endpoints protegidos sin sesion.

Quedo como P2 pendiente la prueba positiva con sesion real.

TASK-250 habilito membresias para una empresa de prueba:

- `companyId=6`
- nombre seguro: `DEMO 1`
- `loyalty_memberships_enabled=1`

No compartir passwords, cookies, tokens ni capturas con secretos.

## Objetivo

Validar como Product Owner que una empresa con membresias habilitadas puede configurar planes y beneficios desde la Web publicada.

## Alcance

- Entrar a:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net/login
```

- Iniciar sesion con la empresa de prueba habilitada para membresias.
- Confirmar que el menu muestra:
  - `Puntos` u operacion actual;
  - `Membresias`;
  - `Mi empresa`;
  - `Reportes`;
  - no muestra `Admin empresas`.
- Entrar a `Membresias`.
- Crear un plan de prueba:
  - nombre: `Membresia mensual QA` o similar;
  - duracion: `30` dias;
  - precio de prueba;
  - aviso interno de vencimiento: `5` dias.
- Crear beneficios de prueba:
  - `15% descuento en pasteles`;
  - `15% descuento en dulces`;
  - `1 cafe americano gratis por dia`.
- Confirmar que los beneficios aparecen listados en el plan.
- Probar editar algo menor del plan o beneficio si el flujo lo permite.
- Confirmar que no se exponen tokens, cookies, passwords, hashes ni links tokenizados.

## Entregable

Crear o actualizar `tasks/TASK-254-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Evidencia redaccionada segura.
- Plan/beneficios creados, sin datos sensibles.
- Hallazgos UX/copy si aparecen.
- Confirmacion de que no se expusieron secretos.
