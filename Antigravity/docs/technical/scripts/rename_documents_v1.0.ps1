# Document Version Standardization Script
# Date: 2026-01-30
# Purpose: Rename 22 files to add v1.0 version suffix

Write-Host "=== Document Version Standardization Script ===" -ForegroundColor Cyan
Write-Host "Total files to rename: 22" -ForegroundColor Yellow
Write-Host ""

$baseDir = "C:\Honda\Antigravity\docs"
$renamedCount = 0
$errorCount = 0

# Category 1: Design/API (8 files)
Write-Host "[1/4] Renaming API Spec files..." -ForegroundColor Green
$apiFiles = @(
    @{Old="api_spec_01_dashboard.md"; New="api_spec_01_dashboard_v1.0.md"},
    @{Old="api_spec_02_crm.md"; New="api_spec_02_crm_v1.0.md"},
    @{Old="api_spec_03_sales.md"; New="api_spec_03_sales_v1.0.md"},
    @{Old="api_spec_04_service.md"; New="api_spec_04_service_v1.0.md"},
    @{Old="api_spec_05_parts.md"; New="api_spec_05_parts_v1.0.md"},
    @{Old="api_spec_06_insurance.md"; New="api_spec_06_insurance_v1.0.md"},
    @{Old="api_spec_07_accounting.md"; New="api_spec_07_accounting_v1.0.md"},
    @{Old="api_spec_08_admin.md"; New="api_spec_08_admin_v1.0.md"}
)

foreach ($file in $apiFiles) {
    $oldPath = Join-Path "$baseDir\design\api" $file.Old
    $newPath = Join-Path "$baseDir\design\api" $file.New
    
    if (Test-Path $oldPath) {
        try {
            Rename-Item -Path $oldPath -NewName $file.New -ErrorAction Stop
            Write-Host "  ✓ $($file.Old) → $($file.New)" -ForegroundColor Gray
            $renamedCount++
        } catch {
            Write-Host "  ✗ Failed: $($file.Old) - $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ⚠ Not found: $($file.Old)" -ForegroundColor Yellow
    }
}

# Category 2: Design/DB Dictionary (3 files)
Write-Host ""
Write-Host "[2/4] Renaming DB Dictionary files..." -ForegroundColor Green
$dictFiles = @(
    @{Old="users.md"; New="users_v1.0.md"},
    @{Old="customers.md"; New="customers_v1.0.md"},
    @{Old="leads.md"; New="leads_v1.0.md"}
)

foreach ($file in $dictFiles) {
    $oldPath = Join-Path "$baseDir\design\database\dictionary" $file.Old
    $newPath = Join-Path "$baseDir\design\database\dictionary" $file.New
    
    if (Test-Path $oldPath) {
        try {
            Rename-Item -Path $oldPath -NewName $file.New -ErrorAction Stop
            Write-Host "  ✓ $($file.Old) → $($file.New)" -ForegroundColor Gray
            $renamedCount++
        } catch {
            Write-Host "  ✗ Failed: $($file.Old) - $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ⚠ Not found: $($file.Old)" -ForegroundColor Yellow
    }
}

# Category 3: Requirements/FRD (8 files)
Write-Host ""
Write-Host "[3/4] Renaming FRD Module files..." -ForegroundColor Green
$frdFiles = @(
    @{Old="FRD_Module_01_Dashboard.md"; New="FRD_Module_01_Dashboard_v1.0.md"},
    @{Old="FRD_Module_02_CRM.md"; New="FRD_Module_02_CRM_v1.0.md"},
    @{Old="FRD_Module_03_Sales.md"; New="FRD_Module_03_Sales_v1.0.md"},
    @{Old="FRD_Module_04_Service.md"; New="FRD_Module_04_Service_v1.0.md"},
    @{Old="FRD_Module_05_Parts.md"; New="FRD_Module_05_Parts_v1.0.md"},
    @{Old="FRD_Module_06_Insurance.md"; New="FRD_Module_06_Insurance_v1.0.md"},
    @{Old="FRD_Module_07_Accounting.md"; New="FRD_Module_07_Accounting_v1.0.md"},
    @{Old="FRD_Module_08_Admin.md"; New="FRD_Module_08_Admin_v1.0.md"}
)

foreach ($file in $frdFiles) {
    $oldPath = Join-Path "$baseDir\requirements\FRD" $file.Old
    $newPath = Join-Path "$baseDir\requirements\FRD" $file.New
    
    if (Test-Path $oldPath) {
        try {
            Rename-Item -Path $oldPath -NewName $file.New -ErrorAction Stop
            Write-Host "  ✓ $($file.Old) → $($file.New)" -ForegroundColor Gray
            $renamedCount++
        } catch {
            Write-Host "  ✗ Failed: $($file.Old) - $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ⚠ Not found: $($file.Old)" -ForegroundColor Yellow
    }
}

# Category 4: Requirements/Change Requests (3 files)
Write-Host ""
Write-Host "[4/4] Renaming Change Request files..." -ForegroundColor Green
$crFiles = @(
    @{Old="CR-001_Complete_Missing_Screens.md"; New="CR-001_Complete_Missing_Screens_v1.0.md"},
    @{Old="CR-001_classification.md"; New="CR-001_classification_v1.0.md"},
    @{Old="CR-002_classification.md"; New="CR-002_classification_v1.0.md"},
    @{Old="CR-003_classification.md"; New="CR-003_classification_v1.0.md"}
)

foreach ($file in $crFiles) {
    $oldPath = Join-Path "$baseDir\requirements\change_requests" $file.Old
    $newPath = Join-Path "$baseDir\requirements\change_requests" $file.New
    
    if (Test-Path $oldPath) {
        try {
            Rename-Item -Path $oldPath -NewName $file.New -ErrorAction Stop
            Write-Host "  ✓ $($file.Old) → $($file.New)" -ForegroundColor Gray
            $renamedCount++
        } catch {
            Write-Host "  ✗ Failed: $($file.Old) - $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ⚠ Not found: $($file.Old)" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Successfully renamed: $renamedCount files" -ForegroundColor Green
Write-Host "Errors: $errorCount files" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($renamedCount -eq 22) {
    Write-Host "✓ All files renamed successfully!" -ForegroundColor Green
} elseif ($renamedCount -gt 0) {
    Write-Host "⚠ Partial success - some files were renamed" -ForegroundColor Yellow
} else {
    Write-Host "✗ No files were renamed" -ForegroundColor Red
}
