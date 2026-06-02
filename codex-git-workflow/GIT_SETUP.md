# Git Setup Local

## Verificar si ya existe repo

```powershell
git rev-parse --show-toplevel
```

Si devuelve una ruta, el repo ya existe.

## Crear repo local

Desde la raiz del proyecto:

```powershell
git init
```

## Revisar estado

```powershell
git status
```

## Primer commit recomendado

```powershell
git add .
git commit -m "Initial project baseline"
```

## Buenas practicas

- Hacer commit antes de cambios grandes.
- Mantener commits pequenos y descriptivos.
- Revisar `git status` antes y despues de cada tarea.
- No hacer `git reset --hard` salvo que el usuario lo pida explicitamente.
- No commitear `.env`, credenciales, tokens, dumps privados ni archivos temporales sensibles.
