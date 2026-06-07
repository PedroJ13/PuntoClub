# TASK-119 - Decidir arquitectura de registro multiempresa e invitaciones

## Equipo

Product / Architect / Release

## Resultado

Completado.

## Decision

Avanzar a **multiempresa controlado**, no a SaaS multiempresa completo todavia.

La siguiente fase habilitara registro de empresa, invitacion por correo, acceso con correo/password administrado y panel por empresa, pero sin permitir operacion multiempresa abierta hasta que existan auth, autorizacion, SQL y QA de aislamiento.

## Arquitectura aprobada como objetivo

- Email transaccional: Azure Communication Services Email.
- Auth/acceso/password: Microsoft Entra External ID.
- Logos: Azure Blob Storage privado, validado y controlado por Backend/API.
- SQL: modelo con solicitudes de registro, invitaciones y usuarios por empresa.
- UI: menu lateral con `Operaciones`, `Mi empresa` y `Reportes`.

## Alcance aprobado

### Fase inmediata

- Mantener flujo operativo actual funcionando para empresa piloto.
- Publicar menu lateral y validar que no rompe Operaciones, Mi empresa, Reportes ni Auditoria.
- Preparar recursos/decisiones de Infra para email, auth y logo upload.
- Preparar migracion SQL versionada para registro/invitaciones/usuarios, sin aplicar hasta revision.

### Fase posterior

- Implementar registro de empresa como solicitud controlada.
- Enviar notificacion interna a `pj13eros_business@outlook.com`.
- Enviar invitacion por correo cuando la empresa sea aprobada o creada.
- Usar el correo como usuario.
- No guardar passwords propios si se usa Entra External ID.
- Resolver `companyId` desde usuario autenticado y mapeo SQL, no desde frontend.

## Decisiones de producto

- Registro de empresa: controlado. Puede existir formulario de solicitud, pero no activa operacion automaticamente.
- Aprobacion/invitacion: se requiere paso controlado antes de acceso operativo.
- Activacion: aceptar invite no debe exponer datos operativos sin mapeo `CompanyUsers -> company_id` activo.
- Expiracion inicial de invitacion: 7 dias, salvo ajuste posterior.
- Logo: upload real se hara solo con storage privado y validacion server-side.
- Email interno: toda solicitud de empresa debe notificar a `pj13eros_business@outlook.com`.
- `address`: requerido en la UI de registro/configuracion de empresa futura; SQL/API deben incluirlo o documentar si se difiere.

## Riesgos aceptados

- Se agregan nuevas superficies de Azure: email, identidad y storage.
- Se mantiene empresa piloto mientras se implementa multiempresa controlado.
- El flujo de registro puede iniciar antes que auth completa, pero no debe permitir operacion real sin autorizacion server-side.

## Riesgos no aceptados

- Auth propio con password local sin decision explicita.
- Confiar en `companyId` enviado por frontend.
- Guardar tokens de invitacion en texto plano.
- Public blob access para logos.
- Registro publico que active empresas automaticamente.

## Tareas siguientes creadas

- `TASK-120`: Infra / Azure prepara habilitacion de ACS Email, Entra External ID y Blob Storage privado.
- `TASK-121`: SQL DEV prepara migracion versionada para registro de empresas, invitaciones y usuarios.

## Tareas liberadas

- `TASK-118`: QA valida menu lateral publicado despues del push.

## Notas

`TASK-116` queda como contrato base para futuras tareas Backend/API. No implementa endpoints.

`TASK-117` queda como cambio UI local listo para QA publicado. No implementa registro real de empresa, auth, email ni upload.
