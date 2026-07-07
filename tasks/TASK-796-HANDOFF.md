Equipo: QA
Tarea validada: TASK-796 - Validar restablecimiento de flujo comun de campanas
Ambiente: Local/mock, app servida en http://127.0.0.1:4201 con app-config mock, Chromium Playwright, fecha fijada en 2026-07-05 para usar cumpleanero seed local.
Resultado: no aprobado

Checks ejecutados:
- Lectura de handoff TASK-795.
- Smoke focal `tmp/task796-qa.mjs`.
- Login mock.
- Validacion de alerta de cumpleaneros del dia.
- Creacion de campana tipo `cumpleanos`.
- Entrada al flujo dedicado de cumpleaños.
- Validacion de filtro de campañas y destinatarios en flujo dedicado de cumpleaños.
- Seleccion rapida en flujo cumpleaños sin presionar envio.
- Salida a `Atender cliente` y vuelta a `Enviar campañas` desde menu lateral, sin recarga.
- Reentrada a cumpleaños y vuelta mediante subnav normal `Enviar campañas`, sin recarga.
- Checks tecnicos: `node --check app/src/app.js`, `git diff --check -- app/src/app.js`, `npx prettier --check app/src/app.js`.

Hallazgos:
- El flujo dedicado de cumpleaños sigue funcionando: muestra solo campaña `Cumpleaños` y 1 destinatario, coincidiendo con la alerta.
- En cumpleaños, la seleccion rapida solo prepara 1 cumpleañero y no se ejecuto envio.
- Volver mediante subnav normal `Enviar campañas` restablece el flujo comun sin recarga: selecciona campaña `Común` y muestra 2 destinatarios normales.
- Volver mediante menu lateral no restablece el flujo comun sin recarga.

P0/P1:
- P1: Despues de entrar al flujo dedicado de cumpleaños, al salir a `Atender cliente` y volver a `Enviar campañas` desde el menu lateral, el selector sigue mostrando solo la campaña de cumpleaños y mantiene 1 destinatario cumpleañero. No aparece la campaña comun hasta usar otra ruta o recargar. Esto incumple el criterio principal de TASK-796: volver a `Enviar campañas` desde navegacion normal debe restablecer el flujo comun sin requerir recarga.

P2/P3:
- Ninguno.

Evidencia:
- `tmp/task796-qa.mjs`: `ok: false`.
- Alerta local: `Campanita: 1 cliente cumple años hoy. 1 apto para campaña de cumpleaños.`
- Flujo cumpleaños: selector con `QA796 ... · Cumpleaños`; destinatarios `1`; seleccion rapida `Enviar a 1`.
- Menu lateral despues de cumpleaños: selector queda con solo `QA796 ... · Cumpleaños`; destinatarios `1`; no se restablece campaña comun.
- Subnav normal despues de cumpleaños: selector muestra `Cumpleaños` y `Común`, selecciona `Promo clientes frecuentes ... · Común`, destinatarios `2`.
- Checks tecnicos focales: sintaxis OK, Prettier OK, `git diff --check` sin errores; solo aviso LF/CRLF de Git.

Uso DB cloud: No

Riesgos o pendientes:
- Riesgo UX/funcional: una persona que entra al flujo de cumpleaños y vuelve al menu lateral `Enviar campañas` puede creer que el flujo comun no tiene campanas o destinatarios disponibles, salvo que recargue o use otra navegacion.
- No se publico.
- No se aplico migracion SQL.
- No se enviaron correos reales ni se ejecuto envio promocional.

Siguiente recomendado:
- Web Dev debe ajustar el click del menu lateral `Enviar campañas` para que ejecute el mismo reset que el subnav normal.
- Reintentar QA local focal despues del ajuste.
