# Decision Log

## 2026-06-02 - Fase 1 sera uso real piloto

Decision: Punto Club fase 1 se tratara como uso real piloto con empresas, no como demo visual.

Motivo: El producto necesita compras, facturas unicas, puntos y redenciones confiables desde el inicio.

Impacto: La arquitectura debe incluir persistencia central, reglas de integridad y separacion por empresa.

## 2026-06-02 - Persistencia inicial con Azure SQL Database

Decision: El plan inicial usara Azure SQL Database minima para el MVP.

Motivo: Se requiere historial, unicidad de facturas, saldo confiable y base para multiempresa futura.

Impacto: Infra y SQL DEV deben definir recursos, modelo, restricciones y costos antes de implementar API/UI.
