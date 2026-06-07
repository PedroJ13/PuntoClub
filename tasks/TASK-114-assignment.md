# TASK-114 - Evaluar email, auth y subida de logo para empresas

## Equipo

Infra / Azure

## Prioridad

P1

## Round

Round 1

## Depende de

Ninguna.

## Contexto

Product Owner pide que una empresa pueda registrarse, recibir un correo de invitacion, crear password con su correo como usuario y entrar a su panel. Tambien pide carga de logo como imagen y notificacion interna a `pj13eros_business@outlook.com` cuando una empresa se registre.

Hasta ahora el piloto usa empresa unica con `PILOT_COMPANY_ID` y no tiene auth multiempresa real, email transaccional ni storage propio de logos.

## Objetivo

Evaluar opciones de infraestructura para correo, autenticacion/acceso y almacenamiento de logos, sin crear recursos ni cambiar configuracion productiva salvo aprobacion explicita.

## Alcance

- Recomendar una opcion para enviar:
  - Invite a la empresa.
  - Notificacion interna a `pj13eros_business@outlook.com`.
- Recomendar una opcion para acceso/password de empresas:
  - Azure Static Web Apps auth, Azure AD B2C/Entra External ID, auth propio u otra opcion viable.
  - Riesgos de cada opcion para un piloto real.
- Recomendar una opcion para logo upload:
  - Azure Blob Storage u otra opcion.
  - Como manejar URLs, permisos y tamano/tipo de archivo.
- Identificar secretos/configuraciones necesarias sin revelar valores.
- Estimar complejidad, costo minimo y pasos de despliegue.
- Indicar que decisiones requieren aprobacion de Product Owner antes de implementar.

## Fuera de alcance

- Crear recursos Azure.
- Configurar secretos.
- Implementar correo, auth o upload.
- Cambiar workflows.

## Entregable

Crear `tasks/TASK-114-HANDOFF.md` con:

- Recomendacion principal.
- Alternativas consideradas.
- Costos/riesgos.
- Variables/secrets necesarios.
- Pasos siguientes sugeridos.

## Validacion esperada

El handoff debe permitir una decision de arquitectura antes de que Backend/API y Web Dev implementen registro de empresas, invitaciones, password o logo upload.
