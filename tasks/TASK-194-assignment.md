# TASK-194 - Implementar API de logo privado de empresa

Equipo responsable: Backend API

## Contexto

La operacion autenticada publicada ya usa la empresa de la sesion como contexto confiable. La siguiente mejora funcional de `Mi empresa` es permitir subir y mostrar logo de empresa sin exponer blobs publicos.

Esta tarea depende de TASK-193 para confirmar storage/configuracion.

## Objetivo

Implementar endpoints Backend/API para cargar y servir logo de la empresa autenticada usando storage privado.

## Alcance

- Depende de TASK-193.
- Usar sesion de empresa como autoridad de `companyId`.
- Implementar upload de logo:
  - PNG/JPG/WebP;
  - maximo recomendado 1 MB salvo config distinta;
  - rechazar SVG;
  - validar content-type y extension si aplica;
  - no aceptar `companyId` desde frontend como autoridad.
- Guardar referencia segura en empresa:
  - `logoBlobPath`/campo equivalente si ya existe;
  - `logoUrl` solo si representa URL controlada por API o contrato aprobado.
- Implementar lectura/serving seguro del logo:
  - preferir endpoint API autenticado o controlado;
  - no publicar SAS largo ni blob publico.
- Actualizar contratos si corresponde.
- Agregar pruebas.
- No guardar tokens, cookies, passwords, keys ni SAS en handoff.

## Entregable

Crear o actualizar `tasks/TASK-194-HANDOFF.md` con:

- Resultado.
- Endpoints implementados.
- Contrato final.
- Validaciones de archivo.
- Pruebas ejecutadas.
- Si falta deploy o config, indicarlo claramente.
