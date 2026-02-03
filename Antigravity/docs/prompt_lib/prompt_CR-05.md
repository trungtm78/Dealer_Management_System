PROMPT #CR-05: CONSOLIDATE INTO MAIN DOCUMENTS (QUAN TRỌNG) ⭐
                         (Antigravity Authority)
================================================================================

INPUT:
- Approved CR drafts: docs/requirements/change_requests/<CR-ID>/drafts/
- CR Review Decision (APPROVED)
- Current main documents (latest versions)

MỤC ĐÍCH:
⭐⭐⭐ MERGE tất cả CR changes vào main documents ⭐⭐⭐
⭐⭐⭐ INCREMENT versions ⭐⭐⭐
⭐⭐⭐ Main documents trở thành SINGLE SOURCE OF TRUTH ⭐⭐⭐

SAU BƯỚC NÀY:
✅ Developers CHỈ đọc main documents (latest version)
✅ KHÔNG CẦN đọc từng CR riêng lẻ
✅ Main documents chứa TẤT CẢ thông tin

NGUYÊN TẮC CONSOLIDATE:

1. Single Source of Truth:
   - Main documents là nguồn sự thật DUY NHẤT
   - Sau consolidate, main documents chứa TẤT CẢ info
   - CR files chỉ là lịch sử tham khảo

2. Version Increment:
   - Minor changes: vX.Y → vX.(Y+1) (ví dụ: v1.0 → v1.1)
   - Major changes: vX.Y → v(X+1).0 (ví dụ: v1.5 → v2.0)

3. Clean Integration:
   - REMOVE CR-specific markers (<!-- <CR-ID>: ADDED -->)
   - Integrate changes naturally vào document
   - Update change logs

THỰC HIỆN:

1. Determine New Versions:
   ```
   BRD v1.0 → v1.1
   FRD v1.2 → v1.3
   ERD v1.0 → v1.1
   API Spec v1.1 → v1.2
   UI Spec v1.0 → v1.1
   ```

2. Consolidate Each Document:
   ```
   BRD_v1.0.md (current)
     ↓
   BRD_v1.1.md (new) ← MERGE CR changes vào đây
   ```

   Process:
   a. Create new version file (BRD_v1.1.md)
   b. Copy all content from draft
   c. REMOVE CR markers
   d. Integrate changes seamlessly
   e. Update version number in header
   f. Update Change Log section:
      ```
      ## Version 1.1 - 2025-01-31
      ### Changes
      - Added loyalty program (<CR-ID>)
      - New actor: Loyalty Program Manager
      ### Related
      - CR: <CR-ID>
      - FRD: v1.2 → v1.3
      - ERD: v1.0 → v1.1

      ## Version 1.0 - 2025-01-15
      ### Initial Release
      ```

3. Special Handling for FRD:
   - Integrate new entities vào Data Requirements section
   - Update existing entities với new fields
   - NO markers - integrate naturally
   - Ensure formatting consistency

4. Special Handling for ERD:
   - Update main ERD diagram file: erd_v1.0.png → erd_v1.1.png
   - Update erd_description_v1.1.md
   - Add new dictionary files: dictionary/loyalty_points.md
   - Update erd_change_log.md:
     ```
     ## Version 1.1 - 2025-01-31
     ### Added
     - Table: loyalty_points (<CR-ID>)
     ### Modified
     - Table: customers (<CR-ID>)
     ### Related
     - FRD v1.3 Data Requirements
     ```

5. Update Cross-references:
   - FRD mentions: "Based on: BRD v1.1, ERD version: v1.1"
   - ERD mentions: "Based on: FRD v1.3 Data Requirements"
   - API Spec mentions: "Based on: FRD v1.3, ERD v1.1"

6. Archive CR Folder:
   - Keep CR folder for reference
   - Create CONSOLIDATED.md marker:
     ```markdown
     # <CR-ID>: CONSOLIDATED
     Date: 2025-01-31

     ## Updated Documents
     - BRD: v1.0 → v1.1
     - FRD: v1.2 → v1.3
     - ERD: v1.0 → v1.1
     - API Spec: v1.1 → v1.2
     - UI Spec: v1.0 → v1.1

     ## Developers: Read These Files
     ✅ docs/requirements/BRD/BRD_v1.1.md
     ✅ docs/requirements/FRD/frd_module_v1.3.md
     ✅ docs/design/database/erd/erd_v1.1.*
     ✅ docs/design/api/api_spec_v1.2.md
     ✅ docs/design/ui/ui_spec_v1.1.md

     ❌ DO NOT read CR drafts

     ## Implementation Handover
- Handover File: docs/requirements/change_requests/<CR-ID>/HANDOVER_TO_OPENCODE.md
- OpenCode MUST read ONLY the files listed in this marker

Status: READY FOR IMPLEMENTATION
     ```

OUTPUT:

1. Updated Main Documents (NEW versions):
   ```
   docs/requirements/BRD/BRD_v1.1.md
   docs/requirements/FRD/frd_module_v1.3.md
   docs/design/database/erd/erd_v1.1.png
   docs/design/database/erd/erd_description_v1.1.md
   docs/design/database/dictionary/loyalty_points.md (new)
   docs/design/database/erd/erd_change_log.md (updated)
   docs/design/api/api_spec_v1.2.md
   docs/design/api/api_change_log.md (updated)
   docs/design/ui/ui_spec_v1.1.md
   ```

2. Consolidation Report:
   ```
   docs/requirements/change_requests/<CR-ID>/change_request_<CR-ID>_consolidation_report.md
   ```

3. CONSOLIDATED Marker:

4. Handover to OpenCode (STRICT CONTRACT):
   ```
   docs/requirements/change_requests/<CR-ID>/HANDOVER_TO_OPENCODE.md
   ```

   MUST include:
   - CR-ID
   - Status: READY_FOR_IMPLEMENTATION
   - List of UPDATED main documents (exact paths + new versions)
   - Summary of changes (BRD/FRD/ERD/API/UI) + impacted modules/screens/endpoints/tables
   - Migration notes (nullable/backfill/breaking changes)
   - Test focus list (critical flows to re-run)

   ```
   docs/requirements/change_requests/<CR-ID>/CONSOLIDATED.md
   ```

DEFINITION OF DONE:

✅ All CR changes merged into main documents
✅ All CR markers removed from main documents
✅ Versions incremented correctly
✅ Change logs updated in all documents
✅ Cross-references updated
✅ New dictionary files added (if any)
✅ Consolidation report created
✅ CONSOLIDATED.md marker created
✅ Main documents = Single Source of Truth
✅ Developers can read ONLY main documents (latest versions)

Quy tắc:
- REMOVE all CR markers từ main documents
- Main documents must be clean và natural
- Version increments must be consistent
- Change logs must reference CR ID
- CONSOLIDATED marker indicates CR is done
- KHÔNG viết code


================================================================================
