function Merge-Document ($source, $draft, $dest, $logMessage) {
    Write-Host "Merging $source to $dest..."
    if (-not (Test-Path $source)) {
        Write-Host "Error: Source $source not found."
        return
    }
    if (-not (Test-Path $draft)) {
        Write-Host "Warning: Draft $draft not found."
        $draftContent = ""
    }
    else {
        $draftContent = Get-Content $draft -Raw -Encoding UTF8
    }

    $content = Get-Content $source -Raw -Encoding UTF8
    
    # Remove End of Document
    $content = $content.Replace("**End of Document**", "")
    
    # Prepare Log
    $log = "`n`n## Change Log`n" + $logMessage + "`n`n**End of Document**"
    
    # Combine
    $finalDetails = $content + "`n" + $draftContent + $log
    
    # Fix Version Header if possible
    $finalDetails = $finalDetails.Replace("Version**: 1.2", "Version**: 1.3")
    
    Set-Content $dest -Value $finalDetails -Encoding UTF8
    Write-Host "Created $dest"
}

$base = "c:\Honda\Antigravity\docs"

# FRD
Merge-Document "$base\requirements\FRD\frd_master_data_v1.2.md" `
    "$base\requirements\change_requests\CR-20260202-002\drafts\frd_update.md" `
    "$base\requirements\FRD\frd_master_data_v1.3.md" `
    "### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)`n- Added FR-MD-009 to 025 (Secondary Masters)`n- Defined Navigation Structure"

# ERD
Merge-Document "$base\design\database\erd\erd_master_data_v1.2.md" `
    "$base\requirements\change_requests\CR-20260202-002\drafts\erd_update.md" `
    "$base\design\database\erd\erd_master_data_v1.3.md" `
    "### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)`n- Added Secondary Master Tables"

# API
Merge-Document "$base\design\api\api_spec_master_data_v1.2.md" `
    "$base\requirements\change_requests\CR-20260202-002\drafts\api_update.md" `
    "$base\design\api\api_spec_master_data_v1.3.md" `
    "### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)`n- Added Secondary Master Endpoints"

# UI
Merge-Document "$base\design\ui\ui_spec_master_data_v1.2.md" `
    "$base\requirements\change_requests\CR-20260202-002\drafts\ui_update.md" `
    "$base\design\ui\ui_spec_master_data_v1.3.md" `
    "### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)`n- Defined Navigation & Screens for Secondary Masters"

Write-Host "Done."
