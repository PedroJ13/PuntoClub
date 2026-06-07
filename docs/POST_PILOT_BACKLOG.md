# Post-Pilot Backlog

## Objetivo

Recibir hallazgos del piloto controlado y convertirlos en tareas claras sin mezclar bloqueos, mejoras inmediatas y trabajo post-MVP.

## Estado

Estructura preparada. No contiene hallazgos reales todavia.

## Categorias

### Bloqueos P0/P1

Usar para problemas que impiden operar el piloto o ponen en riesgo datos reales.

Ejemplos:

- No se puede buscar o registrar cliente.
- Compra valida no se registra.
- Redencion valida no se registra.
- Saldo queda incorrecto.
- Factura duplicada altera saldo.
- Redencion mayor al saldo queda registrada.
- API/SQL no responde durante sesion real.

Accion esperada:

- Crear hotfix.
- Asignar equipo responsable.
- Pausar ampliacion del piloto hasta validar correccion.

### Mejoras P2 antes de ampliar piloto

Usar para problemas que no bloquean una sesion controlada, pero conviene corregir antes de sumar mas usuarios o empresas.

Ejemplos:

- Mensaje confuso con workaround.
- Paso operativo lento pero usable.
- Historial entendible pero incompleto para caja real.
- Runbook requiere paso manual repetitivo.
- Latencia inicial de SQL afecta la primera interaccion.

Accion esperada:

- Agrupar en batch corto.
- Validar con QA antes de ampliar piloto.

### Pulido P3

Usar para detalles visuales/copy que no afectan datos ni continuidad del flujo.

Ejemplos:

- Label mejorable.
- Alineacion visual menor.
- Orden de campos preferible.
- Texto que podria ser mas claro.

Accion esperada:

- Mantener en lista.
- Resolver cuando coincida con otro cambio del area.

### Post-MVP

Usar para mejoras valiosas que no deben bloquear el piloto.

Ejemplos:

- Reportes avanzados.
- Exportacion CSV.
- Logos propios.
- Admin de empresas.
- Registro publico.
- Usuarios/roles.

Accion esperada:

- Mantener como backlog futuro.
- No mezclar con hotfix del piloto.

### Decisiones de producto

Usar cuando el hallazgo no es bug sino decision pendiente.

Ejemplos:

- Como manejar clientes sin email.
- Politica de facturas manuales.
- Copy final de puntos/canje.
- Que datos son obligatorios para caja real.
- Si el historial debe imprimirse/exportarse.

Accion esperada:

- Registrar decision.
- Crear tarea solo cuando haya criterio claro.

### Decisiones operativas Azure/SQL

Usar para temas de infraestructura derivados del piloto.

Ejemplos:

- Ajustar auto-pause SQL.
- Cambiar a provisioned temporal.
- Endurecer `AllowAllWindowsAzureIps`.
- Agregar staging.
- Ajustar observabilidad.

Accion esperada:

- Requiere aprobacion explicita antes de ejecutar cambios.
- Separar evaluacion de implementacion.

## Plantilla de hallazgo

```text
Hallazgo:
Fuente:
Fecha:
Ambiente:
Flujo:
Paso:
Resultado esperado:
Resultado observado:
Impacto:
Severidad sugerida:
Datos/captura:
Equipo sugerido:
Decision requerida:
```

## Plantilla de tarea derivada

```text
# TASK-XXX - [Verbo + resultado esperado]

## Equipo

[Equipo]

## Contexto

Hallazgo origen:
[Referencia a nota, handoff o captura]

## Objetivo

[Cambio verificable]

## Alcance

- [Incluido]
- [Incluido]

## No tocar

- [Fuera de alcance]

## Dependencias

- [Si aplica]

## Handoff esperado

Al terminar, actualiza:

tasks/TASK-XXX-HANDOFF.md

Incluye:

- Cambios realizados.
- Evidencia.
- Pruebas.
- Riesgos pendientes.
```

## Criterios de priorizacion

### Hotfix

Crear hotfix cuando:

- Es P0/P1.
- Afecta integridad de datos.
- Impide completar compra/redencion.
- Expone datos incorrectos al operador.
- Rompe ambiente publicado.

Regla:

- Hotfix pequeno.
- QA obligatorio despues del deploy.
- No mezclar con mejoras P2/P3.

### Siguiente batch

Usar para:

- P2 repetidos.
- Mejoras que reducen friccion antes de ampliar piloto.
- Ajustes operativos que no son urgentes pero conviene resolver pronto.

Regla:

- Agrupar por equipo y dependencia.
- Mantener batch chico.
- Validar con QA publicado.

### Diferir

Diferir cuando:

- Es P3 sin impacto operativo.
- Es post-MVP.
- Requiere decision de negocio sin evidencia suficiente.
- Agrega complejidad mayor que el aprendizaje esperado del piloto.

Regla:

- Mantener visible.
- Revisar al final del ciclo de piloto.

## Proceso recomendado

1. PO Test o usuario reporta hallazgo con plantilla.
2. Product / Architect / Release clasifica severidad y categoria.
3. Si es P0/P1, abrir tarea hotfix inmediatamente.
4. Si es P2, agrupar para siguiente batch antes de ampliar piloto.
5. Si es P3/post-MVP, registrar y diferir.
6. Pulso revisa patrones despues de la sesion.
7. Product decide seguir, pausar o ampliar piloto.
