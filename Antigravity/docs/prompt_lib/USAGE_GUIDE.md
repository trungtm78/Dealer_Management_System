# USAGE GUIDE - PROMPT LIBRARY

## 📋 TEMPLATES COPY-PASTE SẴN DÙNG

Các templates dưới đây bạn chỉ cần:
1. Copy
2. Điền thông tin module
3. Paste vào Claude chat
4. Enter!

---

## 🎯 TEMPLATE 1: DESIGN PHASE (Prompts #01-#05)

### Role: ANTIGRAVITY (Design Authority)

```
Hãy dùng các prompts đã được định nghĩa tại /mnt/user-data/uploads/prompt_lib/
và thực hiện tuần tự các prompts: #01, #02, #03, #04, #05

Module: [TÊN MODULE - VD: Customer Loyalty Program]

Requirements:
- [Requirement 1 - VD: Khách hàng tích điểm khi mua hàng]
- [Requirement 2 - VD: Quy đổi điểm thành voucher]
- [Requirement 3 - VD: Xem lịch sử giao dịch điểm]

Tài liệu hiện có:
- Refs: [path hoặc mô tả - VD: /path/to/refs hoặc "React TypeScript components"]
- CRD: [path hoặc N/A]
- ERD hiện tại: [path hoặc "Tạo mới"]
- Instructions: [path đến instructions.md]

Yêu cầu thực hiện:

1. Đọc và thực hiện prompt_01.md (BRD):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_01.md
   - Tạo: docs/requirements/BRD/BRD_[module]_v1.0.md

2. Đọc và thực hiện prompt_02.md (FRD):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_02.md
   - Input: BRD từ bước 1 + ERD hiện tại + Refs
   - Tạo: docs/requirements/FRD/frd_[module]_v1.0.md

3. Đọc và thực hiện prompt_03.md (ERD):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_03.md
   - Input: BRD + FRD từ bước 1, 2
   - Tạo: docs/design/database/erd/erd_v1.0.* + dictionary files

4. Đọc và thực hiện prompt_04.md (UI Spec):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_04.md
   - Input: FRD + Refs
   - Tạo: docs/design/ui/ui_spec_v1.0.md

5. Đọc và thực hiện prompt_05.md (API Specs):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_05.md
   - Input: BRD + FRD + ERD + UI Spec từ các bước trước
   - Tạo: docs/design/api/api_spec_v1.0.md

6. Sau khi hoàn thành tất cả, tạo Handover Document:
   - File: docs/handover/handover_design_to_implementation_v1.0.md
   - Nội dung: List tất cả documents + instructions cho OpenCode

Ngôn ngữ: Tiếng Việt
Role: Antigravity - KHÔNG viết code, CHỈ thiết kế
```

**Kết quả mong đợi:**
```
✅ BRD_[module]_v1.0.md
✅ frd_[module]_v1.0.md
✅ erd_v1.0.png + erd_description_v1.0.md + dictionary files
✅ ui_spec_v1.0.md
✅ api_spec_v1.0.md
✅ handover_design_to_implementation_v1.0.md
```

---

## 🔧 TEMPLATE 2: IMPLEMENTATION PHASE (Prompts #06-#10)

### Role: OPENCODE (Implementation Executor)

```
Hãy dùng các prompts tại /mnt/user-data/uploads/prompt_lib/
và thực hiện tuần tự: #06, #07, #08, #09, #10

Module: [TÊN MODULE]

Prerequisites - Documents từ Design Phase:
- BRD: docs/requirements/BRD/BRD_[module]_v1.0.md
- FRD: docs/requirements/FRD/frd_[module]_v1.0.md
- ERD: docs/design/database/erd/erd_v1.0.*
- API Spec: docs/design/api/api_spec_v1.0.md
- UI Spec: docs/design/ui/ui_spec_v1.0.md
- Refs: [path to refs]
- Instructions: [path to instructions.md]

Yêu cầu thực hiện:

1. Đọc và thực hiện prompt_06.md (DB Implementation):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_06.md
   - Input: ERD
   - Schema PHẢI match ERD 100%
   - Tạo: migrations + db implementation report

2. Đọc và thực hiện prompt_07.md (API Implementation):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_07.md
   - Input: API Spec + ERD + DB layer
   - API contract PHẢI match specs
   - Tạo: API layer + contract verification

3. Đọc và thực hiện prompt_08.md (Backend Implementation):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_08.md
   - Input: FRD + ERD + API layer
   - Business logic PHẢI theo FRD
   - Tạo: Services + repositories + unit tests

4. Đọc và thực hiện prompt_09.md (Frontend Implementation):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_09.md
   - Input: FRD + UI Spec + API Spec + Refs
   - PHẢI dùng Refs components
   - Tạo: FE code + Refs mapping report

5. Đọc và thực hiện prompt_10.md (Integration Testing):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_10.md
   - Input: FRD + API Spec + ERD + implemented code
   - Test scenarios từ FRD
   - Tạo: IT execution report

6. Sau khi hoàn thành, tạo Handover Document:
   - File: docs/handover/handover_implementation_to_uat_v1.0.md
   - Nội dung: Implementation summary + test results

Ngôn ngữ: Tiếng Việt
Role: OpenCode - PHẢI theo specs, KHÔNG tự thiết kế
```

