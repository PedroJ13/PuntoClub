# TASK-510 - Definir modelo funcional del centro de comunicaciones para clientes

Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Definicion funcional
Estado: Ready
Prioridad: P1 definicion funcional

## Objetivo

Definir el modelo funcional del centro de comunicaciones para clientes de Punto Club, separando correos operativos, correos promocionales, configuracion por empresa, preferencias del cliente y variables disponibles como puntos actuales.

## Contexto

El producto ya usa ACS Email para comunicaciones de empresa/invitacion/reset y ya tiene clientes con correo opcional. Actualmente el registro de cliente no envia correo de bienvenida y las compras/canjes tampoco envian confirmaciones al cliente.

Se quiere habilitar una ruta futura para:

- correos operativos a clientes;
- promociones/campanas creadas por empresas;
- configuracion por empresa;
- preferencias de comunicacion por cliente;
- baja de correos promocionales sin perder puntos, beneficios ni membresias.

## Alcance

1. Definir categorias de comunicacion.
2. Definir reglas de consentimiento/preferencias.
3. Definir eventos operativos iniciales.
4. Definir capacidades de campanas/promociones.
5. Definir variables disponibles en plantillas.
6. Definir configuracion por empresa.
7. Definir limites MVP y dependencias por equipo.

## Fuera de alcance

- No implementar codigo.
- No disenar SQL final.
- No enviar correos reales.
- No tocar Azure SQL.
- No hacer deploy.

## Handoff esperado

Crear o actualizar `tasks/TASK-510-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Modelo funcional:
Correos operativos:
Correos promocionales:
Preferencias / baja:
Configuracion por empresa:
Variables disponibles:
Alcance MVP:
Fuera de MVP:
Tareas recomendadas:
Uso cloud/SQL:
Riesgos o pendientes:
Movimiento de tablero sugerido:
```
