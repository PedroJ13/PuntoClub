# TASK-047 - Ajustar flujo clientes para registrar compra desde cliente

## Equipo

Web Dev

## Contexto

PO Test valido la URL publicada y encontro friccion operativa en el flujo de clientes.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Hallazgos de PO Test

- Al abrir la pagina no debe buscar/cargar clientes automaticamente.
- Al registrar cliente, debe permitir registrar compra de una vez o llevar al usuario al registro de compra de ese cliente.
- Si al registrar cliente ya existe, mostrar mensaje claro y llevar al registro de compra del cliente existente.
- En la tarjeta/lista de cliente, mostrar puntos acumulados.
- En la tarjeta/lista de cliente, agregar boton `Registrar compra`.

## Objetivo

Reducir pasos de caja: buscar/crear cliente y pasar inmediatamente a registrar compra para ese cliente, mostrando saldo de puntos visible.

## Alcance

- No cargar listado inicial automaticamente al abrir la pagina.
- Mantener busqueda manual por telefono, nombre o email.
- Para cada cliente mostrado:
  - mostrar nombre, telefono, email.
  - mostrar puntos acumulados actuales.
  - agregar boton `Registrar compra`.
- Agregar UI minima para registrar compra de un cliente seleccionado:
  - cliente seleccionado visible.
  - factura/numero de comprobante.
  - fecha de compra, por defecto hoy.
  - monto.
  - submit `Registrar compra`.
- Usar endpoint existente:
  - `POST /api/companies/{companyId}/purchases`
- Refrescar puntos del cliente despues de registrar compra.
- Si `POST /customers` responde `DUPLICATE_CUSTOMER`:
  - mostrar mensaje entendible.
  - buscar el cliente por telefono/email ingresado.
  - si se encuentra, seleccionarlo y abrir/mostrar el registro de compra.
- Mantener estado publicado usando `app-config.js` con API real.
- Actualizar copy para que el flujo sea claro para caja.

## No tocar

- No implementar redenciones.
- No implementar login/auth.
- No cambiar contratos API salvo bloqueo real.
- No guardar secretos.
- No crear recursos Azure nuevos.

## Consideraciones tecnicas

- La API ya tiene contrato para saldo:
  - `GET /api/companies/{companyId}/customers/{customerId}/balance`
- La API ya tiene contrato para compras:
  - `POST /api/companies/{companyId}/purchases`
- Si el listado trae muchos clientes, evitar llamadas innecesarias; para MVP piloto se acepta cargar saldo de los resultados visibles.
- Si Backend/API impide resolver duplicado a cliente existente, documentar el bloqueo en el handoff con detalle exacto.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-047-HANDOFF.md
```

Incluye:

- URL/ambiente probado.
- Cambios realizados.
- Evidencia de no carga inicial automatica.
- Evidencia de puntos visibles.
- Evidencia de registrar compra desde cliente existente.
- Evidencia de crear cliente y pasar a compra.
- Evidencia de duplicado y paso a compra del existente.
- Pendientes o bloqueos si aparecen.