**Kết quả mong đợi:**
```
✅ DB migrations + implementation report
✅ API layer + contract verification
✅ Backend services + unit tests
✅ Frontend code + Refs mapping
✅ Integration test report
✅ handover_implementation_to_uat_v1.0.md
```

---

## 📝 TEMPLATE 3: CHANGE REQUEST PROCESS (CR-01 to CR-06)

### Role: ANTIGRAVITY (Change Authority) + OPENCODE (Executor)

```
Hãy dùng các prompts tại /mnt/user-data/uploads/prompt_lib/
và thực hiện CR process: CR-01, CR-02, CR-03, CR-04, CR-05, CR-06

Change Request:
Title: [Tiêu đề CR - VD: Add Point Expiry Feature]
Description:
- [Chi tiết thay đổi 1]
- [Chi tiết thay đổi 2]
- [Chi tiết thay đổi 3]

Documents hiện tại (latest versions):
- BRD: docs/requirements/BRD/BRD_[module]_v[X.Y].md
- FRD: docs/requirements/FRD/frd_[module]_v[X.Y].md
- ERD: docs/design/database/erd/erd_v[X.Y].*
- API Spec: docs/design/api/api_spec_v[X.Y].md
- UI Spec: docs/design/ui/ui_spec_v[X.Y].md

Yêu cầu thực hiện CR pipeline:

=== ANTIGRAVITY PHASE ===

1. Đọc và thực hiện prompt_CR-01.md (CR Intake):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_CR-01.md
   - Validation + Phân loại + Gán CR ID
   - Output: change_request_<CR-ID>_intake.md

2. Đọc và thực hiện prompt_CR-02.md (Impact Analysis):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_CR-02.md
   - Phân tích impact: BRD/FRD/ERD/API/UI
   - Output: change_request_<CR-ID>_impact_analysis.md

3. Đọc và thực hiện prompt_CR-03.md (Create Drafts):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_CR-03.md
   - Tạo DRAFT versions trong CR folder
   - Output: BRD_DRAFT, FRD_DRAFT, ERD_DRAFT, etc.

4. Đọc và thực hiện prompt_CR-04.md (Review):
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_CR-04.md
   - Consistency checks
   - Decision: APPROVED/CHANGES/REJECTED
   - Output: change_request_<CR-ID>_review_decision.md

5. ⭐⭐⭐ Đọc và thực hiện prompt_CR-05.md (CONSOLIDATE) ⭐⭐⭐:
   - Path: /mnt/user-data/uploads/prompt_lib/prompt_CR-05.md
   - MERGE drafts into main documents
   - REMOVE CR markers
   - INCREMENT versions (v1.0 → v1.1)
   - CREATE CONSOLIDATED.md marker
   - CREATE HANDOVER_TO_OPENCODE.md (strict contract for OpenCode)
   - Output: Updated main docs (vX.Y++) + consolidation report + handover file

=== OPENCODE PHASE ===

CR-ID: CR-XXX
Handover File Path: docs/requirements/change_requests/<CR-ID>/HANDOVER_TO_OPENCODE.md
Status: READY_FOR_IMPLEMENTATION

6. Đọc và thực hiện prompt_CR-06.md (Implementation):
   - Path: /docs/prompt_lib/prompt_CR-06.md

   === GATE CHECK (BẮT BUỘC – THIẾU LÀ DỪNG) ===
   A) Xác nhận tồn tại 2 file:
      1) docs/requirements/change_requests/<CR-ID>/CONSOLIDATED.md
      2) docs/requirements/change_requests/<CR-ID>/HANDOVER_TO_OPENCODE.md

   B) Nếu KHÔNG tìm thấy HANDOVER_TO_OPENCODE.md:
      - DỪNG ngay, KHÔNG implement bất kỳ code nào
      - Output duy nhất:
        docs/requirements/change_requests/<CR-ID>/missing_handover_blocker.md
        (ghi rõ bạn đã search ở đâu + không tìm thấy)

   === EXECUTION RULES (STRICT) ===
   1) MUST đọc HANDOVER_TO_OPENCODE.md trước, và trích ra:
      - Danh sách MAIN DOCUMENTS phải đọc (exact paths + versions)
      - Danh sách FILES/MODULES được phép sửa (ALLOWLIST)
      - Scope change + acceptance checklist
      - Test focus list

   2) CHỈ được sửa các file trong ALLOWLIST.
      - Nếu phát hiện cần sửa file ngoài allowlist → DỪNG và báo lại bằng report.

   3) CHỈ đọc main documents đúng theo list trong HANDOVER.
      - KHÔNG tự đoán “latest”.

   4) Output:
      - Updated code theo scope
      - docs/requirements/change_requests/<CR-ID>/change_request_<CR-ID>_implementation_summary.md
      - (kèm evidence: files changed + tests run)
Ngôn ngữ: Tiếng Việt
Critical: CR-05 CONSOLIDATE phải hoàn thành trước CR-06!
```

