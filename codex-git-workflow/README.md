# Codex Git Workflow

Guias genericas para inicializar Git, conectar un proyecto a GitHub y trabajar con commits/branches desde Codex o terminal.

## Regla de seguridad

No guardar credenciales, tokens, passwords, claves privadas ni secretos en esta carpeta ni en ningun repo.

Usar herramientas seguras del sistema:

- Git Credential Manager de Windows.
- GitHub CLI con `gh auth login`.
- SSH keys en `C:\Users\<usuario>\.ssh`.
- Variables de entorno o secret stores cuando aplique.

## Archivos

- `GIT_SETUP.md`: inicializar Git local y primer commit.
- `GITHUB_AUTH.md`: autenticar GitHub sin guardar tokens en archivos.
- `GITHUB_REPO_CREATION.md`: crear repo remoto y conectar `origin`.
- `BRANCHING_AND_COMMITS.md`: reglas simples para ramas, commits y handoffs.
- `CODEX_PROMPTS.md`: prompts para pedirle a Codex que prepare o conecte un repo.
