# Prompts Codex Para Git/GitHub

## Inicializar repo local

```text
Workspace:
<RUTA_DEL_PROYECTO>

Revisa si ya existe repo Git con `git rev-parse --show-toplevel`.
Si no existe, inicializa Git local, revisa `git status` y recomienda un primer commit baseline.
No conectes GitHub todavia.
```

## Crear repo GitHub

```text
Workspace:
<RUTA_DEL_PROYECTO>

Lee `C:\Users\pj13e\Digital Products\codex-git-workflow\GITHUB_AUTH.md` y `GITHUB_REPO_CREATION.md`.
Verifica `gh auth status`.
Si GitHub CLI esta autenticado, crea un repo GitHub privado para este proyecto y conecta `origin`.
No guardes credenciales en archivos.
```

## Conectar remoto existente

```text
Workspace:
<RUTA_DEL_PROYECTO>

Conecta este repo local al remoto:
<URL_DEL_REPO>

Antes de cambiar remotes, muestra `git remote -v` y confirma si ya existe `origin`.
No hagas push hasta que te lo pida.
```

## Crear rama de trabajo

```text
Workspace:
<RUTA_DEL_PROYECTO>

Crea una rama para esta tarea con prefijo `codex/`.
Antes revisa `git status` y no pierdas cambios existentes.
```
