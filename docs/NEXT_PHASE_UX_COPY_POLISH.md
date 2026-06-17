# Siguiente fase - Diseno / UX y Copy / Gramatica

## Proposito

Documento para Product / Architect / Release.

Punto Club ya tiene flujos funcionales importantes: puntos, empresa, autenticacion, logo, panel interno y avance hacia membresias. Antes de seguir agregando complejidad, conviene hacer una pasada fuerte de Diseno / UX y Copy / Gramatica para que la app se sienta clara, profesional y coherente como producto de fidelizacion.

## Objetivo

Mejorar la experiencia completa para:

- la empresa que usa Punto Club;
- el empleado que atiende clientes;
- el cliente final que recibe beneficios;
- el administrador interno que revisa solicitudes.

La app debe comunicar claramente:

```text
Punto Club ayuda a empresas a fidelizar clientes con puntos, membresias y beneficios.
```

## Alcance propuesto

### 1. Claridad de flujo

Revisar que cada pantalla responda:

- que esta pasando;
- que debe hacer el usuario;
- que paso despues de guardar;
- que hacer si hay error;
- que informacion es importante en ese momento.

Flujos prioritarios:

- Solicitud de empresa.
- Invitacion y crear acceso.
- Login/logout.
- Mi empresa.
- Atender cliente / Caja.
- Puntos.
- Membresias.
- Reportes.
- Admin empresas.

### 2. Copy y gramatica

Revisar textos visibles:

- titulos;
- subtitulos;
- botones;
- labels;
- placeholders;
- mensajes de exito;
- mensajes de error;
- estados vacios;
- confirmaciones;
- alertas;
- instrucciones cortas;
- textos de correo.

Reglas:

- Usar espanol claro y natural.
- Evitar lenguaje tecnico si no ayuda.
- Evitar frases largas.
- Evitar mezclar terminos: usar siempre el mismo nombre para la misma accion.
- Corregir tildes, mayusculas y errores de escritura.
- Usar tono profesional, cercano y operativo.

Ejemplos de tono:

```text
No: Error de validacion.
Si: Revisa los campos marcados antes de continuar.

No: Ejecutar redencion.
Si: Redimir puntos.

No: Crear acceso exitoso.
Si: Acceso creado correctamente.
```

### 3. Correos bien formateados

Revisar o definir plantillas para:

- solicitud recibida;
- notificacion interna de nueva solicitud;
- invitacion a empresa aprobada;
- reenvio de invitacion;
- acceso creado;
- aviso de membresia por vencer, si entra en fase de membresias;
- renovacion o vencimiento de membresia, si aplica.

Cada correo debe tener:

- asunto claro;
- saludo;
- contexto breve;
- accion principal;
- boton/link claro;
- nota de seguridad si contiene invitacion;
- cierre profesional.

Regla de seguridad:

- No exponer tokens, secretos ni datos sensibles innecesarios.
- No escribir links completos en logs o documentos si contienen token real.

### 4. Iconos en botones y acciones

Revisar botones principales y acciones repetidas.

Botones que deberian tener icono:

- Buscar cliente.
- Registrar cliente.
- Registrar compra.
- Redimir puntos.
- Activar membresia.
- Renovar membresia.
- Aplicar beneficio.
- Guardar.
- Cancelar.
- Subir logo.
- Descargar CSV.
- Enviar invitacion.
- Reenviar invitacion.
- Aprobar.
- Rechazar.
- Ver detalle.
- Cerrar sesion.

Regla UX:

- Icono + texto para acciones importantes.
- Solo icono para acciones compactas si tiene tooltip o contexto claro.
- No usar iconos decorativos sin funcion.

### 5. Colores y estilo visual

La app debe sentirse como una herramienta moderna de fidelizacion:

- confiable;
- clara;
- comercial;
- operativa;
- no infantil;
- no demasiado corporativa/fria.

Revisar:

- color principal;
- color de acento;
- estados de exito/error/advertencia;
- contraste;
- fondos;
- tarjetas/paneles;
- botones;
- badges;
- estados activos/inactivos;
- responsive.

Recomendacion:

- Usar una paleta con base clara, buen contraste y acentos ligados a fidelizacion/beneficios.
- Evitar una UI dominada por un solo color.
- Usar color con proposito: accion, estado, alerta o jerarquia.

### 6. Jerarquia y layout

Revisar que la pantalla no se sienta como una lista de formularios.

Debe haber jerarquia:

- titulo claro;
- contexto breve;
- accion principal visible;
- informacion secundaria contenida;
- estados vacios utiles;
- errores cerca del campo;
- resumen antes de confirmar operaciones importantes.

Pantallas clave:

- Atender cliente.
- Mi empresa.
- Membresias.
- Admin empresas.
- Reportes.

