# Скрипт для удаления версий из import statements
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$files = Get-ChildItem -Recurse -File -Include *.tsx, *.ts, *.js, *.jsx |
    Where-Object {
        $_.FullName -notmatch "\\node_modules\\" -and 
        $_.FullName -notmatch "\\.git\\" -and 
        $_.FullName -notmatch "\\dist\\" -and 
        $_.FullName -notmatch "\\build\\"
    }

$total = $files.Count
$index = 0
$fixed = 0

$patterns = @(
    'lucide-react@[0-9][^\s\'\"]*',
    'sonner@[0-9][^\s\'\"]*',
    'class-variance-authority@[0-9][^\s\'\"]*',
    'input-otp@[0-9][^\s\'\"]*',
    'vaul@[0-9][^\s\'\"]*',
    'recharts@[0-9][^\s\'\"]*',
    'cmdk@[0-9][^\s\'\"]*',
    'react-hook-form@[0-9][^\s\'\"]*',
    'react-resizable-panels@[0-9][^\s\'\"]*',
    'embla-carousel-react@[0-9][^\s\'\"]*'
)

foreach ($file in $files) {
    $index++
    if ($index % 25 -eq 0) { Write-Host ("Progress: {0}/{1}" -f $index, $total) -ForegroundColor Yellow }

    $content = Get-Content $file.FullName -Raw
    $original = $content

    foreach ($pattern in $patterns) {
        $packageName = ($pattern -split '@')[0]
        $content = $content -replace $pattern, $packageName
    }

    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✓ $($file.FullName)" -ForegroundColor Green
        $fixed++
    }
}

Write-Host ("\nComplete! Fixed {0} files (scanned {1})." -f $fixed, $total) -ForegroundColor Cyan