# Branching And Commits

## Modo simple para proyectos pequenos

Si solo trabaja una persona o un equipo muy pequeno:

- Mantener una rama principal (`main` o `master`).
- Hacer commits pequenos y claros.
- Antes de tareas riesgosas, crear commit baseline.

## Cuando usar ramas

Crear rama cuando:

- Hay mas de una persona tocando codigo.
- La tarea cambia auth, pagos, datos, API o infra.
- El cambio puede tardar varios dias.
- Se quiere abrir PR para review.

Nombre sugerido:

```text
codex/<tema-corto>
```

Ejemplos:

```text
codex/company-password-auth
codex/email-provider-azure
codex/qa-release-fixes
```

## Formato de commit

Usar mensajes claros:

```text
Add company password login
Configure Azure email provider
Fix quote notification validation
Update release status after QA
```

## Antes de cerrar tarea

```powershell
git status
git diff --stat
```

Si se pidio commit:

```powershell
git add <archivos>
git commit -m "Mensaje claro"
```
