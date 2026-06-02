# MVP Criteria

## Objetivo MVP

Permitir que una empresa piloto registre clientes, compras, puntos y redenciones de forma confiable.

## Criterios funcionales

- Configurar una empresa inicial con porcentaje de puntos por compra.
- Registrar clientes con nombre, telefono y email.
- Buscar clientes por telefono, nombre o email.
- Registrar compras asociadas a cliente y empresa.
- Impedir factura duplicada dentro de la misma empresa.
- Calcular puntos ganados por compra.
- Mostrar saldo disponible del cliente.
- Registrar redenciones.
- Impedir redimir mas puntos de los disponibles.
- Mostrar historial resumido de compras y redenciones.

## Criterios tecnicos

- Usar Azure Static Web Apps para frontend.
- Usar Azure Functions para API.
- Usar Azure SQL Database para persistencia.
- No guardar secretos en frontend ni en archivos del repo.
- Mantener separacion de datos por empresa desde el modelo.

## Fuera de alcance fase 1

- Registro publico autoservicio de empresas.
- Aprobacion administrativa de empresas.
- Invitaciones y password de empresa.
- Estadisticas avanzadas.
- Marketplace o planes de pago.
