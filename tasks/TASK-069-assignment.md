# TASK-069 - Quitar referencia a zona en mensaje sin resultados

## Equipo

Web Dev

## Contexto

TASK-068 valido que el layout ajustado ya esta publicado y que el flujo cliente + compra + redencion funciona. Sin embargo, QA no aprobo por un P1 puntual de copy:

```text
Sin resultados. Registre el cliente en la zona 2.
```

El layout ya no muestra zonas numeradas, por lo que cualquier referencia a `zona 2` confunde y contradice el criterio visual de PO Test.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Eliminar toda referencia visible a `zona`, `Zona`, `zona 2` o equivalentes en mensajes de la UI publicada.

## Cambio requerido

- Cambiar el copy del estado sin resultados.
- Sugerencia de texto:

```text
Sin resultados. Complete el registro para crear este cliente.
```

Tambien es aceptable:

```text
Sin resultados. Use Registrar cliente para crearlo.
```

## Validaciones esperadas

- Buscar en codigo que no queden textos visibles con:
  - `Zona`;
  - `zona`;
  - `zona 2`;
  - `Zona 2`.
- Probar busqueda sin resultado:
  - mensaje no debe mencionar zonas;
  - foco debe seguir pasando a registro;
  - flujo de registro nuevo debe seguir funcionando.
- Confirmar que compra/redencion no se afectaron.

## No tocar

- No cambiar layout.
- No cambiar contratos API.
- No cambiar backend/API.
- No crear recursos Azure.
- No guardar secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-069-HANDOFF.md
```

Incluye:

- Copy final usado.
- Archivos modificados.
- Evidencia de busqueda sin resultado sin referencia a zonas.
- Evidencia de busqueda/registro nuevo funcionando.
- Evidencia de que no quedan referencias visibles a `zona`.
