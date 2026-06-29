# TASK-511 - Decidir estrategia de remitente y alcance MVP de correos a clientes

Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Email sender
Estado: Ready
Prioridad: P1 decision arquitectura correo
Depende de: TASK-510

## Objetivo

Decidir la estrategia de remitente para correos operativos y promocionales a clientes, incluyendo dominio, nombre visible, reply-to, alcance MVP y limites iniciales.

## Contexto

El Product Owner planteo que las empresas querran enviar promociones a sus clientes, por ejemplo: "Manana tengo 2x1 en helados". Tambien se definio que los correos operativos como bienvenida, compra y canje pueden incluir puntos disponibles.

Enviar directamente desde el correo/dominio de cada empresa en MVP implica verificar dominios, SPF/DKIM/DMARC, reputacion, rebotes y soporte por empresa. La alternativa MVP es enviar desde dominio Punto Club con nombre de empresa visible y reply-to de la empresa.

## Alcance

1. Decidir remitente MVP.
2. Decidir nombre visible y reply-to.
3. Decidir separacion operativos/promocionales.
4. Definir limites iniciales.
5. Identificar dependencias de Infra.

## Fuera de alcance

- No configurar DNS.
- No cambiar ACS Email.
- No enviar correos reales.
- No implementar codigo.
- No tocar Azure SQL.

## Handoff esperado

Crear o actualizar `tasks/TASK-511-HANDOFF.md`.
