$base = "C:\Honda\Antigravity"
Set-Location $base

function Consolidate-File ($relative_v1, $relative_upd, $relative_v2, $log_msg) {
    Write-Host "Processing $relative_v2 ..."
    if (-not (Test-Path $relative_v1)) { Write-Host "Missing $relative_v1"; return }
    
    $c = Get-Content $relative_v1 -Raw -Encoding UTF8
    
    # Split
    # We use a regex split to be safe, but literal string split is fine usually
    $parts = $c -split "## Change Log"
    if ($parts.Count -lt 2) {
       $body = $c
       $log = "## Change Log"
    } else {
       $body = $parts[0]
       # Reassemble if multiple splits (unlikely)
       $log = "## Change Log" + $parts[1]
    }
    
    # Clean Log
    $log = $log.Replace("**End of Document**", "").Trim()
    
    # Update
    $upd_content = ""
    if (Test-Path $relative_upd) {
        $upd_content = Get-Content $relative_upd -Raw -Encoding UTF8
        # Remove comments, regex for standard XML/HTML comments
        $upd_content = $upd_content -replace "<!--[\s\S]*?-->", ""
    } else {
        Write-Host "Warning: Update file $relative_upd not found."
    }
    
    $full = $body + "`n" + $upd_content + "`n" + $log + "`n`n" + $log_msg + "`n`n**End of Document**"
    $full | Set-Content $relative_v2 -Encoding UTF8
}

$log_entry = "### v1.2 (02/02/2026) - CR-20260202-001`n- Emergency Master Data Implementation.`n- Added: Employee, Supplier, Warehouse, UOM modules.`n- Consolidated from CR drafts."

Consolidate-File "docs\requirements\FRD\frd_master_data_v1.1.md" "docs\requirements\change_requests\CR-20260202-001\drafts\frd_update.md" "docs\requirements\FRD\frd_master_data_v1.2.md" $log_entry
Consolidate-File "docs\design\database\erd\erd_master_data_v1.1.md" "docs\requirements\change_requests\CR-20260202-001\drafts\erd_update.md" "docs\design\database\erd\erd_master_data_v1.2.md" $log_entry
Consolidate-File "docs\design\api\api_spec_master_data_v1.1.md" "docs\requirements\change_requests\CR-20260202-001\drafts\api_update.md" "docs\design\api\api_spec_master_data_v1.2.md" $log_entry
Consolidate-File "docs\design\ui\ui_spec_master_data_v1.1.md" "docs\requirements\change_requests\CR-20260202-001\drafts\ui_update.md" "docs\design\ui\ui_spec_master_data_v1.2.md" $log_entry

Write-Host "Done."
