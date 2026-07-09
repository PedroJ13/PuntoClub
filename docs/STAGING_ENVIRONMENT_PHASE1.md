# Staging phase 1 - Web/API sin SQL duplicado

## Decision

Se aprueba preparar una primera etapa de ambiente de pruebas para Punto Club.

Alcance de esta etapa:

- Duplicar Static Web App.
- Duplicar Azure Function App.
- Separar app settings por ambiente.
- Mantener Azure SQL productiva sin duplicar por ahora.
- Dejar SQL staging como segunda etapa.

Objetivo: probar cambios de Web/API en un ambiente separado antes de publicar en produccion, reduciendo riesgo cuando ya hay empresas reales usando el sistema.

## Ambientes objetivo

### Produccion

Uso: empresas reales.

Debe mantenerse estable y recibir solo cambios ya validados.

Recursos actuales de referencia:

- Web: `https://puntoclubcr.com`
- API: `https://api.puntoclubcr.com/api`
- SQL: Azure SQL productiva actual.

### Staging phase 1

Uso: QA, PO Test, validaciones de release y pruebas internas.

Recursos nuevos esperados:

- Static Web App staging.
- Azure Function App staging.
- Settings staging.
- URL temporal de Azure o subdominio futuro, por ejemplo `staging.puntoclubcr.com`.

En esta fase, staging no debe enviar correos reales a clientes sin bandera/decision explicita.

## Que se duplica ahora

### Static Web App

Crear una Web separada para staging.

Debe permitir validar:

- rutas publicas;
- login;
- `/app`;
- `/company-registration`;
- `/admin-companies`;
- rutas profundas como `/company-invitations/accept`;
- assets y cache busting;
- configuracion de API base hacia Function App staging.

### Azure Function App

Crear una Function App separada para staging.

Debe permitir validar:

- endpoints de auth;
- endpoints operativos;
- endpoints internos protegidos;
- CORS contra Web staging;
- cookies/sesion con dominio/origen correcto;
- flags de ambiente separados;
- smoke basico sin tocar produccion mas de lo aprobado.

### App settings

Separar settings por ambiente.

Como minimo revisar:

- API base URL usada por la Web staging.
- CORS allowed origins.
- cookie domain / SameSite / Secure.
- flags de features internas.
- `INTERNAL_ADMIN_TOKEN` de staging distinto al de produccion.
- settings de ACS Email en modo seguro o deshabilitado si no se aprueba envio real.
- storage/logo si staging necesita probar upload sin afectar datos reales.
- connection string SQL: en phase 1 puede apuntar a SQL productiva solo con restricciones claras; phase 2 debe moverlo a SQL staging.

## Regla importante sobre SQL

En phase 1 no se duplica SQL.

Esto significa:

- No probar migraciones destructivas desde staging.
- No hacer QA masiva que cree datos reales sin aprobacion.
- No usar staging para borrar/limpiar datos productivos.
- No ejecutar pruebas de carga contra SQL productiva.
- No enviar campanas/correos reales desde staging.

Staging phase 1 sirve principalmente para validar despliegue, Web/API, rutas, configuracion y regresion segura.

## Riesgos aceptados en phase 1

- Si Function App staging apunta temporalmente a SQL productiva, sigue existiendo riesgo de datos reales.
- Las pruebas deben limitarse a cuentas/empresas de QA o datos controlados.
- Las migraciones SQL siguen requiriendo proceso productivo separado.

Este riesgo se acepta solo como paso intermedio corto.

## Phase 2 - SQL staging

La siguiente etapa debe crear una base SQL staging separada.

Objetivo:

- Probar migraciones antes de produccion.
- Permitir datos falsos o redaccionados.
- Ejecutar QA sin afectar empresas reales.
- Validar seeds, scripts y rollback.

Opciones:

- Azure SQL serverless minima.
- Copia de schema sin datos reales.
- Copia redaccionada si Product/Infra aprueban proceso seguro.

## Flujo de deploy recomendado

1. Cambio se implementa local.
2. Checks locales pasan.
3. Deploy a staging.
4. QA staging valida.
5. Product/PO decide publicar.
6. Deploy a produccion.
7. QA publicada valida smoke corto.

No saltar de local a produccion para cambios que toquen:

- auth;
- cookies/sesiones;
- SQL/migraciones;
- calculo de puntos;
- compras/redenciones;
- campanas/correos;
- admin interno;
- settings de seguridad.

## Tareas sugeridas

### Tarea 1 - Infra / Azure

Inventariar produccion y proponer nombres/costos de staging.

Debe entregar:

- nombres de recursos propuestos;
- region;
- plan/SKU;
- costo mensual estimado;
- dominios/URLs;
- lista de settings a duplicar o cambiar;
- riesgos de usar SQL productiva en phase 1;
- recomendacion de feature flags para correos/campanas.

No debe crear recursos sin aprobacion explicita.

### Tarea 2 - Backend/API

Revisar compatibilidad de la API con ambiente staging.

Debe entregar:

- settings requeridos;
- CORS/cookies esperados;
- smoke endpoints;
- riesgos de usar SQL productiva temporalmente;
- ajustes necesarios para modo staging seguro.

No debe cambiar logica funcional salvo tarea explicita.

### Tarea 3 - Web Dev

Revisar configuracion de Web para consumir API staging.

Debe entregar:

- mecanismo de API base por ambiente;
- rutas que deben responder en staging;
- validacion de `staticwebapp.config.json`;
- riesgos de cache/dominio;
- checks locales/publicados requeridos.

### Tarea 4 - QA

Preparar checklist QA staging.

Debe cubrir:

- home/producto;
- login/logout;
- `/app`;
- flujo operativo seguro;
- `Mi empresa`;
- reportes;
- admin empresas con token de staging;
- rutas publicas;
- no envio real de correos/campanas salvo aprobacion.

### Tarea 5 - Product / Architect / Release

Definir politica de promocion staging -> produccion.

Debe decidir:

- que cambios requieren staging obligatorio;
- quien aprueba pasar a produccion;
- que smoke publicado se ejecuta despues;
- como se documenta rollback;
- cuando se habilita phase 2 con SQL staging.

## Criterio de Done phase 1

Phase 1 queda lista cuando:

- Web staging existe y responde.
- API staging existe y responde health/smoke.
- Web staging llama a API staging.
- CORS/cookies funcionan en staging.
- Settings de staging estan separados de produccion.
- Correos/campanas reales estan bloqueados o controlados.
- QA staging aprueba smoke seguro.
- Produccion no fue modificada salvo cambios explicitamente aprobados.

## No hacer todavia

- No duplicar SQL sin tarea phase 2.
- No copiar datos reales a staging sin plan de redaccion.
- No usar secrets de produccion como si fueran de staging.
- No enviar campanas reales desde staging.
- No probar migraciones SQL productivas desde staging.
- No abrir staging como ambiente publico para clientes.

