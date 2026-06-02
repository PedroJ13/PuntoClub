# Crear Repo GitHub

## Requisitos

- Git instalado.
- GitHub CLI instalado si se usara `gh`.
- Sesion activa: `gh auth status`.

## Crear repo desde carpeta local

Desde la raiz del proyecto:

```powershell
gh repo create OWNER/REPO --private --source . --remote origin --push
```

Para repo publico:

```powershell
gh repo create OWNER/REPO --public --source . --remote origin --push
```

## Conectar a un repo remoto existente

```powershell
git remote add origin https://github.com/OWNER/REPO.git
git branch -M main
git push -u origin main
```

O con SSH:

```powershell
git remote add origin git@github.com:OWNER/REPO.git
git branch -M main
git push -u origin main
```

## Verificar remoto

```powershell
git remote -v
```

## Nota sobre ramas

Si el proyecto usa `master` en vez de `main`, no renombrar sin decision explicita del usuario/equipo.
