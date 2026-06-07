# TASK-108 - Implementar API de configuracion de empresa piloto

## Equipo

Backend API

## Contexto

Esta fase usa Opcion A: configuracion de empresa piloto. El sistema sigue validando `companyId` contra `PILOT_COMPANY_ID`; el frontend no puede elegir empresa operativa.

TASK-107 debe confirmar el modelo SQL necesario.

## Objetivo

Implementar o completar API para leer y actualizar configuracion basica de la empresa piloto.

## Alcance

- Confirmar contrato existente de lectura de settings.
- Implementar o ajustar endpoint de actualizacion, sugerido:

```text
PATCH /api/companies/{companyId}/settings
```

- Campos editables iniciales:
  - nombre;
  - email;
  - telefono;
  - logo URL si el modelo lo soporta;
  - porcentaje de puntos.
- Validaciones:
  - `companyId` contra `PILOT_COMPANY_ID`;
  - porcentaje mayor que `0`;
  - porcentaje menor o igual a `100`;
  - email valido si se provee;
  - telefono con longitud razonable si se provee;
  - logo URL valida si se provee.
- Los cambios deben afectar compras futuras, no recalcular historicos.
- Si TASK-107 habilita auditoria de settings, registrar evento operativo de cambio.
- Agregar pruebas unitarias/formatter/validator donde aplique.
- Actualizar `docs/API_CONTRACTS.md`.

## No tocar

- No implementar UI.
- No crear login.
- No permitir seleccionar empresa desde frontend.
- No recalcular compras historicas.
- No imprimir secretos.

## Dependencias

- TASK-107 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-108-HANDOFF.md
```

Incluye contrato final, validaciones, pruebas, si requiere migracion aplicada y pendientes de deploy.
