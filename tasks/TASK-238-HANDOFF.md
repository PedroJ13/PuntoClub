# TASK-238 - Handoff Diseno/UX

Equipo: Diseno / UX

Modo de ejecucion: Diseno/UX

## Resultado

Completado.

Se define que `Mi empresa` dentro de una sesion autenticada debe ser una pantalla de gestion de la empresa activa, no una pantalla de registro publico.

## Decisiones UX

### `Mi empresa` autenticada

Cuando existe sesion de empresa, `Mi empresa` debe mostrar:

- identidad de la empresa activa;
- configuracion editable ya soportada por API;
- estado de logo privado;
- mensajes de carga, exito y error propios de gestion interna.

No debe mostrar el formulario publico `Registrar empresa`.

Campos editables esperados, segun soporte previo validado:

- Nombre de empresa.
- Email.
- Telefono.
- Porcentaje de puntos.
- Logo privado mediante upload, si el componente ya esta disponible.

Campos o datos visibles recomendados:

- Nombre actual de la empresa.
- Email y telefono, con fallback cuando esten vacios.
- Porcentaje de puntos vigente.
- Estado/logo actual de la empresa.

### Logo y fallback

La pantalla debe mostrar:

- logo actual si existe y la sesion permite obtenerlo;
- fallback visual con iniciales o nombre de empresa cuando no hay logo;
- input de carga/subida solo para archivo permitido por la implementacion vigente;
- estado de preview/listo para subir cuando el usuario elige archivo.

No debe exponer URL privada de blob, SAS ni detalles internos de storage.

### Registro publico

`/company-registration` se mantiene como pagina publica separada para nuevas empresas.

Dentro de una sesion autenticada no hace falta mostrar link prominente a registro publico. Si aparece un enlace secundario, debe ser contextual y no reemplazar la gestion de la empresa activa.

Recomendacion para esta tarea: no mostrar link externo a registro publico dentro de `Mi empresa` autenticada.

### Admin empresas

`Admin empresas` es una herramienta interna y no debe aparecer en el menu normal de una empresa autenticada.

La pagina `/admin-companies` debe seguir existiendo como ruta separada para uso interno, con token temporal en memoria de pestana y sin `localStorage` ni `sessionStorage`.

## Copy recomendado

Encabezado:

```text
Mi empresa
```

Subtexto:

```text
Actualice los datos operativos que veran sus clientes y que usara Punto Club para calcular puntos futuros.
```

Fallback sin logo:

```text
Sin logo cargado
```

Logo listo:

```text
Logo listo para subir
```

Guardado exitoso:

```text
Datos de empresa actualizados.
```

Error de carga:

```text
No se pudo cargar la informacion de la empresa.
```

Error de guardado:

```text
No se pudieron guardar los cambios.
```

Sesion requerida, si aplica:

```text
Inicie sesion para ver la informacion de su empresa.
```

## Estados esperados

- Carga: mostrar estado breve mientras se consultan settings/logo.
- Con datos: mostrar formulario de gestion de empresa activa.
- Sin logo: mostrar fallback, no campo roto ni URL vacia.
- Error API: mantener pantalla estable con mensaje accionable, sin exponer detalles tecnicos.
- No autenticado: no mostrar datos privados; redirigir o indicar que se requiere sesion, segun patron existente.
- Guardando: deshabilitar accion principal o indicar progreso.
- Guardado OK: confirmar sin sacar al usuario de la pantalla.

## Recomendaciones para Web Dev

- Reutilizar la vista/configuracion ya validada en TASK-110 para editar datos de empresa.
- Reutilizar el flujo de logo privado validado en TASK-200.
- Separar comportamiento por contexto:
  - `/company-registration`: registro publico aislado.
  - `/admin-companies`: admin interno aislado.
  - `Mi empresa` autenticada: gestion de empresa activa.
- Ocultar `Admin empresas` del menu autenticado.
- Mantener en menu autenticado solo:
  - `Operaciones`;
  - `Mi empresa`;
  - `Reportes`.
- No persistir token interno en `localStorage` ni `sessionStorage`.
- No exponer tokens, cookies, passwords, hashes, links tokenizados, SAS ni URLs privadas de blob.

## Riesgos o pendientes

- QA debe validar con sesion real que `Mi empresa` carga datos de la empresa activa y no el registro publico.
- QA debe validar que `/company-registration` y `/admin-companies` siguen aisladas por URL directa.
- Si la API de settings por sesion no soporta algun campo, Web Dev debe limitarse a lo ya soportado y documentar el pendiente.
