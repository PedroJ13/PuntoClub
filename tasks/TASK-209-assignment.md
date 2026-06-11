# TASK-209 - Corregir transicion despues de login exitoso

Equipo responsable: Web Dev

## Contexto

Product Owner probo el flujo real de alta/acceso de empresa. Despues de aprobar la empresa y llegar al login, la pantalla muestra `Sesion iniciada.` y el encabezado muestra `Empresa activa: TEST - pj13eros_business@outlook.com`, pero al presionar `Entrar` la UI se queda en la misma pantalla de login.

Esto indica que la sesion existe, pero la Web no transiciona claramente al panel operativo.

## Objetivo

Asegurar que, despues de login exitoso o cuando ya existe una sesion activa, la Web lleve al panel principal operativo de la empresa y no deje al usuario atrapado en la pantalla de login.

## Alcance

- Revisar flujo de `Iniciar sesion` cuando `/api/me` ya devuelve empresa activa.
- Revisar comportamiento del boton `Entrar` despues de mostrar `Sesion iniciada.`.
- Despues de login exitoso, navegar o cambiar vista a panel operativo principal.
- Si la sesion ya esta activa al cargar la pagina, mostrar directamente el panel operativo o un acceso claro al mismo.
- Evitar pedir password de nuevo si la sesion ya esta activa.
- Mantener `Cerrar sesion` funcionando.
- No cambiar auth Backend/API salvo que se descubra un bug de contrato.
- No exponer cookies, tokens, passwords ni secretos.

## Criterios de aceptacion

- Con credenciales validas, al presionar `Entrar`, el usuario llega a Operaciones o al panel principal.
- Si el encabezado muestra `Empresa activa`, la pantalla no debe quedar bloqueada en login sin salida clara.
- Refrescar la pagina con sesion activa debe conservar acceso al panel operativo.
- Cerrar sesion limpia estado y vuelve al login.
- No hay regresion en solicitud de empresa, aceptar invitacion ni operaciones autenticadas.

## Entregable

Crear o actualizar `tasks/TASK-209-HANDOFF.md` con:

- Resultado.
- Causa encontrada.
- Archivos modificados.
- Pruebas ejecutadas.
- Pendientes o bloqueos.
