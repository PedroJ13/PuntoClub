# TASK-071 - Revalidar copy publicado despues del deploy

## Equipo

QA

## Contexto

TASK-069 corrigio localmente el copy sin resultados:

```text
Sin resultados. Complete el registro para crear este cliente.
```

TASK-070 no aprobo porque la URL publicada todavia servia `src/app.js` anterior con:

```text
Sin resultados. Registre el cliente en la zona 2.
```

Esta tarea repite QA despues de commitear y desplegar TASK-069 en Static Web Apps.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Confirmar que el `src/app.js` publicado ya no contiene referencias a `zona` y que el estado sin resultados guia correctamente hacia registro.

## Alcance

- Confirmar que HTML/JS/CSS publicados no contienen textos visibles con:
  - `Zona`;
  - `zona`;
  - `zona 2`;
  - `Zona 2`.
- Confirmar que el copy viejo no aparece:

```text
Sin resultados. Registre el cliente en la zona 2.
```

- Confirmar que el copy nuevo aparece cuando corresponde:

```text
Sin resultados. Complete el registro para crear este cliente.
```

- Ejecutar busqueda sin resultado.
- Confirmar que el foco pasa a registro.
- Registrar un cliente nuevo desde ese estado.
- Confirmar que el cliente aparece en resultados.
- Ejecutar smoke corto de compra.
- Si el cliente queda con puntos, ejecutar smoke corto de redencion.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- Commit/deploy de TASK-069 en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-071-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
