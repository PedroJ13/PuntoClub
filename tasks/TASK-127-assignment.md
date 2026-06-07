# TASK-127 - Crear recursos Azure aprobados para multiempresa piloto

## Equipo

Infra / Azure

## Prioridad

P1

## Contexto

Product / Architect / Release completo TASK-126 y el Product Owner respondio `Listo`, por lo que se toma como aprobacion para avanzar con la configuracion piloto recomendada:

- Azure Managed Domain para email piloto.
- Remitente visible `Punto Club`.
- Acuse automatico al solicitante.
- Notificaciones internas a `pj13eros_business@outlook.com`.
- Microsoft Entra External ID.
- Storage dedicado `stpuntoclublogosbr001`.
- Logos de 1 MB, PNG/JPG/WebP, sin SVG.
- CTA `Crear acceso`.
- Recursos pay-as-you-go.

## Objetivo

Crear/configurar los recursos Azure base para multiempresa controlado, en pasos pequenos y verificables, sin imprimir secretos.

## Alcance

- Crear recursos propios de Punto Club para Azure Communication Services Email:
  - `email-puntoclub-prod-001`
  - `acs-puntoclub-prod-001`
  - Azure Managed Domain para piloto.
- Preparar Microsoft Entra External ID:
  - tenant/app/user flow o documentar pasos si alguna parte requiere Portal/manual.
  - app SPA/SWA `puntoclub-web`.
  - API/audience `puntoclub-api`.
  - redirects publicados y locales recomendados.
- Crear storage dedicado:
  - `stpuntoclublogosbr001`
  - container privado `company-logos`
  - public blob access disabled.
- Habilitar/configurar Managed Identity para Function App si aplica.
- Asignar rol minimo para acceso a logos si aplica.
- Configurar app settings necesarios sin imprimir valores.
- Verificar:
  - recursos creados;
  - dominio/remitente disponible;
  - container privado;
  - settings presentes sin mostrar secretos.

## Fuera de alcance

- Implementar Backend/API.
- Implementar Frontend.
- Aplicar migracion SQL.
- Enviar invitaciones reales a empresas externas.
- Imprimir connection strings, secrets, tokens o valores sensibles.

## Entregable

Crear `tasks/TASK-127-HANDOFF.md` con:

- Recursos creados/configurados.
- Valores publicos seguros.
- App settings configurados solo por nombre, sin valores.
- Lo que quedo manual/bloqueado si Entra requiere portal.
- Pruebas/verificaciones realizadas.
- Riesgos o pasos siguientes.

## Validacion esperada

Backend/API debe poder usar el handoff para saber que settings/recursos existen antes de implementar integracion real de email/auth/logo.
