# TASK-193 - Confirmar storage privado para logos de empresa

Equipo responsable: Infra / Azure

## Contexto

Punto Club ya tiene auth propia, operacion autenticada y rate limiting aprobados en publicado. La siguiente mejora funcional es permitir que una empresa complete su perfil visual con logo privado.

Infra ya preparo storage privado de logos en fases anteriores, pero antes de implementar upload/serving real conviene confirmar el estado actual y los app settings disponibles.

## Objetivo

Confirmar que Azure Storage para logos esta listo para uso por Backend/API y documentar los valores/configuracion necesarios sin exponer secretos.

## Alcance

- Verificar storage/container privado de logos aprobado para Punto Club.
- Confirmar si la Function App tiene app settings necesarios para:
  - connection string o identidad/acceso seguro;
  - container de logos;
  - limites de tamano/tipos si existen como config.
- Confirmar que el contenedor no es publico.
- Confirmar ruta recomendada:
  - upload via API;
  - lectura/descarga via API o URL controlada;
  - no exponer blob publico directo si no esta aprobado.
- No crear recursos nuevos salvo que falte algo pequeno ya aprobado y quede documentado.
- No imprimir secretos, connection strings, keys ni SAS.

## Entregable

Crear o actualizar `tasks/TASK-193-HANDOFF.md` con:

- Resultado.
- Storage/container confirmado.
- App settings requeridos/presentes, con valores sensibles redaccionados.
- Recomendacion de serving seguro.
- Pendientes o bloqueos.
