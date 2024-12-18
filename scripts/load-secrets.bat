@echo off
setlocal EnableDelayedExpansion

REM Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found!
    exit /b 1
)

REM Check if gh CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: GitHub CLI (gh^) is not installed. Please install it first:
    echo https://cli.github.com/
    exit /b 1
)

REM Check if logged in to GitHub
gh auth status >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Not logged in to GitHub. Please run 'gh auth login' first.
    exit /b 1
)

REM Read .env file and set each variable as a secret
for /f "tokens=1,* delims==" %%a in (.env) do (
    set "key=%%a"
    set "value=%%b"
    
    REM Trim whitespace
    for /f "tokens=*" %%x in ("!key!") do set "key=%%x"
    for /f "tokens=*" %%x in ("!value!") do set "value=%%x"
    
    REM Skip empty lines and comments
    echo !key! | findstr /r "^#" >nul
    if !ERRORLEVEL! neq 0 (
        if not "!key!"=="" if not "!value!"=="" (
            echo Setting secret: !key!
            echo !value! | gh secret set "!key!"
        )
    )
)

echo All secrets have been set successfully!
