# TASK-888 - Handoff

Nombre del Equipo: Infra
Modo: Staging / Logo assets
Fecha: 2026-07-09

## Estado

Completada.

Se diagnostico la causa probable del mensaje en staging:

```txt
Logo configurado, pero no pudimos cargar la imagen
```

## Evidencia revisada

Settings no secretos de API staging:

```txt
LOGO_STORAGE_ACCOUNT=stpuntoclublogosbr001
LOGO_CONTAINER=company-logos-staging
LOGO_SERVE_MODE=api
ENVIRONMENT_NAME=staging
EMAIL_SEND_MODE=disabled
```

Contenedores consultados por ARM, sin leer blobs ni modificar storage:

```txt
company-logos
Estado: existe
Public access: None

company-logos-staging
Estado: no existe
```

## Diagnostico

Staging phase 1 usa SQL productiva temporalmente. Por eso `GET /api/my-company` puede devolver metadata de logo real desde SQL.

Pero API staging esta configurada para leer blobs desde:

```txt
stpuntoclublogosbr001/company-logos-staging
```

Ese contenedor no existe. El resultado esperado es que la UI vea metadata de logo, pero falle al cargar la imagen desde el endpoint privado, mostrando el mensaje observado.

## Decision recomendada

Para phase 1, la opcion mas segura es no leer logos productivos desde staging por defecto.

Opciones:

1. Crear `company-logos-staging` y usar solo logos QA/staging.
   - Recomendado para pruebas de upload sin afectar assets reales.
   - Requiere contenedor privado y RBAC para la Function App staging.

2. Mantener fallback visual controlado cuando SQL indique logo pero staging no pueda leerlo.
   - Recomendado como complemento para evitar confusion de QA.
   - No prueba render real de logos.

3. Permitir lectura read-only del contenedor productivo `company-logos`.
   - No recomendado como default phase 1.
   - Solo serviria para validar logos reales, pero mezcla staging con assets productivos.

## Restricciones respetadas

- No se subieron logos.
- No se borraron logos.
- No se reemplazaron logos reales.
- No se cambio Storage.
- No se cambio SQL.
- No se cambio DNS.
- No se envio correo.

## Uso Azure SQL

No se consulto ni modifico Azure SQL.

## Siguiente paso recomendado

Crear tarea Infra apply si Product aprueba contenedor staging:

```txt
Crear contenedor privado company-logos-staging en stpuntoclublogosbr001 y asignar RBAC de lectura/escritura a func-puntoclub-stg-br-001.
```

Luego crear una tarea Web/API si se desea fallback visual especifico para staging cuando exista metadata SQL pero el blob no este disponible.

