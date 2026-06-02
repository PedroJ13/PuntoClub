# GitHub Auth

Para crear repos, hacer push o abrir PRs en GitHub se necesita autenticacion.

## Opcion recomendada: GitHub CLI

Verificar estado:

```powershell
gh auth status
```

Iniciar sesion:

```powershell
gh auth login
```

Seguir el flujo interactivo de GitHub CLI. La credencial queda administrada por la herramienta, no en archivos del proyecto.

## Opcion alternativa: Git Credential Manager

Git para Windows suele usar Git Credential Manager. Al hacer `git push`, puede abrir login del navegador o prompt seguro.

## Opcion SSH

Verificar llaves existentes:

```powershell
Get-ChildItem $HOME\.ssh
```

Probar conexion:

```powershell
ssh -T git@github.com
```

## No hacer

- No pegar tokens en documentos `.md`.
- No guardar passwords en carpetas de proyecto.
- No commitear `.env` con secretos.
- No pedir a Codex que escriba credenciales en archivos.
