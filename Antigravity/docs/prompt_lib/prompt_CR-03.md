PROMPT #CR-03: UPDATE REQUIREMENT DOCUMENTS (DRAFT)
                         (Antigravity Authority)
================================================================================

INPUT:
- CR Impact Analysis: change_request_<CR-ID>_impact_analysis.md
- Tài liệu hiện hành (latest): BRD, FRD, ERD, API Spec, UI Spec

MỤC ĐÍCH:
- Tạo DRAFT versions của tất cả documents cần update
- CHƯA update file chính
- Lưu drafts trong CR folder để review

THỰC HIỆN:

1. Tạo CR-specific Document Drafts trong:
   ```
   docs/requirements/change_requests/<CR-ID>/drafts/
   ├── BRD_<CR-ID>_DRAFT.md
   ├── frd_module_<CR-ID>_DRAFT.md
   ├── erd_<CR-ID>_DRAFT/
   │   ├── erd_DRAFT.png
   │   ├── erd_description_DRAFT.md
   │   └── dictionary/
   │       └── <TABLE_NAME>_DRAFT.md (new table)
   ├── api_spec_<CR-ID>_DRAFT.md
   └── ui_spec_<CR-ID>_DRAFT.md
   ```

2. Update BRD (nếu cần):
   - Copy BRD hiện tại vào draft
   - Thêm/sửa sections
   - Đánh dấu changes: `<!-- <CR-ID>: ADDED -->...<!-- END <CR-ID> -->`

3. Update FRD (nếu cần):
   - Copy FRD hiện tại vào draft
   - Update screens
   - ⭐ UPDATE Data Requirements section:
     * Add new entities với đầy đủ: fields (name, type, constraints), relationships, classification
     * Update existing entities với new fields
   - Update business rules, validation rules
   - Đánh dấu changes

4. Update ERD (nếu cần):
   - Copy ERD files vào draft folder
   - Update ERD diagram với new tables/columns
   - Update erd_description
   - ⭐ Create/Update dictionary files (per table):
     ```markdown
     # Table: loyalty_points
     ## Purpose, Classification
     ## Columns (name, type, nullable, constraints)
     ## Indexes, Relationships, Usage (screens/APIs)
     ## Business Rules, Sample Data, Migration Notes
     ```

5. Update API Spec (nếu cần):
   - Add new endpoints với: FRD mapping, ERD mapping, Request/Response specs, Error codes
   - Update existing endpoints
   - Đánh dấu changes

6. Update UI Spec (nếu cần):
   - Add new screens với Refs mapping
   - Update existing screens
   - Đánh dấu changes

7. Tạo Summary:
   ```
   docs/requirements/change_requests/<CR-ID>/change_request_<CR-ID>_draft_summary.md
   ```

OUTPUT:
- All draft files trong CR folder
- Draft summary file

Quy tắc:
- Tạo drafts trong CR folder, KHÔNG touch file chính
- Đánh dấu TẤT CẢ changes với CR ID
- FRD Data Requirements phải chi tiết và đầy đủ
- ERD phải 100% reflect FRD Data Requirements
- KHÔNG viết code
- KHÔNG increment version numbers (giữ vX.Y)


================================================================================