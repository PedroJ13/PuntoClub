Equipo: QA
Tarea validada: TASK-682 - Validar preview y correo promocional con imagen
Ambiente: Pendiente de prueba PO en ambiente publicado `https://puntoclubcr.com/app`. QA no ejecuto envio real.
Resultado: bloqueado

Checks ejecutados:
- Se leyo contexto QA y handoffs previos relevantes:
  - `AGENTS.md`
  - `codex-project-templates/QA.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/TASK_BOARD.md`
  - `docs/QA_TEST_PLAN.md`
  - `tasks/TASK-680-HANDOFF.md`
  - `tasks/TASK-681-HANDOFF.md`
- Se confirmo que `TASK-680` corrige la URL absoluta de imagen para preview/correo promocional y agrega cobertura de tests.
- Se confirmo que `TASK-681` corrige sincronizacion de imagen activa en preview UI y preserva imagen despues de envio.
- Se busco autorizacion/destinatario en handoffs cercanos `TASK-670` a `TASK-681`.
- No se encontro destinatario autorizado explicito en los handoffs revisados.
- Product Owner indico en chat que realizara la prueba de envio real por su cuenta.

Hallazgos:
- No hay hallazgos tecnicos nuevos validados por QA en esta tarea.
- QA no ejecuto el envio real porque la tarea exige enviar solo a destinatario autorizado por PO y el Product Owner decidio ejecutar esa parte directamente.

P0/P1:
- Bloqueante de cierre QA: falta evidencia PO/QA del correo real controlado con imagen recibida/renderizada.

P2/P3:
- Ninguno identificado en esta etapa.

Evidencia:
- `TASK-680-HANDOFF.md`: Backend/API indica que el correo promocional ahora construye URL publica absoluta de imagen usando `PUBLIC_API_BASE_URL`, `APP_PUBLIC_BASE_URL + /api` o URL del request.
- `TASK-681-HANDOFF.md`: Web Dev indica que el preview UI muestra imagen activa y conserva imagen despues de envio.
- Conversacion actual: Product Owner indico que hara la prueba real de envio.

Uso DB cloud: No

Riesgos o pendientes:
- Pendiente evidencia de Product Owner:
  - campaña con imagen activa muestra imagen en preview publicado;
  - correo real controlado recibido muestra imagen;
  - al eliminar imagen deja de mostrarse;
  - campaña sin imagen mantiene comportamiento anterior.
- No documentar ni compartir passwords, cookies, tokens, connection strings ni datos sensibles del correo.
- El envio real debe mantenerse limitado al destinatario autorizado por Product Owner.

Siguiente recomendado:
- Product Owner ejecuta la prueba real controlada y entrega evidencia redaccionada.
- QA reabre/actualiza este handoff cuando exista evidencia para aprobar o registrar hallazgos.