**Kết quả mong đợi:**
```
✅ CR intake + impact analysis
✅ Draft documents trong CR folder
✅ Review decision
✅ ⭐ Main documents updated (v1.1)
✅ CONSOLIDATED.md marker
✅ Updated code theo v1.1
✅ CR implementation summary
```

---

🐛 TEMPLATE 4: BUG MANAGEMENT (Prompts #16–#17)

=== ANTIGRAVITY: Bug Confirmation ===

Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_16.md

Context:
- Module: <MODULE>
- UAT RUN-ID: <RUN-ID>

Input:
- UAT Execution Log:
  docs/implementation/uat/uat_execution_log_<MODULE>_<RUN-ID>.md
- Runtime Bug Report:
  docs/implementation/bugs/runtime_bug_report_<MODULE>_<RUN-ID>.md
- Bug Log (append only):
  docs/implementation/bugs/runtime_bug_log.md

Yêu cầu:
- Phân tích từng bug
- Xác nhận: BUG / CHANGE REQUEST / ENV ISSUE / NEED MORE INFO
- Trace bug về FRD / API / UI / ERD nếu có

OUTPUT (KHÔNG VERSION – DYNAMIC):
- Bug Confirmation Decision:
  docs/design/testing/bug_confirmation_<MODULE>_<RUN-ID>.md


=== OPENCODE: Bug Fix (BATCH MODE – FIX ALL BUGS) ===

Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_17.md

Context (BẮT BUỘC):
- Module: <MODULE>
- UAT RUN-ID: <RUN-ID>

Input (BẮT BUỘC):
- Bug Confirmation:
  docs/design/testing/bug_confirmation_<MODULE>_<RUN-ID>.md 
  docs/design/testing/uat_report_<MODULE>_<RUN-ID>.md
  docs/design/testing/uat_review_decision_<MODULE>_<RUN-ID>.md

- Runtime Bug Report:
  docs/implementation/bugs/runtime_bug_report_<MODULE>_<RUN-ID>.md
- Bug Log:
  docs/implementation/bugs/runtime_bug_log.md

EXECUTION LOGIC (STRICT – KHÔNG ĐƯỢC LỆCH):
1) Đọc Bug Confirmation và trích ra:
   - DANH SÁCH TẤT CẢ BUG-ID có trạng thái = CONFIRMED BUG

2) Nếu danh sách rỗng:
   - DỪNG
   - Ghi rõ: "No confirmed bugs for this UAT run"

3) Với MỖI BUG-ID trong danh sách (LOOP BẮT BUỘC):
   a) Reproduce bug
   b) Fix bug đúng phạm vi
   c) Verify fix
   d) Ghi report riêng cho bug đó

