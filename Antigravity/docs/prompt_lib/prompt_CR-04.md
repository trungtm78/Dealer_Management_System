PROMPT #CR-04: REVIEW & APPROVE CR DOCUMENTS
                         (Antigravity Authority)
================================================================================

INPUT:
- CR Impact Analysis: change_request_<CR-ID>_impact_analysis.md
- All draft documents: docs/requirements/change_requests/<CR-ID>/drafts/
- CR Documents Draft Summary
- Original documents (latest) để so sánh

MỤC ĐÍCH:
- Review tất cả draft documents
- Verify consistency giữa các documents
- Approve hoặc Request Changes

THỰC HIỆN:

1. Consistency Check:
   - ✅ FRD Data Requirements ↔ ERD tables/columns (100% match)
   - ✅ FRD Screens ↔ API Spec endpoints (all mapped)
   - ✅ API Spec ↔ ERD (all fields mapped)
   - ✅ FRD Screens ↔ UI Spec (all mapped)
   - ✅ UI Spec ↔ Refs (all components available)

2. Completeness Check:
   - BRD: Objectives, Actors, Flows
   - FRD: Screens, Data Requirements (đầy đủ), Business Rules
   - ERD: Diagram, Description, Dictionary (per table)
   - API Spec: Endpoints, Specs, Mappings
   - UI Spec: Screen mappings, Refs strategy

3. Quality Check:
   - Changes đều được đánh dấu với CR ID
   - No breaking changes (hoặc đã documented)
   - Migration strategy defined (nếu có DB changes)
   - Refs strategy clear (không tạo UI mới)

4. Decision:
   - ✅ APPROVED → Proceed to Consolidation (CR-05)
   - ⚠️ REQUEST CHANGES → Fix drafts, re-review
   - ❌ REJECTED → Close CR

OUTPUT:
```
docs/requirements/change_requests/<CR-ID>/change_request_<CR-ID>_review_decision.md
```

Nội dung: Review results, consistency checks, completeness checks, decision

Quy tắc:
- Review kỹ lưỡng
- Consistency checks là BẮT BUỘC
- REJECT rõ ràng nếu có vấn đề
- KHÔNG skip check nào
- KHÔNG viết code


================================================================================
       ⭐