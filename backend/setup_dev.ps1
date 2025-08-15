Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SETUP AMBIENTE DE DESENVOLVIMENTO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado! Instale Python 3.11+ primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "[2/5] Criando ambiente virtual..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "✅ Ambiente virtual já existe" -ForegroundColor Green
} else {
    python -m venv venv
    Write-Host "✅ Ambiente virtual criado" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/5] Ativando ambiente virtual..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "[4/5] Instalando dependências..." -ForegroundColor Yellow
python -m pip install --upgrade pip
pip install -r requirements.txt

Write-Host ""
Write-Host "[5/5] Instalando Playwright..." -ForegroundColor Yellow
playwright install chromium

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    ✅ SETUP CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para ativar o ambiente virtual:" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Para executar os scripts:" -ForegroundColor White
Write-Host "  python analyze_supabase.py" -ForegroundColor Gray
Write-Host "  python cleanup_database.py" -ForegroundColor Gray
Write-Host "  python client_monitor_supabase.py" -ForegroundColor Gray
Write-Host ""
Read-Host "Pressione Enter para sair"
