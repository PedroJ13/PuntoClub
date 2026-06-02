# Decision Log

## 2026-06-02 - Fase 1 sera uso real piloto

Decision: Punto Club fase 1 se tratara como uso real piloto con empresas, no como demo visual.

Motivo: El producto necesita compras, facturas unicas, puntos y redenciones confiables desde el inicio.

Impacto: La arquitectura debe incluir persistencia central, reglas de integridad y separacion por empresa.

## 2026-06-02 - Persistencia inicial con Azure SQL Database

Decision: El plan inicial usara Azure SQL Database minima para el MVP.

Motivo: Se requiere historial, unicidad de facturas, saldo confiable y base para multiempresa futura.

Impacto: Infra y SQL DEV deben definir recursos, modelo, restricciones y costos antes de implementar API/UI.

## 2026-06-02 - Puntos enteros con redondeo al entero mas cercano

Decision: `pointsEarned` sera entero y se calculara como `ROUND(amount * pointsPercentage / 100, 0)` para montos positivos.

Motivo: Simplifica la operacion del piloto y alinea API, SQL y QA con puntos enteros.

Impacto: Backend/API debe calcular puntos server-side; frontend no envia `pointsEarned`. QA usara 25000.00 con 5.00% = 1250 como dato base.

## 2026-06-02 - Empresa inactiva no opera en MVP

Decision: Para MVP, una empresa con `status = inactive` no puede operar. La API debe responder como empresa no disponible usando error generico de no encontrada/no operativa, sin exponer detalles innecesarios.

Motivo: Mantener comportamiento simple y seguro mientras no existe panel administrativo avanzado.

Impacto: Backend/API debe validar `Companies.status = active` antes de operaciones principales. Web Dev debe mostrar un error operativo claro sin prometer reactivacion autoservicio.
