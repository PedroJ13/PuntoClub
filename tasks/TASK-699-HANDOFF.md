Equipo: QA
Modo de ejecucion: Auth / Regresion publicada
Tarea bloqueada: TASK-699 - Validar login con API same-site en normal e incognito

Resultado:
- No se ejecuto regresion publicada de login normal/incognito.
- No se usaron credenciales de empresa.
- No se expusieron cookies, tokens ni datos sensibles.

Motivo:
- TASK-699 depende de TASK-697 y TASK-698.
- TASK-697 quedo parcialmente ejecutada y bloqueada por DNS/Cloudflare.
- TASK-698 no cambio Web porque `api.puntoclubcr.com` aun no esta validado.
- Por tanto, el ambiente publicado aun no esta usando API same-site.

Verificacion disponible:
- API actual en `azurewebsites.net` sigue respondiendo de forma controlada:
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/me`
  - resultado sin sesion: `401 UNAUTHORIZED`
- `https://api.puntoclubcr.com` no resuelve todavia, por lo que no hay prueba QA posible sobre ese host.

Uso Azure SQL:
- No.

Criterios QA pendientes cuando se desbloquee:
- Login publicado con empresa autorizada en navegador normal.
- Login publicado con empresa autorizada en incognito.
- Confirmar acceso al panel operativo.
- Confirmar persistencia de sesion tras refresh.
- Confirmar logout.
- Confirmar que ya no aparece el mensaje de sesion no conservada.
- No exponer credenciales, cookies, tokens ni datos sensibles en evidencia.
