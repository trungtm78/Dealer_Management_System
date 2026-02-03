# HANDOVER TO OPENCODE

**CR ID**: CR-20260202-003
**Mission**: Implement Missing Master Data (Gap Analysis)
**Priority**: CRITICAL

## Input Documents (LATEST VERSIONS)
Please use ONLY the following documents for implementation. **Note: Consolidation requires manual merge of Additions.**

1. **BRD**: `docs/requirements/BRD/brd_honda_dms_v2.4.md` (Baseline) + **Read Drafts if available**
2. **FRD**: `docs/requirements/FRD/frd_master_data_v1.2.md` + **APPEND**: `docs/requirements/change_requests/CR-20260202-003/frd_additions.md`
3. **ERD**: `docs/design/database/erd/erd_master_data_v1.2.md` + **APPEND**: `docs/requirements/change_requests/CR-20260202-003/erd_additions.md`
4. **API**: `docs/design/api/api_spec_master_data_v1.2.md` + **APPEND**: `docs/requirements/change_requests/CR-20260202-003/api_additions.md`
5. **UI**: `docs/design/ui/ui_spec_v1.5.md` + **APPEND**: `docs/requirements/change_requests/CR-20260202-003/ui_additions.md`

## Implementation Scope
1. **Database**: Create 20 new tables (VehicleColor, PartCategory, etc.) defined in `erd_additions.md`.
2. **API**: Generate CRUD endpoints defined in `api_additions.md`.
3. **Backend**: Implement Services/Repositories for Master Data.
4. **Frontend**: Create generic or specific Master Data screens as per `ui_additions.md`.

## Notes
- Follow standard prompts #06-#10.
- All validation rules are defined in FRD additions.
- Use `Generic Master Data` UI pattern where possible.
