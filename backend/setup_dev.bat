@echo off
echo ========================================
echo    SETUP AMBIENTE DE DESENVOLVIMENTO
echo ========================================
echo.

echo [1/5] Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado! Instale Python 3.11+ primeiro.
    pause
    exit /b 1
)

echo.
echo [2/5] Criando ambiente virtual...
if exist venv (
    echo ✅ Ambiente virtual já existe
) else (
    python -m venv venv
    echo ✅ Ambiente virtual criado
)

echo.
echo [3/5] Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo [4/5] Instalando dependências...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo [5/5] Instalando Playwright...
playwright install chromium

echo.
echo ========================================
echo    ✅ SETUP CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Para ativar o ambiente virtual:
echo   venv\Scripts\activate.bat
echo.
echo Para executar os scripts:
echo   python analyze_supabase.py
echo   python cleanup_database.py
echo   python client_monitor_supabase.py
echo.
pause
