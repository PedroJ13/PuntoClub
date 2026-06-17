# TASK-284 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Diseno/UX
Estado: Completed
Fecha: 2026-06-15

## Decision visual recomendada

Usar `Atender cliente` como entrada operativa principal.

La pantalla debe ser cliente primero:

1. Identificar o registrar cliente.
2. Mostrar ficha unica del cliente.
3. Mostrar puntos, membresias, alertas y acciones disponibles segun flags de la empresa.

No duplicar busquedas por `Puntos` y `Membresias`.

## Wireflow textual

```text
Atender cliente

Buscar cliente
-> Resultados
-> Seleccionar cliente
   o
-> Sin resultados
-> Registrar cliente
-> Cliente queda seleccionado

Ficha del cliente
-> Datos del cliente
-> Resumen de puntos
-> Resumen de membresias
-> Alertas
-> Acciones rapidas

Acciones
-> Registrar compra / puntos
-> Redimir puntos
-> Pagar membresia / activar
-> Renovar membresia
-> Aplicar beneficio
-> Ver historial
```

## Estructura de pantalla

- Panel izquierdo superior: `Buscar cliente`
  - Campo: `Telefono, nombre o email`
  - Accion: `Buscar`
  - Accion secundaria: `Limpiar`
- Panel izquierdo medio: `Resultados`
  - Lista de clientes encontrados.
  - Accion por fila: `Atender`.
- Panel derecho: `Registrar cliente`
  - Nombre.
  - Telefono.
  - Email.
  - Accion: `Registrar cliente`.
- Panel inferior/ancho: `Ficha del cliente`
  - Datos del cliente seleccionado.
  - `Puntos` si estan habilitados.
  - `Membresias` si estan habilitadas.
  - `Alertas`.
  - Acciones operativas.

## Estados de pantalla

- Sin busqueda:
  - Mensaje: `Busque un cliente para iniciar la atencion.`
- Buscando:
  - Mensaje: `Buscando clientes...`
- Sin resultados:
  - Mensaje: `Sin resultados. Registre el cliente para continuar.`
- Cliente seleccionado:
  - Mostrar ficha y acciones disponibles.
- Cliente recien registrado:
  - Mensaje: `Cliente registrado. Continue con la atencion.`
  - Cliente queda seleccionado sin buscar de nuevo.
- Cliente con puntos:
  - Mostrar saldo disponible, ganados, redimidos e historial.
- Cliente con membresia activa:
  - Mostrar plan, estado, fecha de vencimiento, beneficios y accion `Aplicar beneficio`.
- Cliente con membresia vencida:
  - Mostrar alerta de vencimiento y accion `Renovar membresia`.
- Cliente con ambos tipos:
  - Mostrar secciones `Puntos` y `Membresias` en la misma ficha.

## Copy sugerido

- Menu: `Atender cliente`
- Busqueda: `Buscar cliente`
- Resultados: `Resultados`
- Registro: `Registrar cliente`
- Ficha: `Ficha del cliente`
- Acciones puntos:
  - `Registrar compra`
  - `Redimir puntos`
  - `Ver historial`
- Acciones membresias:
  - `Pagar membresia`
  - `Renovar membresia`
  - `Aplicar beneficio`
  - `Ver usos`
  - `Ver transacciones`
- Alertas:
  - `Membresia vencida.`
  - `Membresia proxima a vencer.`
  - `Cliente tiene puntos disponibles.`
  - `Cliente sin email.`

## Criterios de QA funcional

- Menu principal de empresa normal muestra `Atender cliente`, `Mi empresa`, `Reportes`.
- `Puntos` y `Membresias` no aparecen como entradas operativas principales.
- Buscar cliente muestra resultados y permite seleccionar.
- Registrar cliente deja al cliente seleccionado y muestra ficha.
- Si puntos esta habilitado, la ficha muestra saldo y acciones de puntos.
- Si membresias esta habilitado, la ficha muestra estado, beneficios y acciones de membresia.
- Si ambos estan habilitados, ambas secciones aparecen juntas.
- Configuracion de puntos/planes/beneficios permanece en `Mi empresa`.
- Reportes permanecen en `Reportes`.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Riesgos o dudas abiertas

- Si un cliente tiene multiples membresias renovables, MVP debe priorizar una sola membresia renovable segun la regla actual.
- `Pagar membresia` se usa como copy de activacion; renovacion mantiene accion explicita `Renovar membresia` para evitar ambiguedad operativa.
- Si los endpoints actuales se usan de forma compuesta, la ficha puede hacer varias llamadas por cliente seleccionado.
