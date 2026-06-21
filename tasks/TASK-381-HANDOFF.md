Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: TASK-381 - Publicar API de busqueda de clientes sin mayusculas ni acentos
Archivos cambiados:
- `api/src/lib/repository.js`
- `api/test/repository-customer-search.test.js`
- `api/package.json`
- `tasks/TASK-381-HANDOFF.md`
Verificacion ejecutada:
- TASK-380 revisado: QA local aprobo sin P0/P1.
- `node --check api/src/lib/repository.js`: OK.
- `node --test test/repository-customer-search.test.js`: OK.
- Commit publicado: `ec00934298714aa679bed30873eab07199a7cbeb`.
- Workflow API: `Deploy Punto Club API`, run `27893003429`, resultado `success`.
- El workflow ejecuto `npm test`, deploy de Azure Functions y `npm run smoke` contra API publicada.
- `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/6/customers`: `200`.
- Verificacion publicada segura con datos existentes sin imprimirlos:
  - busqueda por nombre existente en mayusculas y sin acentos: `200`, `Count=1`;
  - busqueda por correo existente en mayusculas: `200`, `Count=1`.
Resultado:
- API publicada por flujo habitual.
- El alcance publicado mantiene busqueda exacta por telefono y busqueda `CI_AI` para nombre/correo.
- `repository.listCustomers` publicado con `COLLATE Latin1_General_100_CI_AI` para `email` y `name`.
Uso DB cloud: Si, motivo: workflow API ejecuto smoke publicado y verificacion segura contra endpoint real, alcance: lectura/listado de clientes de `PILOT_COMPANY_ID=6` sin imprimir datos sensibles.
Riesgos o pendientes:
- La prueba publicada confirma case-insensitive con datos existentes; accent-insensitive queda cubierto por test automatizado del workflow porque la data viva actual no necesariamente contiene el par exacto con acento buscado.
Siguiente recomendado:
- Ejecutar TASK-382 para publicar el ajuste Web mock separado y luego TASK-383 para QA publicado.
