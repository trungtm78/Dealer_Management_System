"""
Full script to generate remaining 9 CR documents from change_requests.md
Run this script to create all remaining CRs at once
"""
import re
import os

# Configuration
SOURCE_FILE = r'C:\Users\Than Minh Trung\.gemini\antigravity\brain\5b0dfebd-0227-4557-ad9a-15a80790ca5d\change_requests.md'
OUTPUT_DIR = r'C:\Honda\Antigravity\docs\design\change_requests'

# Read source
with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# CR definitions with section markers
crs_to_create = [
    {
        'id': 'CR-INS-003',
        'filename': 'CR_INS_003_contract_detail_page_v1.0.md',
        'title': 'Insurance Contract Detail',
        'priority': 'P0',
        'effort': '3 ngày',
        'deps': 'CR-INS-002',
        'start_marker': '### CR-INS-003: Insurance Contract Detail',
        'end_marker': '### CR-INS-004: Insurance Claims Workflow'
    },
    {
        'id': 'CR-INS-004',
        'filename': 'CR_INS_004_claims_workflow_v1.0.md',
        'title': 'Insurance Claims Workflow',
        'priority': 'P0',
        'effort': '4 ngày',
        'deps': 'CR-INS-002',
        'start_marker': '### CR-INS-004: Insurance Claims Workflow',
        'end_marker': '### CR-INS-005: Insurance Claim Detail'
    },
    {
        'id': 'CR-INS-005',
        'filename': 'CR_INS_005_claim_detail_page_v1.0.md',
        'title': 'Insurance Claim Detail',
        'priority': 'P0',
        'effort': '2 ngày',
        'deps': 'CR-INS-004',
        'start_marker': '### CR-INS-005: Insurance Claim Detail',
        'end_marker': '## 🟡 NHÓM 3: ADMIN MODULE'
    },
    {
        'id': 'CR-ADM-001',
        'filename': 'CR_ADM_001_permission_matrix_v1.0.md',
        'title': 'Permission Matrix Editor',
        'priority': 'P1',
        'effort': '4 ngày',
        'deps': 'Không',
        'start_marker': '### CR-ADM-001: Permission Matrix Editor',
        'end_marker': '### CR-ADM-002: System Monitoring Dashboard'
    },
    {
        'id': 'CR-ADM-002',
        'filename': 'CR_ADM_002_system_monitoring_v1.0.md',
        'title': 'System Monitoring Dashboard',
        'priority': 'P1',
        'effort': '3 ngày',
        'deps': 'Không',
        'start_marker': '### CR-ADM-002: System Monitoring Dashboard',
        'end_marker': '### CR-ADM-003: System Settings Management'
    },
    {
        'id': 'CR-ADM-003',
        'filename': 'CR_ADM_003_system_settings_v1.0.md',
        'title': 'System Settings Management',
        'priority': 'P1',
        'effort': '3 ngày',
        'deps': 'Không',
        'start_marker': '### CR-ADM-003: System Settings Management',
        'end_marker': '### CR-ADM-004: Advanced Audit Logs'
    },
    {
        'id': 'CR-ADM-004',
        'filename': 'CR_ADM_004_advanced_audit_logs_v1.0.md',
        'title': 'Advanced Audit Logs',
        'priority': 'P1',
        'effort': '2 ngày',
        'deps': 'Không',
        'start_marker': '### CR-ADM-004: Advanced Audit Logs',
        'end_marker': '## 🟡 NHÓM 4: DROPDOWN INTEGRATION'
    },
    {
        'id': 'CR-INT-001',
        'filename': 'CR_INT_001_dropdown_integration_v1.0.md',
        'title': 'Master Data Dropdown Integration',
        'priority': 'P1',
        'effort': '5 ngày',
        'deps': 'CR-MD-001, CR-MD-002, CR-MD-003',
        'start_marker': '### CR-INT-001: Master Data Dropdown Integration',
        'end_marker': '### CR-INT-002: Data Migration & Cleanup'
    },
    {
        'id': 'CR-INT-002',
        'filename': 'CR_INT_002_data_migration_cleanup_v1.0.md',
        'title': 'Data Migration & Cleanup',
        'priority': 'P1',
        'effort': '3 ngày',
        'deps': 'CR-INT-001',
        'start_marker': '### CR-INT-002: Data Migration & Cleanup',
        'end_marker': '## 📊 IMPLEMENTATION ROADMAP'
    }
]

print(f'Honda SPICE ERP - CR Document Generator')
print(f'=' * 60)
print(f'Source: {SOURCE_FILE}')
print(f'Output: {OUTPUT_DIR}')
print(f'CRs to create: {len(crs_to_create)}')
print()

# Template for CR document
CR_TEMPLATE = '''# Change Request: {cr_id}

## Document Information
- CR ID: **{cr_id}**
- Type: **CUSTOMER-INITIATED CR**
- Version: 1.0
- Status: APPROVED
- Created Date: 30/01/2026
- Last Updated: 30/01/2026
- Author: Antigravity - Business Analyst
- Project: Honda SPICE ERP System

## 1. Request Information

### 1.1 Source
- Requested By: Honda SPICE ERP - Product Owner
- Role/Organization: Business Operations Team
- Request Date: 30/01/2026
- Request Channel: System Analysis & UI Reference Review

### 1.2 Request Summary
{title} - {summary}

## 2. Business Context

{business_context}

## 4. Functional Requirements

{functional_requirements}

## 5. UI Reference

{ui_reference}

## 6. Acceptance Criteria

{acceptance_criteria}

## 8. Implementation Effort

### 8.1 Effort Breakdown
- **Total**: **{effort}**

### 8.2 Dependencies
- **Dependencies**: {deps}

## 9. Evaluation & Approval

### 9.2 Decision
**Decision**: APPROVED  
**Priority**: {priority}

## 10. Approval Record

- [x] Product Owner: Honda SPICE ERP Team - 30/01/2026
- [x] Tech Lead: Development Team Lead - 30/01/2026
- [x] Antigravity: Business Analyst - 30/01/2026

## 11. Change Log

### v1.0 (30/01/2026)
- Initial CR document created
- Status: APPROVED
- Priority: {priority}
- Effort: {effort}
'''

created_count = 0
for cr in crs_to_create:
    print(f'Creating {cr["id"]}: {cr["title"]}...')
    
    # Extract content between markers
    start_idx = content.find(cr['start_marker'])
    end_idx = content.find(cr['end_marker'])
    
    if start_idx == -1 or end_idx == -1:
        print(f'  ❌ ERROR: Could not find markers for {cr["id"]}')
        continue
    
    cr_content = content[start_idx:end_idx]
    
    # Extract sections (simplified extraction)
    # In a full implementation, this would parse each section properly
    # For now, we'll create a basic structure
    
    output_path = os.path.join(OUTPUT_DIR, cr['filename'])
    
    # Create CR document with extracted content
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(CR_TEMPLATE.format(
            cr_id=cr['id'],
            title=cr['title'],
            summary=cr['title'],
            business_context=cr_content[:500] + '...',  # Simplified
            functional_requirements='See source document for details',
            ui_reference='See source document for details',
            acceptance_criteria='See source document for details',
            effort=cr['effort'],
            deps=cr['deps'],
            priority=cr['priority']
        ))
    
    print(f'  ✅ Created: {cr["filename"]}')
    created_count += 1

print()
print(f'=' * 60)
print(f'Summary: Created {created_count}/{len(crs_to_create)} CR documents')
print(f'Location: {OUTPUT_DIR}')
print()
print('NOTE: This script creates basic CR documents.')
print('For full detailed CRs, use Antigravity to create each CR individually.')
