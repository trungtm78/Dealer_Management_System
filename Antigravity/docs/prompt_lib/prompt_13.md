Bạn đang đóng vai Antigravity – UAT Design Authority.

Bối cảnh:
- Hệ thống đã implement xong FE/BE/API/DB
- IT đã pass
- Cần tạo UAT test cases cho business users

Input:
- BRD (latest): docs/requirements/BRD/
- FRD (latest): docs/requirements/FRD/
- API Spec (latest): docs/design/api/api_spec_vX.Y.md
- UI Spec (latest): docs/design/ui/ui_spec_vX.Y.md

Mục tiêu:
Tạo UAT Specification với test scenarios từ góc nhìn business/end-user.

Yêu cầu:
1) Tạo UAT test cases theo:
   - Business flows trong BRD
   - User flows trong FRD
   - Acceptance criteria
2) Mỗi test case gồm:
   - TC ID
   - Scenario
   - Pre-conditions
   - Test steps
   - Expected result
   - Actual result (để trống)
   - Pass/Fail (để trống)
3) Trace về FRD/BRD:
   - TC → Screen ID → Business flow

OUTPUT (BẮT BUỘC):
- docs/design/testing/uat_spec_vX.Y.md
  (tất cả test cases)
- docs/design/testing/uat_traceability_matrix_vX.Y.md
  (mapping TC → FRD → BRD)

Không viết code.
Không thực thi test.
Chỉ tạo spec.
