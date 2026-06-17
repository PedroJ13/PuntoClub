# TASK-278 - Preparar escenario de prueba E2E de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 21
Depende de: TASK-277
Estado: Assigned

## Objetivo

Preparar un escenario seguro y documentado para probar el flujo completo de membresias con una empresa autenticada.

## Contexto

Las ultimas tareas de membresias fueron aprobadas con observaciones porque QA no tuvo sesion real ni datos reales. Antes de seguir agregando funcionalidad, necesitamos un escenario controlado para validar de punta a punta.

## Alcance

1. Revisar handoffs de TASK-261, TASK-264, TASK-267, TASK-270, TASK-274 y TASK-277.
2. Identificar que datos minimos necesita la prueba E2E:
   - empresa activa;
   - cliente;
   - plan de membresia activo;
   - beneficios activos;
   - membresia activa;
   - membresia proxima a vencer o vencida;
   - transacciones `new_membership` y `renewal`.
3. Preparar datos solo si se puede hacer sin afectar datos reales importantes.
4. Si no es seguro crear datos desde API/DB, dejar instrucciones exactas para crearlos desde UI.
5. No imprimir ni exponer credenciales, cookies, tokens ni secretos.

## Entregable esperado

Crear o actualizar `tasks/TASK-278-HANDOFF.md` con:

- Resultado.
- Empresa usada o recomendada para prueba.
- Datos creados o instrucciones para crearlos.
- IDs publicables si no son sensibles.
- Riesgos.
- Que puede validar QA o el usuario despues.

## Reglas

- No limpiar base de datos.
- No borrar empresas/clientes reales.
- No exponer secretos.
- No crear credenciales nuevas salvo que el usuario lo pida.
- Si requiere firewall, credenciales o permisos, bloquear y explicar exactamente que falta.
