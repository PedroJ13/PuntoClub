# TASK-109 - Crear pantalla de configuracion de empresa piloto

## Equipo

Web Dev

## Contexto

Esta fase usa Opcion A: configuracion de empresa piloto. No se implementa login, selector de empresa ni multiempresa autoservicio.

Backend/API debe completar TASK-108 con contrato final.

## Objetivo

Agregar una pantalla simple para ver y editar configuracion de la empresa piloto.

## Alcance

- Agregar acceso `Empresa` o `Configuracion`.
- Mostrar datos actuales:
  - nombre;
  - email;
  - telefono;
  - logo URL si existe;
  - porcentaje de puntos;
  - estado.
- Permitir editar:
  - nombre;
  - email;
  - telefono;
  - logo URL si el API lo soporta;
  - porcentaje de puntos.
- Mostrar confirmacion visible al guardar.
- Manejar:
  - loading;
  - error de validacion;
  - error API;
  - guardado exitoso.
- No cargar datos pesados ni reportes automaticamente.
- Desktop/mobile sin overflow horizontal.

## No tocar

- No cambiar API.
- No implementar auth.
- No implementar selector de empresa.
- No cambiar flujo de Caja, Reporte o Auditoria salvo navegacion minima.
- No redisenar colores/branding general.

## Dependencias

- TASK-108 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-109-HANDOFF.md
```

Incluye cambios, ruta/API consumida, evidencia local/publicada si aplica, validaciones y responsive.
