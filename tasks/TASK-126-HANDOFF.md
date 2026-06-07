# TASK-126 - Handoff

## Equipo

Product / Architect / Release

## Estado

Completado.

No se crearon recursos Azure, no se configuraron secretos y no se implemento codigo.

## Decision propuesta

Avanzar con aprobacion por pasos para multiempresa controlado, usando valores conservadores de piloto:

| Tema | Recomendacion Product / Architect / Release |
| --- | --- |
| Email transaccional | Crear recursos propios de Punto Club con Azure Communication Services Email. |
| Dominio de email | Usar Azure Managed Domain para piloto rapido; migrar a dominio propio antes de uso comercial mas amplio. |
| Remitente visible | `Punto Club`. |
| Sender tecnico inicial | El sender que entregue Azure Managed Domain, con display name `Punto Club`. |
| Acuse al solicitante | Si. Enviar acuse automatico simple al contacto de la solicitud. |
| Notificacion interna | Si. Enviar a `pj13eros_business@outlook.com` cada solicitud nueva y cada invitacion enviada. |
| Auth/password | Confirmar Microsoft Entra External ID. No usar password propio. |
| Storage de logos | Crear storage dedicado `stpuntoclublogosbr001`, no reutilizar storage runtime de Functions. |
| Container de logos | `company-logos`, privado. |
| Limite logo | 1 MB para piloto. |
| Tipos logo | Permitir solo PNG, JPG/JPEG y WebP. Excluir SVG. |
| CTA invitacion | `Crear acceso`. |
| Canal de soporte temporal | Usar `pj13eros_business@outlook.com` como contacto inicial hasta definir soporte formal. |
| Redirects iniciales | URL publicada actual y URLs locales de dev indicadas por Infra. |
| Costos | Aprobar pay-as-you-go bajo para ACS Email, Entra External ID y Storage, con monitoreo. |

## Razonamiento

La recomendacion evita construir seguridad propia y mantiene separadas las responsabilidades:

- ACS Email maneja invitaciones y notificaciones sin usar cuentas personales.
- Entra External ID evita almacenar passwords propios.
- Blob Storage privado evita logos publicos o URLs externas no controladas.
- Storage dedicado separa assets de producto del storage runtime de Azure Functions.
- Azure Managed Domain reduce friccion del piloto; dominio propio queda como mejora antes de escalar.

## Preguntas finales para Product Owner

Responder con `aprobado` o ajustes:

1. Email: apruebas usar Azure Managed Domain para el piloto?
2. Remitente visible: apruebas `Punto Club`?
3. Acuse: apruebas enviar acuse automatico al solicitante?
4. Notificaciones internas: apruebas enviar solicitud nueva e invitacion enviada a `pj13eros_business@outlook.com`?
5. Auth: apruebas Microsoft Entra External ID como proveedor de acceso/password?
6. Storage: apruebas crear storage dedicado `stpuntoclublogosbr001`?
7. Logos: apruebas limite 1 MB y tipos PNG/JPG/WebP, excluyendo SVG?
8. CTA: apruebas `Crear acceso` como texto del boton/link de invitacion?
9. Soporte temporal: apruebas usar `pj13eros_business@outlook.com` como contacto de soporte inicial?
10. Costos: apruebas crear recursos pay-as-you-go para ACS Email, Entra External ID y Storage?

## Aprobacion recomendada en bloque

Si el Product Owner quiere avanzar rapido, puede aprobar esta frase:

```text
Apruebo para piloto: Azure Managed Domain, remitente Punto Club, acuse al solicitante, notificaciones internas a pj13eros_business@outlook.com, Entra External ID, storage dedicado stpuntoclublogosbr001, logos de 1 MB PNG/JPG/WebP sin SVG, CTA Crear acceso y recursos pay-as-you-go.
```

## Siguiente tarea sugerida si se aprueba

Crear una tarea para Infra / Azure:

```text
Infra / Azure

Lee este archivo de asignacion: tasks/TASK-127-assignment.md.

Sigue las instrucciones y al terminar actualiza tasks/TASK-127-HANDOFF.md.
```

Alcance sugerido de TASK-127:

- Crear ACS Email propio de Punto Club con Azure Managed Domain.
- Crear/configurar Entra External ID inicial.
- Crear storage dedicado `stpuntoclublogosbr001` y container privado `company-logos`.
- Configurar solo app settings necesarios aprobados, sin imprimir secretos.
- Verificar recursos con pruebas minimas.

## Siguiente tarea sugerida si no se aprueba aun

Mantener Infra bloqueada para recursos reales y continuar solo con tareas locales/mock:

- Backend/API puede seguir con base interna y pruebas unitarias.
- Web Dev puede preparar UI no productiva de solicitud si no envia emails reales.
- SQL no debe aplicar migracion a Azure hasta aprobacion.

## Riesgos

- Usar Azure Managed Domain puede verse menos profesional que dominio propio; aceptable para piloto.
- Crear Entra External ID agrega configuracion sensible; debe validarse con QA antes de exponer flujo real.
- No debe haber endpoint productivo de registro/invitacion sin rate limit, auditoria y aprobacion interna.
- No debe almacenarse password local ni token de invitacion en texto plano.
- No debe habilitarse public blob access para logos.
