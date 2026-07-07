Equipo: QA
Tarea validada: TASK-831 - Validar logo visible para empresa activa
Ambiente: Web publicada `https://puntoclubcr.com/app` con sesion real/controlada de Aurisbel. Fecha QA: 2026-07-07 11:01:55 -06:00.
Resultado: aprobado con observaciones

Checks ejecutados:
- Se revisaron `tasks/TASK-829-HANDOFF.md` y `tasks/TASK-830-HANDOFF.md`.
- Se valido sesion publicada activa de Aurisbel Pasteleria.
- Se reviso encabezado superior derecho:
  - Empresa activa: `Aurisbel Pasteleria`.
  - Usuario: `eventos.aurisbel@gmail.com`.
  - Imagen de logo en header: oculta/sin `src`.
  - Fallback visible: `AP`.
- Se abrio `Mi empresa`.
- Se valido estado de logo en `Perfil`:
  - Texto visible: `LOGO / Sin logo cargado`.
- Se abrio `Mi empresa > Logo`.
- Se valido estado de logo:
  - Texto visible: `Logo de empresa / Sin logo cargado`.
  - Preview existe pero sin `src` de imagen.
  - Header mantiene fallback `AP`.
- Se recargo la pagina publicada.
- Se valido persistencia despues de refresh:
  - Aurisbel sigue activa.
  - Header mantiene fallback `AP`.
  - Imagen del header sigue oculta/sin `src`.
- Se cerro sesion.
- Product Owner inicio sesion nuevamente con Aurisbel en el navegador interno.
- Se valido despues de logout/login:
  - Aurisbel vuelve como empresa activa.
  - Header mantiene fallback `AP`.
  - `Mi empresa > Logo` mantiene `Sin logo cargado`.
  - No se subio, reemplazo ni elimino logo.

Hallazgos:
- Aurisbel no muestra logo real en los datos visibles de la UI publicada al momento de QA.
- El fallback es claro y consistente:
  - Encabezado superior derecho: `AP`.
  - `Mi empresa > Logo`: `Sin logo cargado`.
- Refresh mantiene el fallback sin romper sesion ni identidad visual.
- Logout/login mantiene el fallback sin errores visibles.
- No se observaron errores de consola durante el flujo validado.

P0/P1:
- Ninguno abierto.

P2/P3:
- P3: TASK-829 no pudo confirmar metadata real en Azure SQL por firewall; esta QA valida el comportamiento visible publicado desde UI/API autenticada, no una consulta directa SQL/blob.

Evidencia:
- Header publicado:
  - `active-company-name`: `Aurisbel Pasteleria`.
  - `auth-status`: `eventos.aurisbel@gmail.com`.
  - `active-company-logo-image`: hidden, sin `src`.
  - `active-company-logo-fallback`: visible con `AP`.
- `Mi empresa > Logo`:
  - `Logo de empresa`.
  - `Sin logo cargado`.
  - Input de imagen y boton `Subir logo` visibles.
- Refresh:
  - Header sigue con `AP`.
  - Sin imagen activa.
- Logout/login:
  - Aurisbel vuelve activa.
  - Header sigue con `AP`.
  - `Mi empresa > Logo` sigue con `Sin logo cargado`.
- Console errors relevantes: ninguno observado.

Uso DB cloud: Si, motivo y alcance
- Si. Validacion en web publicada con sesion real de Aurisbel contra API/datos reales.
- Alcance: lectura/navegacion UI, refresh y logout/login.
- No se uso SQL directo, no se subio logo, no se reemplazo logo, no se modificaron datos.

Riesgos o pendientes:
- Si Product / Architect / Release necesita certeza de metadata/blob real, queda pendiente desbloquear o ejecutar TASK-829 desde un entorno permitido.
- Si Aurisbel deberia tener logo real, abrir tarea de diagnostico/recuperacion de metadata/blob; desde UI publicada hoy se observa como `Sin logo cargado`.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff. Si el fallback es aceptable para Aurisbel sin logo, no hay P0/P1 pendiente.
