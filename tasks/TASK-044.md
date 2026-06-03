# TASK-044 - Revalidar frontend publicado

## Estado

Asignada a Web Dev / QA.

## Contexto

TASK-042 no fue ejecutable porque no existia una URL frontend publicada de Punto Club.

TASK-044 debe repetirse despues de TASK-043, cuando exista Static Web Apps u otra URL estable del frontend.

## Objetivo

Validar el flujo clientes desde la URL frontend publicada contra la API estable.

## Alcance

- Abrir URL frontend estable.
- Confirmar que la UI usa API real.
- Buscar/listar clientes.
- Registrar cliente.
- Buscar cliente recien creado.
- Validar duplicado.
- Validar campos requeridos.
- Probar desktop/mobile basico.
- Confirmar que CORS funciona desde el hostname real.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No editar configuracion de Azure salvo que Infra lo pida explicitamente.
- No guardar secretos.

## Dependencias

- TASK-043 completada.
- URL frontend publicada disponible.
- CORS configurado para hostname real.

## Handoff esperado

Crear `tasks/TASK-044-HANDOFF.md` con resultado aprobado/no aprobado, URL probada, checks ejecutados, hallazgos P0/P1 si aparecen y evidencia suficiente para PO Test.
