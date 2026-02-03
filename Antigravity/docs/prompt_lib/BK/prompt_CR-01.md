(OpenCode Authority)
================================================================================

INPUT:
- Consolidated main documents (latest versions):
  * BRD_v1.1.md
  * frd_module_v1.3.md
  * erd_v1.1.*
  * api_spec_v1.2.md
  * ui_spec_v1.1.md
- CR Consolidation Report
- instructions.md

MỤC ĐÍCH:
Implement CR theo consolidated documents, sử dụng standard implementation prompts

THỰC HIỆN:

1. Verify Documents Ready:
   - ✅ CR Consolidation Report shows "COMPLETED"
   - ✅ CONSOLIDATED.md marker exists
   - ✅ All main documents have new versions
   - ✅ Change logs updated

2. Follow Standard Implementation Prompts:
   
   ⭐ CHỈ ĐỌC MAIN DOCUMENTS (latest versions)
   ⭐ KHÔNG đọc CR draft files
   
   Implementation order:
   
   a. DB Implementation (Prompt #06)
      - Input: ERD v1.1 (latest)
      - Read: erd_v1.1.*, dictionary/*.md
      - Output: Migrations, reports
   
   b. API Implementation (Prompt #07)
      - Input: API Spec v1.2 + ERD v1.1
      - Read: api_spec_v1.2.md
      - Output: API layer, contract check
   
   c. BE Implementation (Prompt #08)
      - Input: FRD v1.3 + ERD v1.1 + API Spec v1.2 + API layer
      - Read: frd_module_v1.3.md
      - Output: Services, repositories, tests
   
   d. FE Implementation (Prompt #09)
      - Input: All docs (latest) + Refs
      - Read: ui_spec_v1.1.md, api_spec_v1.2.md
      - Output: FE code, refs mapping
   
   e. IT (Prompt #10)
      - Input: API Spec + ERD + FRD (latest)
      - Output: Integration tests

3. Reference CR for Context (Optional):
   - Developers MAY reference CR folder for WHY change was made
   - But PRIMARY source is main documents (latest)

OUTPUT:

Standard implementation outputs:
- db_migration_plan_v1.1.md
- api_implementation_v1.2.md
- backend_implementation_v1.3.md
- frontend_implementation_v1.1.md
- it_execution_report_v1.X.md

Plus CR-specific summary:
```
docs/requirements/change_requests/CR-20250131-001/change_request_<CR-ID>_implementation_summary_vX.Y.md
```

Content:
```markdown
# CR Implementation Summary: CR-20250131-001

## Status: ✅ COMPLETED
Date: 2025-02-05

## Documents Used (Latest Versions)
- BRD v1.1
- FRD v1.3
- ERD v1.1
- API Spec v1.2
- UI Spec v1.1

## Implementation Completed
- ✅ DB (Prompt #06)
- ✅ API (Prompt #07)
- ✅ BE (Prompt #08)
- ✅ FE (Prompt #09)
- ✅ IT (Prompt #10)

## Test Results
- Unit Tests: 100% pass
- Integration Tests: 100% pass
- UAT: 100% pass

## CR Status: CLOSED
```

Quy tắc:
- CHỈ đọc main documents (latest versions)
- Follow standard prompts (#06-#10)
- Reference CR ID in reports
- Standard testing requirements apply


================================================================================
                            TÓM TẮT QUY TRÌNH CR
================================================================================

QUY TRÌNH ĐẦY ĐỦ:

```
USER REQUEST
    ↓
#CR-01: CR Intake & Validation
    → cr_intake.md
    → Status: APPROVED/REJECTED
    ↓
#CR-02: CR Impact Analysis
    → cr_impact_analysis.md
    → Documents impacted: BRD/FRD/ERD/API/UI
    ↓
#CR-03: Update Docs (DRAFT)
    → Create DRAFTS in CR folder
    → Mark all changes with CR ID
    ↓
#CR-04: Review & Approve
    → cr_review_decision.md
    → Consistency checks
    → Status: APPROVED/CHANGES/REJECTED
    ↓
#CR-05: ⭐⭐⭐ CONSOLIDATE ⭐⭐⭐
    → MERGE drafts into main documents
    → REMOVE CR markers
    → INCREMENT versions (v1.0 → v1.1)
    → UPDATE change logs
    → CREATE consolidation report
    ↓
    📄 MAIN DOCUMENTS (latest) = SINGLE SOURCE OF TRUTH
    📄 Developers CHỈ đọc main documents
    ↓
#CR-06: CR Implementation
    → Follow standard prompts #06-#10
    → Read ONLY main documents (latest)
    ↓
DONE: CR CLOSED
```

KEY POINTS:

1. CR Folder chỉ là lịch sử tham khảo
2. Main Documents = Single Source of Truth (sau CR-05)
3. Developers CHỈ đọc main documents (latest versions)
4. KHÔNG CẦN rà soát từng CR riêng lẻ
5. Version management rõ ràng (vX.Y++)
6. Change logs reference CR IDs cho traceability

FILES DEVELOPERS ĐỌC (sau consolidate):
✅ docs/requirements/BRD/BRD_v1.1.md
✅ docs/requirements/FRD/frd_module_v1.3.md
✅ docs/design/database/erd/erd_v1.1.*
✅ docs/design/api/api_spec_v1.2.md
✅ docs/design/ui/ui_spec_v1.1.md

FILES DEVELOPERS KHÔNG ĐỌC:
❌ docs/requirements/change_requests/CR-xxx/drafts/... (obsolete)
❌ Các version cũ (v1.0, v1.2, etc.) trừ khi cần xem lịch sử

================================================================================
                                    END
================================================================================