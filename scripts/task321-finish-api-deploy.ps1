param(
  [string]$Repo = "PedroJ13/PuntoClub",
  [string]$Workflow = "azure-functions-api.yml",
  [string]$Branch = "main",
  [string]$ResourceGroup = "resource_group_main",
  [string]$ServerName = "sqlserver-pj13-brazil",
  [string]$RuleName = "tmp-task321-sql-smoke-200-229-6-68",
  [switch]$RemoveFirewallOnSuccess,
  [switch]$SkipWorkflow,
  [switch]$SkipFirewallRemoval
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$logDir = Join-Path $scriptRoot "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logPath = Join-Path $logDir "task321-finish-api-deploy-$timestamp.log"

function Wait-BeforeExit {
  param([int]$ExitCode = 0)
  Write-Host ""
  Write-Host "Log guardado en: $logPath" -ForegroundColor Cyan
  Write-Host "Presiona Enter para cerrar..." -ForegroundColor Yellow
  Read-Host | Out-Null
  exit $ExitCode
}

function Ensure-AzLogin {
  try {
    az account show --only-show-errors | Out-Null
    Write-Host "Azure CLI ya tiene una sesion activa." -ForegroundColor Green
  }
  catch {
    Write-Host "No hay sesion activa de Azure CLI. Iniciando device login..." -ForegroundColor Yellow
    az login --use-device-code
  }

  Write-Host "Cuenta Azure activa:" -ForegroundColor Cyan
  az account show --query "{name:name, user:user.name, tenantId:tenantId}" -o table
}

function Ensure-GhLogin {
  try {
    gh auth status --hostname github.com | Out-Null
    Write-Host "GitHub CLI ya tiene una sesion activa." -ForegroundColor Green
  }
  catch {
    Write-Host "No hay sesion activa de GitHub CLI. Iniciando login web..." -ForegroundColor Yellow
    gh auth login --hostname github.com --web
  }

  Write-Host "Sesion GitHub activa." -ForegroundColor Cyan
  gh auth status --hostname github.com
}

Start-Transcript -Path $logPath -Append | Out-Null

try {
  Write-Host "Punto Club - finalizar deploy API y retiro de firewall" -ForegroundColor Cyan
  Write-Host "Repo:      $Repo"
  Write-Host "Workflow:  $Workflow"
  Write-Host "Branch:    $Branch"
  Write-Host "SQL rule:  $RuleName"
  Write-Host ""
  Write-Host "Nota: este script NO guarda credenciales, passwords ni tokens." -ForegroundColor Yellow
  Write-Host "Usa sesiones locales de az/gh o login interactivo." -ForegroundColor Yellow
  Write-Host ""

  if (-not $SkipWorkflow) {
    Ensure-GhLogin

    Write-Host ""
    Write-Host "Relanzando workflow API..." -ForegroundColor Cyan
    gh workflow run $Workflow --repo $Repo --ref $Branch

    Write-Host "Esperando a que GitHub registre el nuevo run..." -ForegroundColor Cyan
    Start-Sleep -Seconds 8

    $runId = gh run list --repo $Repo --workflow $Workflow --branch $Branch --limit 1 --json databaseId --jq '.[0].databaseId'
    if (-not $runId) {
      throw "No se pudo obtener el runId del workflow recien lanzado."
    }

    Write-Host "Workflow run id: $runId" -ForegroundColor Cyan
    gh run view $runId --repo $Repo --web

    Write-Host "Esperando resultado del workflow..." -ForegroundColor Cyan
    gh run watch $runId --repo $Repo --exit-status

    Write-Host "Workflow finalizado en success." -ForegroundColor Green
  }
  else {
    Write-Host "SkipWorkflow activo: no se relanza GitHub Actions." -ForegroundColor Yellow
  }

  if ($RemoveFirewallOnSuccess -and -not $SkipFirewallRemoval) {
    Write-Host ""
    Ensure-AzLogin

    Write-Host "Retirando regla temporal de firewall..." -ForegroundColor Cyan
    az sql server firewall-rule delete `
      --resource-group $ResourceGroup `
      --server $ServerName `
      --name $RuleName `
      --only-show-errors

    Write-Host "Regla temporal retirada: $RuleName" -ForegroundColor Green
  }
  elseif (-not $RemoveFirewallOnSuccess) {
    Write-Host ""
    Write-Host "No se retiro firewall porque no usaste -RemoveFirewallOnSuccess." -ForegroundColor Yellow
    Write-Host "Para retirarlo despues:" -ForegroundColor Yellow
    Write-Host "az sql server firewall-rule delete --resource-group $ResourceGroup --server $ServerName --name $RuleName" -ForegroundColor Yellow
  }

  Stop-Transcript | Out-Null
  Wait-BeforeExit 0
}
catch {
  Write-Host ""
  Write-Host "ERROR en finalizacion de deploy/firewall:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host ""
  Write-Host "Detalle completo en el log." -ForegroundColor Yellow
  try { Stop-Transcript | Out-Null } catch { }
  Wait-BeforeExit 1
}