4) KHÔNG được:
   - Bỏ sót bug
   - Fix bug không nằm trong danh sách CONFIRMED
   - Thay đổi API / DB schema nếu không có CR mới

OUTPUT (KHÔNG VERSION – DYNAMIC):
- Với MỖI BUG-ID:
  docs/implementation/bugs/bug_fix_report_<BUG-ID>_<RUN-ID>.md

- Update Bug Log (append):
  docs/implementation/bugs/runtime_bug_log.md

- UAT Re-run Log (sau khi fix xong TẤT CẢ bug):
  docs/implementation/uat/uat_execution_log_bugfix_<MODULE>_<RUN-ID>.md

DEFINITION OF DONE:
- TẤT CẢ bug CONFIRMED BUG đều:
  - Fixed
  - Verified
- Không còn bug CONFIRMED tồn tại cho run này
- UAT re-run PASS hoặc có giải trình rõ


## 📊 TEMPLATE 5: UAT PROCESS (Prompts #13-#15)

```
=== ANTIGRAVITY: UAT PLAN ===
Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_13.md

Module: <MODULE>

Input:
- BRD (latest)
- FRD (latest)
- Implementation reports (latest)
- Handover File Path: docs/requirements/change_requests/<CR-ID>/HANDOVER TO OPENCODE.md

OUTPUT (KHÔNG VERSION – DYNAMIC):
- RUN-ID: <RUN-ID>  (Antigravity MUST generate, ví dụ: UAT-20260201-01)
- UAT Plan:
  docs/design/testing/uat_plan_<MODULE>_<RUN-ID>.md


=== OPENCODE: UAT EXECUTION ===
Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_14.md
MODULE: XXX
RUN-ID: YYY
Input:
- UAT Plan:
  docs/design/testing/uat_plan_<MODULE>_<RUN-ID>.md

OUTPUT (KHÔNG VERSION – DYNAMIC):
- UAT Execution Log:
  docs/implementation/uat/uat_execution_log_<MODULE>_<RUN-ID>.md
- (nếu có bug) Runtime Bug Report:
  docs/implementation/bugs/runtime_bug_report_<MODULE>_<RUN-ID>.md
- Bug Log (append, fixed name):
  docs/implementation/bugs/runtime_bug_log.md


=== ANTIGRAVITY: UAT REPORT ===
Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_15.md

Input:
- UAT Execution Log:
  docs/implementation/uat/uat_execution_log_<MODULE>_<RUN-ID>.md
- Runtime Bug Report (nếu có):
  docs/implementation/bugs/runtime_bug_report_<MODULE>_<RUN-ID>.md

OUTPUT (KHÔNG VERSION – DYNAMIC):
- UAT Report:
  docs/design/testing/uat_report_<MODULE>_<RUN-ID>.md
- UAT Review Decision:
  docs/design/testing/uat_review_decision_<MODULE>_<RUN-ID>.md


## 🚀 TEMPLATE 6: SINGLE PROMPT EXECUTION

Nếu chỉ muốn chạy 1 prompt riêng lẻ:

```
Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_[XX].md

[Điền input cần thiết cho prompt đó]

Ngôn ngữ: Tiếng Việt
```

Ví dụ:
```
Hãy đọc và thực hiện prompt tại:
/mnt/user-data/uploads/prompt_lib/prompt_01.md

Module: Order Management
Requirements:
- Tạo đơn hàng
- Xem đơn hàng
- Hủy đơn hàng

Refs: /path/to/refs
CRD: N/A
```

---

## 💡 TIPS

1. **Luôn upload folder prompt_lib/ vào chat trước**
2. **Copy template phù hợp**
3. **Điền đầy đủ thông tin module**
4. **Paste vào chat và Enter**
5. **Claude sẽ tự động đọc prompts và thực hiện**

---

## 🎓 WORKFLOW ĐẦY ĐỦ

```
Day 1: Design Phase
→ Use Template 1 (Prompts #01-#05)
→ Get: All design documents

Day 2: Implementation
→ Use Template 2 (Prompts #06-#10)
→ Get: Code + Tests

Day 3: UAT
→ Use Template 5 (Prompts #13-#15)
→ Get: UAT results

Day 4 (if needed): Change Request
→ Use Template 3 (CR-01 to CR-06)
→ Get: Updated documents + code

Day 5: Deploy
→ Use prompt_19.md
→ Get: Deployed system
```

---

Happy building! 🚀
