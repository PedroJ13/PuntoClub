# Azure SQL - uso minimo en desarrollo y pruebas

## Objetivo

Reducir consumo de Azure SQL durante desarrollo y QA. La base real debe usarse solo cuando aporte evidencia que no se pueda obtener localmente.

## Regla principal

Por defecto, trabajar sin despertar Azure SQL.

Usar Azure SQL solo para:

- aplicar o validar migraciones aprobadas;
- probar integracion real antes de cierre de tarea o release;
- reproducir un bug que solo ocurre contra Azure;
- smoke test corto de endpoints criticos;
- verificar configuracion de Infra o secrets.

No usar Azure SQL para:

- revisar pantallas, copy, iconos, responsive o UX;
- pruebas repetitivas de formularios;
- desarrollo normal de frontend;
- ejecutar ciclos largos de QA;
- polling, automatizaciones o monitores;
- seeds masivos o datos temporales sin tarea explicita.

## Ambientes preferidos

1. UI y UX: usar mock/local state siempre que sea posible.
2. Backend/API: usar tests unitarios o repositorios simulados cuando apliquen.
3. Integracion local: usar `func start` y datos locales/mock si la tarea lo permite.
4. Azure SQL: usar solo como validacion final y corta.

## Reglas para QA

- Antes de probar, indicar ambiente: `mock/local`, `api local` o `Azure real`.
- Si la prueba no requiere persistencia real, no usar Azure SQL.
- Agrupar validaciones reales en una sola ventana corta.
- Evitar repetir el mismo flujo contra Azure si ya paso una vez y no cambio el backend.
- No dejar navegadores, herramientas SQL, Query Editor, SSMS, Azure Data Studio o scripts conectados.
- Si Azure SQL esta pausada y la tarea no requiere Azure real, no despertarla.
- En el handoff, declarar si se uso Azure SQL y por cuanto alcance aproximado.

## Reglas para Ejecucion Tecnica

- Web Dev y Diseno/UX no deben usar Azure SQL salvo que la tarea lo pida explicitamente.
- Copy / Gramatica no debe usar Azure SQL.
- Backend/API debe preferir tests automatizados antes de smoke real.
- SQL DEV debe usar Azure SQL solo para migraciones o verificaciones necesarias.
- Infra puede consultar configuracion Azure, pero debe evitar acciones que despierten la DB salvo que sea parte de la tarea.

## Checklist antes de usar Azure SQL

Responder mentalmente:

1. La tarea exige persistencia real en Azure?
2. Puedo validar esto con test unitario, mock o API local?
3. Puedo agrupar la prueba con otras validaciones reales?
4. Tengo claro que consulta o flujo voy a ejecutar?
5. Cerrare conexiones al terminar?

Si alguna respuesta indica duda, no usar Azure SQL y reportar la limitacion.

## Handoff

Agregar una linea al handoff:

```text
Uso Azure SQL: No / Si, motivo: <motivo corto>, alcance: <consulta/migracion/smoke>
```

## Configuracion recomendada de costo

Para la DB piloto:

- serverless;
- max vCores bajo, idealmente `1` si alcanza;
- min capacity `0.5`;
- auto-pause en el minimo permitido;
- no despertar la DB para tareas visuales o de copy.

Si se cambia `freeLimitExhaustionBehavior` a `BillOverUsage`, documentar que puede generar cobro cuando se supere la cuota gratis.
