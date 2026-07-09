# TASK-881 - Handoff

Nombre del Equipo: Infra
Modo: Staging / Accesos seguros
Fecha: 2026-07-09

## Estado

Completada con entrega de valores sensibles pendiente por canal seguro externo.

No se pegaron passwords, tokens, cookies, connection strings ni secretos en este handoff ni en el chat.

## Ambiente staging

Web staging:

```txt
https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

API staging:

```txt
https://func-puntoclub-stg-br-001.azurewebsites.net/api
```

Empresa configurada para staging:

```txt
PILOT_COMPANY_ID=6
```

Cookie staging:

```txt
COMPANY_SESSION_COOKIE_NAME=puntoclub_staging_company_session
```

## Validaciones realizadas sin exponer secretos

Se compararon app settings de:

```txt
Produccion: func-puntoclub-prod-br-001
Staging: func-puntoclub-stg-br-001
```

Resultado:

```txt
INTERNAL_ADMIN_TOKEN staging existe: si
INTERNAL_ADMIN_TOKEN produccion existe: si
INTERNAL_ADMIN_TOKEN staging es distinto al productivo: si
```

Flags seguros en staging:

```txt
PROMOTIONAL_EMAIL_SEND_ENABLED=false
COMPANY_REGISTRATION_REVIEW_ENABLED=false
COMPANY_INVITATION_MANAGEMENT_ENABLED=false
COMPANY_PASSWORD_RESET_ENABLED=false
```

ACS Email en staging:

```txt
ACS_EMAIL_CONNECTION_STRING configurado: no
ACS_EMAIL_SENDER_ADDRESS configurado: no
PROMOTIONAL_EMAIL_SENDER_ADDRESS configurado: no
```

Confirmacion: correos operativos, resets/invitaciones y campanas reales quedan bloqueados por defecto en staging.

## Credenciales QA de empresa staging

No se entregaron credenciales QA en este chat ni en archivos.

Motivo:

- No se deben exponer passwords en chat ni handoff.
- Infra no puede recuperar passwords existentes porque deben estar hasheados.
- Si no existe un usuario QA autorizado con password conocido por PO/QA, Product/Backend/SQL debe crear o resetear acceso mediante proceso controlado y entregar el password por canal seguro externo.

Entrega recomendada:

```txt
Usuario/correo QA: entregar fuera del chat por canal seguro aprobado.
Password QA: entregar fuera del chat por canal seguro aprobado.
```

Canales aceptables recomendados:

- gestor de secretos/password manager compartido con acceso limitado;
- canal corporativo cifrado aprobado por PO;
- llamada directa/entrega verbal temporal con cambio posterior de password;
- Azure Key Vault o equivalente si Product decide formalizarlo.

## INTERNAL_ADMIN_TOKEN staging

El token existe en app settings de `func-puntoclub-stg-br-001` y fue confirmado como distinto al productivo.

No se pego el valor.

Entrega recomendada:

1. Un operador Infra con permiso Azure debe abrir el app setting `INTERNAL_ADMIN_TOKEN` de `func-puntoclub-stg-br-001`.
2. Copiarlo solo hacia el canal seguro aprobado.
3. Indicar a QA que corresponde exclusivamente a staging.
4. No reutilizarlo en produccion ni guardarlo en el repo.

## Accesos que QA necesita

Para validar staging sin escritura riesgosa:

```txt
Web staging URL
API staging URL
Correo usuario QA autorizado para companyId=6
Password QA por canal seguro
INTERNAL_ADMIN_TOKEN staging por canal seguro, solo si QA valida Admin empresas
```

## No habilitado

No se habilitaron:

- correos reales;
- campanas reales;
- resets por correo;
- invitaciones por correo;
- DNS staging;
- SQL staging;
- nuevos secretos en archivos.

## Riesgos / notas

- Staging phase 1 aun apunta a SQL productiva. Login/logout crea/revoca sesiones en SQL productiva.
- Flujos de compras, canjes, campanas, membresias o cambios de datos deben ejecutarse solo con aprobacion explicita y empresa QA/controlada.
- No ejecutar `npm run smoke` contra staging porque crea cliente, compra y canje.
- Si QA necesita Admin empresas, usar solo el token staging y nunca el token productivo.

## Restricciones respetadas

- No se pegaron secrets en chat.
- No se guardaron secrets en archivos.
- No se cambio DNS.
- No se cambio produccion.
- No se cambio SQL.
- No se enviaron correos.
- No se habilitaron campanas reales.

## Uso Azure SQL

No se uso Azure SQL.

## Siguiente paso recomendado

Product/Infra debe entregar por canal seguro externo:

- usuario/password QA autorizado para empresa staging `companyId=6`;
- `INTERNAL_ADMIN_TOKEN` de `func-puntoclub-stg-br-001` solo a QA autorizado.

Luego QA puede ejecutar validacion staging sin escrituras peligrosas: rutas, login/logout, `/api/me`, CORS/cookies y Admin empresas con token staging si aplica.
