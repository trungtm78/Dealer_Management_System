# Naming Compliance Checklist

## Purpose
This checklist is provided for QA and PM teams to verify that all documentation files comply with the Honda Antigravity project naming conventions and directory structure standards.

## General Rules
- [ ] **File names must use snake_case** (all lowercase, underscores between words)
- [ ] **File names must include version suffix** in format vX.Y (e.g., v1.0, v2.1)
- [ ] **No spaces in file names**
- [ ] **No special characters except underscores and hyphens**
- [ ] **No prohibited keywords**: final, latest, new, ok, fix, revised, updated
- [ ] **File format**: `<document_type>_<scope_or_module>_vX.Y.md`

## Directory Structure Compliance

### Requirements Documents
- [ ] **BRD files**: Must be in `docs/requirements/BRD/`
- [ ] **FRD files**: Must be in `docs/requirements/FRD/`
- [ ] **Change Requests**: Must be in `docs/requirements/change_requests/`
  - [ ] Named as: `change_request_<description>_vX.Y.md`

### Design Documents
- [ ] **Database ERD**: Must be in `docs/design/database/erd/`
  - [ ] Named as: `erd_<description>_vX.Y.md`
- [ ] **Data Dictionary**: Must be in `docs/design/database/dictionary/`
  - [ ] Named as: `<entity_name>.md` (version not required for data dictionary)
- [ ] **UI Specifications**: Must be in `docs/design/ui/`
  - [ ] Named as: `ui_<component>_vX.Y.md`
- [ ] **API Specifications**: Must be in `docs/design/api/`
  - [ ] Named as: `api_spec_<module>_vX.Y.md`
- [ ] **UAT Design**: Must be in `docs/design/testing/`
  - [ ] Named as: `uat_<type>_vX.Y.md`

### Implementation Documents
- [ ] **Implementation Reports**: Must be in `docs/implementation/reports/`
  - [ ] Named as: `implementation_<type>_vX.Y.md`
- [ ] **Frontend**: Must be in `docs/implementation/fe/`
  - [ ] Named as: `fe_<component>_vX.Y.md`
- [ ] **Backend**: Must be in `docs/implementation/be/`
  - [ ] Named as: `be_<component>_vX.Y.md`
- [ ] **Testing**: Must be in `docs/implementation/testing/`
  - [ ] Named as: `test_<type>_vX.Y.md`
- [ ] **UAT Execution**: Must be in `docs/implementation/uat/`
  - [ ] Named as: `uat_<type>_vX.Y.md`

### Technical Documents
- [ ] **Refactoring**: Must be in `docs/technical/refactoring/`
  - [ ] Named as: `refactoring_<type>_vX.Y.md`
- [ ] **Deployment**: Must be in `docs/technical/deploy/`
  - [ ] Named as: `deploy_<type>_vX.Y.md`
- [ ] **Governance**: Must be in `docs/technical/governance/`
  - [ ] Named as: `governance_<type>_vX.Y.md`
- [ ] **Scripts**: Must be in `docs/technical/scripts/`
  - [ ] Named as: `<script_name>_vX.Y.<extension>`

## File Type Specific Naming

### BRD Documents
- [ ] Format: `brd_<project_name>_vX.Y.md`
- [ ] Example: `brd_honda_dms_v2.0.md` ✅
- [ ] Example: `BRD_Honda_DMS_v2.md` ❌

### FRD Documents
- [ ] Format: `frd_<module>_vX.Y.md`
- [ ] Example: `frd_dashboard_v1.0.md` ✅
- [ ] Example: `FRD_Module_01_Dashboard.md` ❌

### API Specifications
- [ ] Format: `api_spec_<module>_vX.Y.md`
- [ ] Example: `api_spec_crm_v1.0.md` ✅
- [ ] Example: `api_spec_02_crm.md` ❌

### UAT Documents
- [ ] Format: `uat_<document_type>_vX.Y.md`
- [ ] Example: `uat_classification_v1.0.md` ✅
- [ ] Example: `uat_classification_v4.0_revised.md` ❌

### Change Requests
- [ ] Format: `change_request_<description>_vX.Y.md`
- [ ] Example: `change_request_cr001_classification_v1.0.md` ✅
- [ ] Example: `CR-001_classification.md` ❌

### Refactoring Documents
- [ ] Format: `refactoring_<document_type>_vX.Y.md`
- [ ] Example: `refactoring_change_log_v1.0.md` ✅
- [ ] Example: `refactoring_change_log.md` ❌

## Version Number Rules
- [ ] Version must follow semantic versioning: vX.Y
  - [ ] X = Major version (0, 1, 2, ...)
  - [ ] Y = Minor version (0, 1, 2, ...)
- [ ] Version must be separated from filename by underscore
- [ ] If no version exists, default to v1.0
- [ ] Do not auto-increment versions during normalization

## Validation Steps

### Automated Checks
1. [ ] Run file name validation script
2. [ ] Verify all files are in correct directories
3. [ ] Check for prohibited keywords
4. [ ] Validate version number format
5. [ ] Ensure no spaces or special characters

### Manual Verification
1. [ ] Spot check file names for readability
2. [ ] Verify links and cross-references still work
3. [ ] Check that document content matches file name
4. [ ] Ensure all stakeholders can locate documents easily

## Common Issues to Check
- [ ] Mixed case file names (e.g., ProjectSummary.md)
- [ ] Spaces in file names (e.g., "project summary.md")
- [ ] Missing version numbers (e.g., api_spec.md)
- [ ] Wrong version format (e.g., v1, v1., 1.0)
- [ ] Prohibited keywords (e.g., final, latest, new)
- [ ] Files in wrong directory (e.g., FRD in design/)

## Sign-off
- [ ] **QA Team**: All naming conventions verified
- [ ] **PM Team**: Directory structure approved
- [ ] **Technical Lead**: Implementation verified
- [ ] **Documentation Owner**: Standards compliance confirmed

---
**Checklist Version**: 1.0  
**Effective Date**: January 30, 2026  
**Next Review**: January 30, 2027