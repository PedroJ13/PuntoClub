Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea completada: TASK-382 - Publicar ajuste Web mock de busqueda de clientes
Archivos cambiados:
- `app/src/customerApi.js`
- `app/src/app.js`
- `tasks/TASK-382-HANDOFF.md`
Verificacion ejecutada:
- TASK-380 revisado: QA local aprobo sin P0/P1.
- `node --check app/src/customerApi.js`: OK.
- `node --check app/src/app.js`: OK.
- Commit publicado: `4c6b50015e06f8f30abeb94b3bba04ff7cbd9c7b`.
- Workflow Static Web Apps: `Deploy Punto Club frontend`, run `27893136360`, resultado `success`.
- `GET https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/customerApi.js?v=4c6b500`: `200`, contiene `Mar\u00eda Soto`, `Jos\u00e9 Vega`, `.normalize("NFD")` y remocion de diacriticos.
- `GET https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/app.js?v=4c6b500`: `200`, contiene `.normalize("NFD")` y remocion de diacriticos.
Resultado:
- Ajuste Web/mock publicado por flujo habitual.
- El mock publicado ya no diferencia mayusculas/minusculas ni acentos en la normalizacion local.
- La normalizacion local de `app/src/app.js` tambien quedo publicada para filtros/comparaciones en memoria.
Uso DB cloud: No
Riesgos o pendientes:
- No se hizo prueba visual manual; el cambio es de normalizacion mock/local y no modifica layout.
Siguiente recomendado:
- Ejecutar TASK-383 para QA publicado de API/Web y no regresion de busqueda.
