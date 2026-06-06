Equipo:
Infra / Azure

Tarea completada:
TASK-080 - Evaluar endurecimiento operativo SQL pre-piloto.

Archivos cambiados:
- `tasks/TASK-080-HANDOFF.md`

Verificacion ejecutada:
- Se leyo `tasks/TASK-080-assignment.md`.
- Se leyo contexto minimo Infra:
  - `codex-project-templates/INFRA.md`
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/ARCHITECTURE.md`
- Se consulto firewall actual de `sqlserver-pj13-brazil` en modo solo lectura:
  - Regla presente: `AllowAllWindowsAzureIps` (`0.0.0.0` a `0.0.0.0`)
  - No aparece la regla temporal `tmp-task077-sql-audit-200-229-6-103`.
- Se consulto Azure SQL en modo solo lectura:
  - DB: `sql-db-puntoclub`
  - Estado observado: `Paused`
  - Tier: `GeneralPurpose`
  - SKU: `GP_S_Gen5_2`
  - Serverless/free limit: `useFreeLimit=true`
  - `autoPauseDelay=60`
  - `minCapacity=0.5`
- Se consulto Function App en modo solo lectura:
  - App: `func-puntoclub-prod-br-001`
  - Estado: `Running`
  - Region: `Brazil South`
  - Runtime: `Node|22`
  - Outbound IPs actuales:
    - `191.232.188.191`
    - `191.232.188.109`
    - `191.232.186.67`
    - `191.232.184.211`
    - `104.41.63.108`
  - Possible outbound IPs:
    - `191.232.188.191`
    - `191.232.188.109`
    - `191.232.186.67`
    - `191.232.184.211`
    - `104.41.26.175`
    - `191.232.179.28`
    - `20.226.162.71`
    - `20.226.165.4`
    - `20.226.165.95`
    - `20.226.165.113`
    - `20.226.165.144`
    - `20.226.165.148`
    - `20.206.217.131`
    - `20.206.217.248`
    - `20.206.218.130`
    - `20.206.218.133`
    - `20.206.219.113`
    - `20.206.220.39`
    - `104.41.63.108`
- Se reviso documentacion oficial de Azure para:
  - Alcance de `Allow Azure services and resources to access this server`.
  - IPs outbound/possible outbound de App Service/Functions.
  - Comportamiento de Azure SQL serverless auto-pause/resume.

Resultado:
- No se aplicaron cambios.
- No se cambio firewall.
- No se cambio tier/SKU SQL.
- No se cambiaron connection strings.
- No se crearon recursos.
- No se imprimieron secretos.

Riesgos actuales:
- P1: `AllowAllWindowsAzureIps` permite que recursos Azure, no solo los de esta suscripcion o resource group, alcancen el endpoint SQL a nivel de red. La autenticacion SQL sigue siendo necesaria, pero el filtro de red queda amplio.
- P1: Si se elimina `AllowAllWindowsAzureIps` sin alternativa, la Function App probablemente perdera conectividad a SQL.
- P1: Usar allowlist de IPs outbound de Function App reduce superficie, pero requiere mantener todas las `possibleOutboundIpAddresses`; Azure puede agregar/cambiar IPs en ciertos cambios de plan o plataforma, y un descuido puede romper API.
- P1: SQL serverless con `autoPauseDelay=60` puede estar `Paused` y causar latencia o timeout inicial durante uso real, especialmente si el primer cliente del dia dispara la reanudacion.
- P2: Mantener DB pausada reduce costo, pero complica diagnostico: un primer error puede confundirse con falla de API/firewall.
- P2: No hay staging formal; cualquier cambio de red/SKU en production afecta directamente el piloto.

Opciones recomendadas:

1. Mantener estado actual para piloto controlado, con runbook.
   - Cambios: ninguno.
   - Pros:
     - Costo bajo.
     - Menor riesgo de romper API antes del piloto.
     - Coherente si el piloto tiene bajo volumen y operadores saben esperar reanudacion.
   - Contras:
     - `AllowAllWindowsAzureIps` sigue amplio.
     - Puede haber latencia inicial por auto-pause.
   - Costo cualitativo: bajo.
   - Recomendacion Infra: aceptable solo si el piloto es pequeno/controlado y hay runbook claro.

2. Endurecer firewall con allowlist de `possibleOutboundIpAddresses` de la Function App y retirar `AllowAllWindowsAzureIps`.
   - Cambios:
     - Crear reglas SQL puntuales para las possible outbound IPs de `func-puntoclub-prod-br-001`.
     - Probar API.
     - Retirar `AllowAllWindowsAzureIps` solo despues de validar.
   - Pros:
     - Reduce acceso de red a IPs asociadas a la Function App.
     - No requiere red privada ni redisenar arquitectura.
   - Contras:
     - Gestion operativa mas delicada.
     - Si cambian IPs outbound/possible outbound, API puede fallar hasta actualizar firewall.
     - Muchas reglas para mantener.
   - Costo cualitativo: bajo en Azure, medio en operacion.
   - Recomendacion Infra: buena mejora incremental si Product/Release acepta una ventana de prueba y rollback.

3. VNet Integration + NAT Gateway o salida fija equivalente para Function App.
   - Cambios:
     - Integrar Function App con VNet.
     - Enrutar salida por NAT Gateway/IP fija.
     - Permitir solo esa IP en SQL.
   - Pros:
     - Salida predecible y firewall mas simple.
     - Mejor postura operativa que listar muchas IPs variables.
   - Contras:
     - Crea recursos de red nuevos.
     - Mayor complejidad.
     - Mayor costo fijo.
     - Puede ser demasiado para MVP/piloto pequeno.
   - Costo cualitativo: medio/alto.
   - Recomendacion Infra: no prioritario para el primer piloto salvo que haya requisito formal de seguridad/red.

4. Private Endpoint para Azure SQL y red privada para la API.
   - Cambios:
     - Crear Private Endpoint para SQL.
     - Configurar DNS privado/VNet.
     - Alinear Function App con VNet.
     - Evaluar deshabilitar public network access.
   - Pros:
     - Mejor postura de red.
     - Reduce exposicion publica de SQL.
   - Contras:
     - Mayor complejidad de red/DNS.
     - Riesgo alto de romper conectividad si se aplica rapido.
     - Costo adicional.
   - Costo cualitativo: medio/alto.
   - Recomendacion Infra: reservar para post-piloto o si el piloto exige controles empresariales.

5. Mantener serverless con runbook y calentamiento operativo.
   - Cambios:
     - No tocar SKU.
     - Antes de horarios de uso real, ejecutar una verificacion controlada que despierte SQL.
     - Documentar espera por `Paused`/`Resuming`.
   - Pros:
     - Conserva costo bajo.
     - Reduce sorpresa operativa sin cambio de infraestructura.
   - Contras:
     - Depende de disciplina operativa.
     - Puede no evitar pausas fuera de horarios previstos.
   - Costo cualitativo: bajo.
   - Recomendacion Infra: opcion preferida si se decide no aumentar costo antes del piloto.

6. Ajustar auto-pause o mover temporalmente a provisioned durante piloto.
   - Cambios posibles:
     - Subir `autoPauseDelay` para que la DB permanezca activa mas tiempo.
     - Deshabilitar auto-pause temporalmente si el modelo/SKU lo permite.
     - Cambiar a compute provisioned durante dias/horarios del piloto.
   - Pros:
     - Menos latencia inicial.
     - Menos falsos positivos de incidentes por `Paused`/`Resuming`.
   - Contras:
     - Aumenta costo.
     - Cambios de tier/SKU deben probarse y coordinarse.
   - Costo cualitativo:
     - Ajustar auto-pause: bajo/medio segun horas activas.
     - Provisioned temporal: medio.
   - Recomendacion Infra: considerar si el piloto tendra usuarios reales en horario definido y la primera impresion importa.

Recomendacion concreta:
- Para piloto pequeno/controlado:
  - Mantener serverless con runbook de calentamiento.
  - No tocar firewall antes de QA/regresion final si no hay ventana de prueba.
  - Planificar una tarea separada para probar allowlist de `possibleOutboundIpAddresses` y retiro de `AllowAllWindowsAzureIps`.
- Para piloto con usuarios externos o sensibilidad de seguridad mayor:
  - Priorizar allowlist de IPs de Function App como mejora incremental.
  - Evaluar subir auto-pause o pasar temporalmente a provisioned durante la ventana del piloto.
- No recomiendo Private Endpoint/NAT Gateway como primer cambio inmediato salvo que haya requisito explicito, porque agrega complejidad y costo antes de validar operacion real.

Acciones sugeridas para Product / Architect / Release:
- Decidir si el piloto acepta:
  - Riesgo de red amplio por `AllowAllWindowsAzureIps`.
  - Riesgo de latencia inicial por SQL serverless pausado.
- Si se acepta el estado actual:
  - Crear/runbook operativo de calentamiento antes de uso real.
  - Mantener observacion con Application Insights y logs de API.
- Si se quiere endurecer antes del piloto:
  - Crear TASK separada para firewall:
    - agregar reglas para `possibleOutboundIpAddresses`;
    - validar API;
    - retirar `AllowAllWindowsAzureIps`;
    - documentar rollback.
  - Crear TASK separada para SQL compute:
    - ajustar `autoPauseDelay` o provisioned temporal;
    - documentar costo esperado y ventana de reversa.

Decisiones que requieren aprobacion explicita del usuario antes de ejecutar:
- Eliminar o modificar `AllowAllWindowsAzureIps`.
- Crear reglas firewall nuevas para IPs outbound de Function App.
- Cambiar `autoPauseDelay`.
- Deshabilitar auto-pause.
- Cambiar tier/SKU o pasar a provisioned.
- Crear VNet, NAT Gateway, Private Endpoint, DNS privado u otros recursos de red.
- Cambiar connection strings o secretos.

Siguiente recomendado:
- Product / Architect / Release decide entre:
  - Opcion A: mantener estado actual con runbook para piloto controlado.
  - Opcion B: abrir tarea de endurecimiento firewall incremental antes del piloto.
  - Opcion C: abrir tarea de ajuste de auto-pause/provisioned si la latencia inicial no es aceptable.
