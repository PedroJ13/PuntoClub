Equipo:
Infra / Azure

Tarea completada:
Renovacion temporal segura del paquete de Azure Functions y recomendacion de ruta repetible para deploy de API.

Opcion recomendada:
- Para el piloto inmediato: mantener la renovacion temporal ejecutada en esta tarea para eliminar el riesgo de expiracion cercana.
- Para resolver la deuda operativa: crear workflow GitHub Actions de deploy API con autenticacion Azure segura.
- Preferencia para workflow futuro: GitHub Actions + Azure OIDC/federated credentials + `azure/login`.
- Alternativa rapida si OIDC toma mas tiempo: GitHub Secret con publish profile/deployment credential, tratado como secreto.

Decision ejecutada en esta tarea:
- Se renovo `WEBSITE_RUN_FROM_PACKAGE` de `func-puntoclub-prod-br-001`.
- Se genero un nuevo zip limpio de `api/`.
- Se subio el paquete a Storage privado.
- Se actualizo `WEBSITE_RUN_FROM_PACKAGE` usando JSON temporal fuera del repo.
- Se reinicio la Function App.
- No se borro el paquete anterior.

Paquete anterior:
```text
/function-releases/api-task039-20260603152441.zip
SAS expiraba: 2026-06-10T21:28Z
```

Paquete nuevo:
```text
/function-releases/api-task054-20260605212803.zip
SAS expira: 2027-06-05T21:31Z
```

Verificacion de paquete nuevo:
```text
RUN_FROM_PACKAGE=present
HOST=stpuntoclubfuncbr001.blob.core.windows.net
PATH=/function-releases/api-task054-20260605212803.zip
HAS_SAS_SIG=True
SAS_EXPIRES=2027-06-05T21:31Z
```

Empaquetado:
- Archivos en zip: `7503`
- Tamano aprox.: `12.71 MB`
- Incluye dependencias necesarias para runtime.
- Excluye:
  - `local.settings.json`
  - `local-secrets/`
  - logs
  - top-level tests

Verificacion previa:
- `npm test` fallo inicialmente dentro de sandbox con `spawn EPERM`.
- Reejecutado fuera de sandbox: 9 tests pasaron.

Evidencia del smoke test:
```json
{
  "ok": true,
  "customerId": "39",
  "balanceBefore": {
    "customerId": "39",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "39",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

Recursos tocados:
- Function App: `func-puntoclub-prod-br-001`
- Storage Account: `stpuntoclubfuncbr001`
- Container: `function-releases`
- App setting actualizado: `WEBSITE_RUN_FROM_PACKAGE`

Secretos:
- No se imprimio SAS completo.
- No se imprimieron tokens, passwords ni connection strings.
- No se guardaron secretos en repo.
- Se uso archivo JSON temporal fuera del repo para actualizar `WEBSITE_RUN_FROM_PACKAGE`; fue eliminado al terminar.

Archivos creados/cambiados:
- `tasks/TASK-054-HANDOFF.md`
- No se crearon workflows en esta tarea.
- No se cambiaron archivos de API.

Recomendacion concreta para deploy repetible:
- Crear una tarea P1 para workflow API en GitHub Actions.
- Workflow sugerido:
  - trigger: push a `main` con cambios en `api/**` y workflow manual `workflow_dispatch`.
  - autenticar con Azure OIDC si es posible.
  - instalar dependencias en entorno limpio.
  - correr `npm test`.
  - empaquetar `api/` sin `local.settings.json`, `local-secrets/`, logs ni tests.
  - publicar a `func-puntoclub-prod-br-001`.
  - ejecutar `npm run smoke` contra `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- Secrets/permisos requeridos si se usa OIDC:
  - configurar federated credential en Azure para repo `PedroJ13/PuntoClub`.
  - permisos de deploy sobre Function App / resource group.
  - sin guardar publish profile si se usa OIDC correctamente.
- Secrets requeridos si se usa publish profile:
  - GitHub secret con publish profile o deployment credential.
  - Tratarlo como secreto rotatable.

Apoyo requerido del usuario:
- Decidir si se abre tarea para configurar GitHub Actions de API con OIDC.
- Si se elige OIDC, confirmar permisos para crear app registration/service principal o federated credential.
- Si se elige publish profile, confirmar uso de GitHub Secret para credencial de deploy.

Resultado:
Riesgo P1 inmediato mitigado. La API estable sigue funcionando y el SAS de paquete ahora vence el `2027-06-05T21:31Z`. Queda pendiente resolver la repetibilidad formal del deploy API mediante GitHub Actions.
