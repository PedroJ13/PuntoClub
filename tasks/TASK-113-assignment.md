# TASK-113 - Disenar navegacion lateral y flujo empresa/invitacion

## Equipo

Diseno / UX

## Prioridad

P1

## Round

Round 1

## Depende de

Ninguna.

## Contexto

El flujo operativo actual quedo en una misma pantalla. Product Owner pide volver a una navegacion lateral con tres areas:

- Operaciones: buscar cliente, registrar cliente, ingresar compra y redimir puntos.
- Mi empresa: registrar empresa, configurar empresa, nombre, logo subido, direccion, correo, password/acceso.
- Reportes: reportes y auditoria operativa.

Ademas, el registro de empresa debe contemplar un flujo futuro donde la empresa recibe un correo de invitacion, crea password usando su correo como usuario y luego entra a su panel.

## Objetivo

Definir la experiencia y el flujo de pantallas para la navegacion lateral y el alta de empresa con invitacion, sin implementar codigo.

## Alcance

- Proponer estructura de menu lateral con `Operaciones`, `Mi empresa` y `Reportes`.
- Definir que paneles existentes se mueven a cada seccion.
- Definir flujo UX para:
  - Empresa nueva solicita/crea registro.
  - Sistema muestra estado claro de solicitud/invitacion.
  - Empresa recibe invite y crea password.
  - Empresa entra al panel con su correo.
  - Notificacion interna al correo `pj13eros_business@outlook.com`.
- Definir estados y mensajes para:
  - Empresa ya existente.
  - Invitacion enviada.
  - Invitacion expirada o invalida.
  - Logo pendiente/subido.
  - Password creado.
- Indicar requisitos de responsive desktop/mobile.

## Fuera de alcance

- Implementar UI.
- Cambiar API.
- Cambiar SQL.
- Elegir proveedor de correo/auth/storage.
- Subir logos reales.

## Entregable

Crear `tasks/TASK-113-HANDOFF.md` con:

- Propuesta de IA/menu.
- Flujo paso a paso.
- Campos por pantalla.
- Estados/mensajes recomendados.
- Riesgos o dudas para Product / Architect / Release.

## Validacion esperada

El handoff debe ser suficiente para que Web Dev reorganice la UI y para que Backend/API entienda los pasos esperados de registro/invitacion.
