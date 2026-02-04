# CR INTAKE: Smart Search Component for FKs

## 1. Information
- **CR ID:** CR-20260204-001
- **Title:** Tạo component smart search cho toàn bộ các FK, thao tác như Odoo
- **Date:** 2026-02-04
- **Requester:** User
- **Status:** APPROVED

## 2. Description
Tạo component smart search cho toàn bộ các Foreign Key (FK) dropdowns trong hệ thống, với hành vi thao tác tương tự Odoo:
- **Interaction:** Click input mở list, load default (top N). Gõ text để search realtime (debounce 150-300ms).
- **Search Logic:** "Contains" search trên nhiều field (label, code, email, tax_id...) tùy data type. Luôn áp dụng context + filter cứng.
- **Features:** 
  - Priority display (recentIds, preferredIds).
  - Infinite scroll (load more).
  - "Create 'q'" option khi không có kết quả (nếu enabled). Auto-select sau khi tạo.
  - Keyboard navigation (Arrow keys, Enter, Esc).
- **Reference:** C:/Honda/BK/SelectComponent.txt

## 3. Justification
- Cải thiện UX/UI cho việc nhập liệu, đặc biệt với các danh sách FK lớn (Customers, Products, etc.).
- Tăng tốc độ thao tác của người dùng (search realtime, create in-place).
- Chuẩn hóa hành vi dropdown trên toàn hệ thống.

## 4. Classification
- **Type:** Feature Enhancement
- **Priority:** High
- **Complexity:** Complex (Affects all FK usages, requires new UI component, API updates for search/create constants)

## 5. Impact Analysis Required
- **BRD:** Updates to UI/UX requirements.
- **FRD:** Update Data Requirements (no new entity, but search logic changes), Screen behaviors.
- **ERD:** No schema change expected, but need to check if existing APIs support the search params.
- **API Spec:** Need standardized 'search' endpoints or update 'get-all' to support complex filtering/search.
- **UI Spec:** New global component definition.

## 6. Decision
- **Outcome:** APPROVED
- **Next Step:** Proceed to CR-02 (Impact Analysis)
