# TASK-070 - Revalidar copy sin referencia a zonas

## Equipo

QA

## Contexto

TASK-068 no aprobo por una referencia visible a `zona 2` en el estado sin resultados:

```text
Sin resultados. Registre el cliente en la zona 2.
```

TASK-069 debe quitar ese copy y preservar el flujo.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Validar en ambiente publicado que ya no aparece ninguna referencia visible a zonas y que el caso sin resultados sigue guiando correctamente hacia registro.

## Alcance

- Confirmar que el HTML/JS/CSS publicado no muestra textos visibles con:
  - `Zona 1`;
  - `Zona 2`;
  - `Zona 3`;
  - `Zona 4`;
  - `zona 2`;
  - `zona`.
- Abrir la pantalla publicada y confirmar que no hay labels de zonas.
- Ejecutar busqueda sin resultado.
- Confirmar que el mensaje no menciona zonas.
- Confirmar que el foco pasa a registro.
- Registrar un cliente nuevo desde ese estado.
- Confirmar que el cliente aparece en resultados.
- Confirmar que las acciones `Compra` y `Redimir` no se rompieron con smoke corto.

## No tocar

- No implementar cambios.
- No cambiar Azure.
- No imprimir secretos.

## Dependencias

- TASK-069 completada y desplegada en Static Web Apps.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-070-HANDOFF.md
```

Incluye resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 y evidencia resumida.
