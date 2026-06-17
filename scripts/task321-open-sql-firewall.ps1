param(
  [string]$ResourceGroup = "resource_group_main",
  [string]$ServerName = "sqlserver-pj13-brazil",
  [string]$RuleName = "tmp-task321-sql-smoke-200-229-6-68",
  [string]$IpAddress = "200.229.6.68"
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$logDir = Join-Path $scriptRoot "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logPath = Join-Path $logDir "task321-open-sql-firewall-$timestamp.log"

function Wait-BeforeExit {
  param([int]$ExitCode = 0)
  Write-Host ""
  Write-Host "Log guardado en: $logPath" -ForegroundColor Cyan
  Write-Host "Presiona Enter para cerrar..." -ForegroundColor Yellow
  Read-Host | Out-Null
  exit $ExitCode
}

Start-Transcript -Path $logPath -Append | Out-Null

try {
  Write-Host "Punto Club - abrir firewall SQL temporal" -ForegroundColor Cyan
  Write-Host "Resource group: $ResourceGroup"
  Write-Host "SQL server:     $ServerName"
  Write-Host "Rule:           $RuleName"
  Write-Host "IP:             $IpAddress"
  Write-Host ""

  Write-Host "Nota: este script NO guarda credenciales, passwords ni tokens." -ForegroundColor Yellow
  Write-Host "Usa az login para autenticar la sesion local de Azure CLI." -ForegroundColor Yellow
  Write-Host ""

  try {
    az account show --only-show-errors | Out-Null
    Write-Host "Azure CLI ya tiene una sesion activa." -ForegroundColor Green
  }
  catch {
    Write-Host "No hay sesion activa de Azure CLI. Iniciando device login..." -ForegroundColor Yellow
    az login --use-device-code
  }

  Write-Host ""
  Write-Host "Cuenta Azure activa:" -ForegroundColor Cyan
  az account show --query "{name:name, user:user.name, tenantId:tenantId}" -o table

  Write-Host ""
  Write-Host "Creando/actualizando regla temporal de firewall..." -ForegroundColor Cyan
  az sql server firewall-rule create `
    --resource-group $ResourceGroup `
    --server $ServerName `
    --name $RuleName `
    --start-ip-address $IpAddress `
    --end-ip-address $IpAddress `
    --only-show-errors `
    -o table

  Write-Host ""
  Write-Host "Validando que la regla exista..." -ForegroundColor Cyan
  az sql server firewall-rule show `
    --resource-group $ResourceGroup `
    --server $ServerName `
    --name $RuleName `
    --only-show-errors `
    -o table

  Write-Host ""
  Write-Host "Regla temporal creada. Ahora Ejecucion Tecnica puede consultar dbo.Companies." -ForegroundColor Green
  Write-Host "Cuando terminen, retirar la regla con:" -ForegroundColor Yellow
  Write-Host "az sql server firewall-rule delete --resource-group $ResourceGroup --server $ServerName --name $RuleName" -ForegroundColor Yellow

  Stop-Transcript | Out-Null
  Wait-BeforeExit 0
}
catch {
  Write-Host ""
  Write-Host "ERROR al abrir firewall SQL temporal:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host ""
  Write-Host "Detalle completo en el log." -ForegroundColor Yellow
  try { Stop-Transcript | Out-Null } catch { }
  Wait-BeforeExit 1
}
