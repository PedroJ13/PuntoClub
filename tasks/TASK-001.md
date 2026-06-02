# TASK-001 - Definir MVP y arquitectura inicial de Punto Club

## Estado

Propuesta para Product / Architect / Release.

## Contexto

Punto Club sera una plataforma web para que empresas fidelicen clientes con puntos acumulados segun ventas.

La idea inicial es usar una web en Azure Static Web Apps y permitir que cada empresa registre clientes, compras, puntos acumulados y redenciones. En una fase posterior, el producto puede evolucionar hacia un SaaS multiempresa con registro, aprobacion administrativa, invitaciones y estadisticas.

El usuario considera crear una Azure SQL Database minima para almacenar datos desde el inicio.

## Objetivo de la tarea

Definir el alcance del MVP, la arquitectura inicial y las primeras tareas operativas para comenzar el desarrollo de Punto Club con una base ordenada.

## Alcance funcional propuesto para MVP

### Empresa

- Registrar o configurar una empresa inicial.
- Guardar datos basicos:
  - nombre
  - email
  - telefono
  - logo opcional
  - porcentaje de puntos por compra
- Permitir ajustar el porcentaje de puntos desde una pantalla de configuracion.

### Clientes fidelizados

- Registrar clientes por empresa.
- Campos iniciales:
  - nombre
  - telefono
  - email
- Permitir ver saldo actual de puntos.
- Permitir ver historial del cliente:
  - compras
  - puntos ganados
  - puntos redimidos
  - saldo disponible

### Compras

- Registrar compras asociadas a un cliente.
- Campos:
  - numero de factura
  - fecha
  - monto de compra
  - puntos generados
- El numero de factura no debe repetirse dentro de la misma empresa.
- Al registrar un cliente nuevo, permitir registrar una compra en el mismo flujo.
- Permitir registrar compras por separado para clientes existentes.

### Redenciones

- Permitir registrar redenciones de puntos.
- Mostrar saldo disponible antes de redimir.
- Evitar redimir mas puntos de los disponibles.
- Mantener historial de redenciones por cliente.

### Consulta operativa

- Buscar cliente por telefono, nombre o email.
- Mostrar puntos acumulados a la fecha.
- Mostrar historial resumido de actividad.

## Fuera de alcance para fase 1

Estos puntos son importantes, pero pueden quedar para una segunda fase si Product / Release quiere reducir riesgo inicial:

- Registro publico de empresas.
- Aprobacion de empresas por administrador.
- Generacion de invites.
- Flujo donde el correo de empresa se convierte en usuario y la empresa define password.
- Multiempresa completamente autoservicio.
- Estadisticas avanzadas:
  - clientes que mas compran
  - clientes que mas redimen
  - porcentaje redimido
  - promedio de dias entre compras
  - tendencias por periodo

## Decision recomendada sobre base de datos

Usar una base de datos desde el inicio si el sistema sera usado por empresas reales, aunque sean pocas.

Motivo:

- Se necesita persistencia central.
- Hay que proteger la unicidad de facturas.
- El saldo de puntos debe ser confiable.
- Las compras y redenciones requieren historial.
- A futuro cada empresa debe ver solo sus datos.
- LocalStorage o archivos estaticos solo sirven para demo visual, no para operacion real.

## Arquitectura inicial recomendada

- Frontend: Azure Static Web Apps.
- API: Azure Functions.
- Base de datos: Azure SQL Database minima.
- Autenticacion fase 1: definir por Product / Architect / Release.
- Autenticacion fase 2: flujo de empresas, aprobacion, invite y password.

## Modelo de datos inicial sugerido

### Companies

- id
- name
- email
- phone
- logo_url
- points_percentage
- status
- created_at
- updated_at

### Customers

- id
- company_id
- name
- phone
- email
- created_at
- updated_at

### Purchases

- id
- company_id
- customer_id
- invoice_number
- purchase_date
- amount
- points_earned
- created_at

Restriccion sugerida:

- invoice_number unico por company_id.

### Redemptions

- id
- company_id
- customer_id
- redemption_date
- points_redeemed
- note
- created_at

### Point balance

Para MVP, el saldo puede calcularse como:

- total puntos ganados en compras
- menos total puntos redimidos

Si luego crece el volumen, evaluar tabla de movimientos o saldo materializado.

## Equipos involucrados

### Product / Architect / Release

- Confirmar alcance de fase 1.
- Decidir si MVP sera demo, piloto interno o uso real por empresas.
- Definir criterio de aceptacion.
- Crear tareas pequenas para equipos.
- Mantener release status, backlog y decision log.

### Infra Azure

- Crear o proponer recursos Azure:
  - Azure Static Web Apps
  - Azure Functions
  - Azure SQL Database
  - storage para logos si aplica
- Definir ambientes:
  - local
  - staging opcional
  - production
- Definir variables de conexion y secretos.
- Recomendar plan minimo de costos.

### Backend/API

- Definir contratos API.
- Implementar operaciones CRUD necesarias.
- Validar unicidad de facturas por empresa.
- Validar saldo antes de redimir.
- Preparar migracion o script inicial de base de datos.

### Web Dev

- Crear interfaz MVP:
  - dashboard simple
  - clientes
  - registrar compra
  - redimir puntos
  - configuracion de empresa
- Priorizar usabilidad operativa sobre marketing.

### QA

- Validar flujo completo:
  - registrar cliente
  - registrar compra
  - impedir factura duplicada
  - mostrar saldo
  - redimir puntos
  - impedir redencion mayor al saldo
  - validar separacion por empresa cuando aplique

## Tareas siguientes sugeridas

1. Product / Architect / Release: confirmar alcance de MVP fase 1.
2. Product / Architect / Release: crear documentos base del repo si aun no existen.
3. Infra Azure: proponer recursos y costo minimo para Azure SQL + Static Web Apps + Functions.
4. Backend/API: proponer modelo SQL inicial y contratos API.
5. Web Dev: proponer pantallas MVP.
6. QA: preparar checklist de validacion MVP.

## Criterios de aceptacion de esta tarea

- Product / Architect / Release confirma si fase 1 sera demo o uso real con empresas.
- Se decide si Azure SQL Database sera la persistencia del MVP.
- Se aprueba o ajusta el alcance funcional inicial.
- Se crean tareas separadas para Infra Azure, Backend/API, Web Dev y QA.

## Riesgos

- Construir solo una pagina estatica puede dejar una demo bonita, pero no un sistema operable.
- No definir persistencia desde el inicio puede complicar la integridad de puntos y facturas.
- Incluir multiempresa completo en fase 1 puede alargar el MVP.
- No involucrar Infra Azure temprano puede bloquear despliegue, secretos, conexion SQL y costos.

## Recomendacion para Product / Architect / Release

- Tema: Arranque formal de Punto Club MVP.
- Motivo: La idea ya implica datos persistentes, reglas de negocio y operacion multiempresa futura.
- Prioridad sugerida: MVP bloqueante.
- Equipo sugerido: Product / Architect / Release con apoyo inmediato de Infra Azure, Backend/API, Web Dev y QA.
- Documento/tarea sugerida: Usar este archivo como TASK-001 y derivar tareas TASK-002 en adelante.
- Riesgo si no se hace: El proyecto puede empezar como una landing visual sin la base necesaria para operar compras, puntos, redenciones y facturas unicas.
