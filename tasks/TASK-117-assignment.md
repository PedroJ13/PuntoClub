# TASK-117 - Reorganizar UI con menu lateral por secciones

## Equipo

Web Dev

## Prioridad

P1

## Round

Round 2

## Depende de

`TASK-113`

## Contexto

Product Owner pide volver a un menu lateral y separar la pantalla en:

- Operaciones.
- Mi empresa.
- Reportes.

El objetivo inmediato es reorganizar la experiencia existente. Registro real de empresa, email invite, password y logo upload dependen de decisiones de arquitectura posteriores.

## Objetivo

Implementar la navegacion lateral usando el flujo aprobado por Diseno / UX, reutilizando las pantallas existentes y sin implementar todavia auth/email/upload multiempresa.

## Alcance

- Crear menu lateral con:
  - Operaciones.
  - Mi empresa.
  - Reportes.
- Mover/mostrar en Operaciones:
  - Buscar cliente.
  - Registrar cliente.
  - Ingresar compra.
  - Redimir puntos.
- Mover/mostrar en Mi empresa:
  - Configuracion actual de empresa piloto.
  - Espacios visuales para futuros campos aprobados por UX, si no rompen funcionalidad.
- Mover/mostrar en Reportes:
  - Reporte operativo.
  - Auditoria operativa.
- Mantener comportamiento existente aprobado.
- Cuidar responsive y que ningun panel quede fuera de pantalla.

## Fuera de alcance

- Registrar empresas nuevas realmente.
- Enviar correos.
- Crear login/password.
- Subir logos a storage.
- Cambiar contratos API.

## Entregable

Crear `tasks/TASK-117-HANDOFF.md` con:

- Cambios realizados.
- URL/local o evidencia de validacion.
- Riesgos o pendientes.

## Validacion esperada

QA debe poder validar que las tres secciones funcionan y que no se rompio caja, configuracion, reportes ni auditoria.
