param(
  [switch]$NoPause
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Output "CLI-IT LOCAL CI"
Write-Output "ROOT=$Root"

$Node = Get-Command node -ErrorAction SilentlyContinue
if (-not $Node) {
  throw "Node is required but was not found in PATH."
}

Push-Location $Root
try {
  & $Node.Source .\scripts\ci-local.js
  $Code = $LASTEXITCODE
  if ($Code -ne 0) {
    throw "ci-local.js failed with exit code $Code"
  }
}
finally {
  Pop-Location
}
