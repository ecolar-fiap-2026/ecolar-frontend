$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
node scripts/check-delivery.mjs
if ($LASTEXITCODE -ne 0) { throw "Resolva as pendencias de entrega antes de gerar o ZIP final." }
npm run check
if ($LASTEXITCODE -ne 0) { throw "A verificacao falhou." }
npm run build
if ($LASTEXITCODE -ne 0) { throw "O build falhou." }
$staging = Join-Path ([System.IO.Path]::GetTempPath()) ("EcoLar-" + [guid]::NewGuid())
$payload = Join-Path $staging "ecolar-frontend"
New-Item -ItemType Directory -Path $payload | Out-Null
$allowed = @("src", "public", "docs", "tests", "scripts", "index.html", "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "vercel.json", ".env.example", ".gitignore", "README.md", "integrantes.txt", "entrega.json")
foreach ($item in $allowed) { Copy-Item -Path (Join-Path $projectRoot $item) -Destination $payload -Recurse -Force }
$archive = Join-Path (Split-Path -Parent $projectRoot) ("EcoLar_Front_Entrega_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".zip")
Compress-Archive -Path $payload -DestinationPath $archive
if ((Get-Item $archive).Length -gt 50000000) { throw "ZIP maior que 50 MB. Reduza os recursos e gere novamente." }
Write-Host "ZIP criado: $archive"
Write-Host "Extraia em outra pasta, execute pelo README e confira o arquivo antes do Portal."
Remove-Item -LiteralPath $staging -Recurse -Force
