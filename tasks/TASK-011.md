# TASK-011 - Preparar recursos Azure production piloto

## Estado

Asignada a Infra / Azure.

## Contexto

TASK-002 recomendo Static Web Apps Free, Functions Consumption, Azure SQL Basic DTU, Application Insights minimo y storage opcional para logos.

## Objetivo

Preparar plan operativo para crear recursos production piloto con nombres, configuracion y secretos requeridos.

## Alcance

- Proponer nombres de recursos Azure.
- Proponer grupo de recursos y region.
- Definir app settings requeridos.
- Definir como se conectara Functions con Azure SQL.
- Definir si Key Vault se difiere o se incluye.
- Definir pasos manuales o IaC minima si corresponde.

## No tocar

- No crear recursos reales sin confirmacion explicita.
- No guardar secretos.
- No cambiar codigo.
- No definir modelo SQL.

## Verificacion

- La propuesta debe poder ejecutarse por pasos.
- Debe listar costos y riesgos.
- Debe indicar que falta antes de deploy.

## Handoff esperado

Crear `tasks/TASK-011-HANDOFF.md`.
