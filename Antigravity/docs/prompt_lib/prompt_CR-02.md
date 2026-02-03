PROMPT #CR-02: CR IMPACT ANALYSIS
                         (Antigravity Authority)
================================================================================

INPUT:
- Approved CR Intake: change_request_<CR-ID>_intake.md (Status = APPROVED)
- Tài liệu hiện hành (latest): BRD, FRD, ERD, API Spec, UI Spec, Refs

MỤC ĐÍCH:
Phân tích chi tiết impact của CR đến:
- Business Requirements (BRD)
- Functional Requirements (FRD) - đặc biệt Data Requirements
- Data Model (ERD)
- API Contracts (API Spec)
- UI Components (UI Spec, Refs)

THỰC HIỆN:

1. BRD Impact:
   - Business objectives thay đổi?
   - Actors mới?
   - Business flow thay đổi?

2. FRD Impact (QUAN TRỌNG):
   - Screens nào bị ảnh hưởng? (existing/new)
   - ⭐ Data Requirements Changes:
     * Entity mới: name, fields (type, constraints), relationships, classification
     * Entity hiện tại: fields mới, relationships mới
   - Business rules mới/sửa?
   - Validation rules thay đổi?

3. ERD Impact (dựa trên FRD Data Requirements):
   - Tables mới: name, columns, PKs, FKs, indexes
   - Tables hiện tại: columns mới, constraints mới
   - Migration strategy (nullable first, backfill data?)
   - Breaking changes check

4. API Spec Impact:
   - Endpoints mới: path, method, FRD mapping, ERD mapping, specs
   - Endpoints hiện tại sửa: breaking changes?
   - Versioning cần thiết không (v1 → v2)?

5. UI Spec Impact & Refs Evaluation:
   - Screens mới/sửa
   - Refs có đáp ứng không?
     * Reuse As-Is ✅
     * Extend Allowed ✅
     * Component Not Available → YÊU CẦU extend Refs ⚠️
     * KHÔNG cho phép tạo UI mới ngoài Refs ❌

6. Effort Estimate:
   - Complexity: Simple / Medium / Complex
   - Story Points, Hours
   - Risk Level

OUTPUT:
```
docs/requirements/change_requests/<CR-ID>/change_request_<CR-ID>_impact_analysis.md
```

Nội dung:
- Impact Matrix (documents affected)
- Chi tiết changes cho từng document:
  * BRD changes
  * FRD changes (đặc biệt Data Requirements)
  * ERD changes (tables, columns, FKs)
  * API Spec changes (endpoints, breaking changes)
  * UI Spec changes (screens, Refs evaluation)
- Effort estimate
- Risk assessment

Quy tắc:
- Phân tích kỹ lưỡng TẤT CẢ impacts
- FRD Data Requirements phải chi tiết (entities, fields, relationships)
- Đánh giá Refs thoroughly
- KHÔNG skip document nào
- KHÔNG viết code


================================================================================