### 7. Estados vacios y errores

Estados vacios deben ayudar.

Ejemplos:

```text
No hay clientes con esa busqueda.
Puedes registrar un cliente nuevo para continuar.
```

```text
Esta empresa aun no tiene membresias configuradas.
Crea una membresia para empezar a ofrecer beneficios.
```

Errores deben ser accionables:

```text
Este numero de factura ya fue registrado.
Usa otro numero o revisa el historial del cliente.
```

```text
La membresia ya no esta activa.
Renueva la membresia antes de aplicar beneficios.
```

### 8. Consistencia de nombres

Definir glosario minimo.

Terminos sugeridos:

- `Atender cliente`
- `Registrar compra`
- `Redimir puntos`
- `Activar membresia`
- `Renovar membresia`
- `Aplicar beneficio`
- `Mi empresa`
- `Admin empresas`
- `Solicitud de empresa`
- `Invitacion`
- `Acceso`

Evitar alternar entre:

- membresia / plan / paquete sin diferencia clara;
- beneficio / producto incluido / servicio incluido sin criterio;
- usuario / empresa / cuenta si no se define.

## Rondas sugeridas

### Round 1 - Auditoria UX y copy

Objetivo:

- Revisar pantallas actuales y listar fricciones.

Equipo:

- Diseno / UX.
- Copy / Gramatica.

Resultado:

- Inventario de textos a corregir.
- Recomendaciones visuales.
- Glosario de terminos.
- Lista priorizada P1/P2/P3.

### Round 2 - Copy y correos

Objetivo:

- Corregir textos visibles y plantillas de email.

Equipo:

- Copy / Gramatica.
- Diseno / UX.
- Backend/API si los correos se generan server-side.

Resultado:

- Textos consistentes.
- Correos claros y seguros.
- Estados vacios y errores mejorados.

### Round 3 - Iconos y acciones

Objetivo:

- Mejorar botones y acciones principales.

Equipo:

- Diseno / UX.
- Web Dev.

Resultado:

- Botones con iconos donde corresponde.
- Tooltips o labels claros.
- Acciones repetidas consistentes.

### Round 4 - Paleta visual y layout

Objetivo:

- Ajustar colores, espaciados, jerarquia y componentes para que la app se sienta mas pulida.

Equipo:

- Diseno / UX.
- Web Dev.
- QA.

Resultado:

- Estilo visual mas coherente.
- Contraste correcto.
- Responsive validado.

### Round 5 - QA UX/copy

Objetivo:

- Validar que la app publicada no tenga errores de texto, botones confusos ni problemas visuales evidentes.

Equipo:

- QA.
- PO Test si aplica.

Resultado:

- Validacion desktop/mobile.
- Hallazgos clasificados.
- Cierre sin P0/P1 visuales.

## Criterios de aceptacion

- Textos principales corregidos y consistentes.
- No hay errores obvios de ortografia en flujos principales.
- Correos tienen asunto, cuerpo, CTA y nota de seguridad cuando aplica.
- Botones principales tienen icono + texto o texto claro.
- Estados vacios explican el siguiente paso.
- Errores son entendibles y accionables.
- Colores tienen contraste adecuado.
- Pantallas clave funcionan en desktop y mobile.
- El flujo de fidelizacion se entiende sin explicacion externa.

## Fuera de alcance recomendado

Para evitar una reescritura visual innecesaria, no incluir en esta pasada:

- Cambio profundo de arquitectura frontend.
- Cambio de framework.
- Redisenar todo desde cero.
- Animaciones complejas.
- Sistema completo de marca/logo de Punto Club.
- Marketing site publico completo.

## Riesgos

- Hacer solo cambios visuales sin mejorar claridad del flujo.
- Cambiar colores sin revisar contraste.
- Agregar iconos que confundan en vez de aclarar.
- Corregir copy en UI pero olvidar correos.
- Hacer una gran tarea unica en vez de rondas pequenas.

## Recomendacion para Product / Architect / Release

- Tema: Pasada fuerte de Diseno / UX y Copy / Gramatica.
- Motivo: Punto Club ya tiene base funcional; ahora necesita sentirse claro, confiable y profesional como app de fidelizacion.
- Prioridad sugerida: P1 pre-lanzamiento si se mostrara a empresas reales pronto; P2 recomendable si aun se priorizan flujos funcionales de membresia.
- Equipo sugerido: Diseno / UX + Copy / Gramatica primero; luego Web Dev, Backend/API y QA.
- Documento/tarea sugerida: Crear tareas por rondas: auditoria UX/copy, correos, iconos, paleta/layout y QA visual.
- Riesgo si no se hace: La app puede funcionar bien tecnicamente, pero sentirse confusa o poco pulida para empresas reales.
