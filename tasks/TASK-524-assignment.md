# TASK-524 - Push controlado del paquete de comunicaciones y verificacion de workflow frontend

Equipo: Product / Architect / Release
Modo de ejecucion: Web Release
Estado: Ready
Prioridad: P1 release web controlado
Depende de: TASK-523

## Objetivo

Publicar a `origin/main` el paquete local de comunicaciones aprobado en TASK-523 y verificar que el workflow frontend se ejecute correctamente sin disparar workflow API.

## Contexto

TASK-523 aprobo publicar el centro de comunicaciones como UI Web/mock con envio real bloqueado. El paquete toca `app/**`, por lo que debe disparar deploy frontend. No toca `api/**`, `database/**` ni workflows.

## Alcance

1. Revisar commits ahead.
2. Confirmar que no hay cambios `api/**`, `database/**` ni workflows.
3. Ejecutar push controlado a `origin/main`.
4. Confirmar workflow frontend.
5. Confirmar que no se disparo workflow API para el commit publicado.
6. Verificar por HTTP que la Web publicada contiene la seccion de Comunicaciones.
7. Crear handoff.

## Fuera de alcance

- No tocar Azure SQL.
- No ejecutar deploy manual.
- No enviar correos reales.
- No implementar API/SQL de comunicaciones.
- No incluir logs locales.

## Handoff esperado

Crear o actualizar `tasks/TASK-524-HANDOFF.md`.
