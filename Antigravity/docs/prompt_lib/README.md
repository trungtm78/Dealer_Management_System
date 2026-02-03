# PROMPT LIBRARY - Antigravity/OpenCode System

## 📚 Thư viện 25 Prompts chuẩn

Thư mục này chứa **25 prompts** cho hệ thống phát triển với 2 AI:
- **ANTIGRAVITY**: AI thiết kế và quyết định (Design Authority)
- **OPENCODE**: AI coding và implementation (Implementation Executor)

---

## 📂 NỘI DUNG

```
prompt_lib/
├── prompt_01.md ... prompt_19.md    (19 prompts chính)
└── prompt_CR-01.md ... CR-06.md     (6 CR prompts)
```

### Antigravity sử dụng:
- Prompts: 01, 02, 03, 04, 05, 11, 13, 15, 16, 18
- CR Prompts: CR-01, CR-02, CR-03, CR-04, CR-05

### OpenCode sử dụng:
- Prompts: 06, 07, 08, 09, 10, 12, 14, 17, 19
- CR Prompts: CR-06

---

## 🚀 CÁCH SỬ DỤNG

### 1. Đặt thư mục vào project

```
/your-project/prompt_lib/
```

### 2. Gọi Antigravity để thiết kế

```
Sử dụng prompts: /your-project/prompt_lib/
Thực hiện tuần tự: prompt_01, prompt_02, prompt_03, prompt_04, prompt_05

Module: [Tên module]
Requirements: [Danh sách yêu cầu]
Refs: [Đường dẫn UI components]
```

**Antigravity output:** BRD, FRD, ERD, API Spec, UI Spec

### 3. Gọi OpenCode để implement

```
Sử dụng prompts: /your-project/prompt_lib/
Thực hiện tuần tự: prompt_06, prompt_07, prompt_08, prompt_09, prompt_10

Module: [Tên module]
Input: [Documents từ Antigravity]
```

**OpenCode output:** Code, Tests, Deployment-ready system

---

## 📊 WORKFLOW

```
Antigravity (01-05) → Docs → OpenCode (06-10) → Code
       ↓                            ↓
   Handover                     Handover
```

---

## 💡 INTEGRATION

Xem code examples trong README để integrate với:
- Python pipeline
- Node.js API
- Command line tools
- CI/CD systems

---

Đọc file README.md đầy đủ để biết chi tiết!
