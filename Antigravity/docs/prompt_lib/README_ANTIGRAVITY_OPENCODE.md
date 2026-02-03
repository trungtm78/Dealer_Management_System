# PROMPT LIBRARY - FOR ANTIGRAVITY & OPENCODE

## 📚 Thư viện Prompts cho Antigravity/OpenCode Development System

Thư mục này chứa **25 prompts chuẩn** để sử dụng trong hệ thống Antigravity/OpenCode:
- **19 prompts chính** (#01-#19): Full development lifecycle
- **6 CR prompts** (CR-01 to CR-06): Change Request process

---

## 🎯 ANTIGRAVITY vs OPENCODE

### **ANTIGRAVITY** (Design Authority)
- **Role**: Thiết kế, phân tích, ra quyết định
- **Prompts**: #01-#05, #11, #13, #15, #16, #18, CR-01 to CR-05
- **Output**: Documents (BRD, FRD, ERD, API Spec, UI Spec)
- **Rule**: ❌ KHÔNG viết code

### **OPENCODE** (Implementation Executor)
- **Role**: Thực hiện, code, test, deploy
- **Prompts**: #06-#10, #12, #14, #17, #19, CR-06
- **Output**: Code, tests, deployment
- **Rule**: ❌ KHÔNG tự thiết kế, PHẢI theo docs

---

## 📁 CẤU TRÚC

```
prompt_lib/
├── prompt_01.md          ← BRD (Antigravity)
├── prompt_02.md          ← FRD (Antigravity)
├── prompt_03.md          ← ERD (Antigravity)
├── prompt_04.md          ← UI Spec (Antigravity)
├── prompt_05.md          ← API Specs (Antigravity)
├── prompt_06.md          ← DB Implementation (OpenCode)
├── prompt_07.md          ← API Implementation (OpenCode)
├── prompt_08.md          ← Backend Implementation (OpenCode)
├── prompt_09.md          ← Frontend Implementation (OpenCode)
├── prompt_10.md          ← Integration Testing (OpenCode)
├── prompt_11.md          ← Refactoring Analysis (Antigravity)
├── prompt_12.md          ← Refactoring Execution (OpenCode)
├── prompt_13.md          ← UAT Planning (Antigravity)
├── prompt_14.md          ← UAT Execution (OpenCode)
├── prompt_15.md          ← UAT Report (Antigravity)
├── prompt_16.md          ← Bug Confirmation (Antigravity)
├── prompt_17.md          ← Bug Fix (OpenCode)
├── prompt_18.md          ← Change Request (Antigravity)
├── prompt_19.md          ← Local Deploy (OpenCode)
├── prompt_CR-01.md       ← CR Intake (Antigravity)
├── prompt_CR-02.md       ← CR Impact Analysis (Antigravity)
├── prompt_CR-03.md       ← Update Docs DRAFT (Antigravity)
├── prompt_CR-04.md       ← Review & Approve (Antigravity)
├── prompt_CR-05.md       ← CONSOLIDATE (Antigravity)
└── prompt_CR-06.md       ← CR Implementation (OpenCode)
```

---

## 🚀 CÁCH SỬ DỤNG

### **Setup 1 lần:**

Đặt folder `prompt_lib/` vào vị trí cố định, ví dụ:
```
/project/prompt_lib/
```

Hoặc trong system prompt của Antigravity/OpenCode, định nghĩa:
```
PROMPT_LIB_PATH=/project/prompt_lib/
```

---

### **Khi gọi ANTIGRAVITY:**

#### Ví dụ 1: Design Phase (Prompts #01-#05)

```
@Antigravity

Hãy dùng các prompts đã được định nghĩa tại /project/prompt_lib/
và thực hiện tuần tự prompts: #01, #02, #03, #04, #05

Module: Customer Loyalty Program

Requirements:
- Khách hàng tích điểm khi mua hàng (1000 VND = 1 điểm)
- Quy đổi điểm thành voucher giảm giá
- Xem lịch sử giao dịch điểm

Tài liệu hiện có:
- Refs: /project/refs-ui/
- CRD: N/A
- ERD hiện tại: Tạo mới
- Instructions: /project/instructions.md

Thực hiện:
1. Đọc /project/prompt_lib/prompt_01.md → Tạo BRD
2. Đọc /project/prompt_lib/prompt_02.md → Tạo FRD
3. Đọc /project/prompt_lib/prompt_03.md → Tạo ERD
4. Đọc /project/prompt_lib/prompt_04.md → Tạo UI Spec
5. Đọc /project/prompt_lib/prompt_05.md → Tạo API Specs
6. Tạo Handover cho OpenCode
```

**ANTIGRAVITY sẽ:**
```
✅ Đọc prompt_01.md từ /project/prompt_lib/
✅ Thực hiện theo nội dung → Tạo BRD
✅ Đọc prompt_02.md
✅ Thực hiện → Tạo FRD
✅ ... (tiếp tục)
✅ Tạo handover document
```

---

### **Khi gọi OPENCODE:**

#### Ví dụ 2: Implementation Phase (Prompts #06-#10)

```
@OpenCode

Hãy dùng các prompts tại /project/prompt_lib/
và thực hiện tuần tự: #06, #07, #08, #09, #10

Module: Customer Loyalty Program

Input documents (từ Antigravity):
- BRD: docs/requirements/BRD/BRD_loyalty_v1.0.md
- FRD: docs/requirements/FRD/frd_loyalty_v1.0.md
- ERD: docs/design/database/erd/erd_v1.0.*
- API Spec: docs/design/api/api_spec_v1.0.md
- UI Spec: docs/design/ui/ui_spec_v1.0.md
- Refs: /project/refs-ui/
- Instructions: /project/instructions.md

Thực hiện:
1. Đọc /project/prompt_lib/prompt_06.md → DB Implementation
2. Đọc /project/prompt_lib/prompt_07.md → API Implementation
3. Đọc /project/prompt_lib/prompt_08.md → Backend Implementation
4. Đọc /project/prompt_lib/prompt_09.md → Frontend Implementation
5. Đọc /project/prompt_lib/prompt_10.md → Integration Testing
6. Tạo Handover cho Antigravity
```

**OPENCODE sẽ:**
```
✅ Đọc prompt_06.md
✅ Implement DB theo ERD
✅ Đọc prompt_07.md
✅ Implement API theo API Spec
✅ ... (tiếp tục)
✅ Tạo handover document
```

---

## 📋 WORKFLOW ĐẦY ĐỦ

### **Day 1: ANTIGRAVITY Design**
```
@Antigravity
Dùng prompts #01-#05 tại /project/prompt_lib/
Module: [your module]
Requirements: [your requirements]
```

**Output:**
```
✅ BRD, FRD, ERD, API Spec, UI Spec
✅ Handover document for OpenCode
```

---

### **Day 2: OPENCODE Implementation**
```
@OpenCode
Dùng prompts #06-#10 tại /project/prompt_lib/
Module: [your module]
Input docs: [từ Antigravity]
```

**Output:**
```
✅ DB, API, BE, FE code
✅ Integration tests
✅ Handover document for Antigravity
```

---

### **Day 3: ANTIGRAVITY UAT Planning**
```
@Antigravity
Dùng prompt #13 tại /project/prompt_lib/
Module: [your module]
Input: Implementation reports từ OpenCode
```

**Output:**
```
✅ UAT Plan
✅ Handover for OpenCode
```

---

### **Day 4: OPENCODE UAT Execution**
```
@OpenCode
Dùng prompt #14 tại /project/prompt_lib/
Input: UAT Plan từ Antigravity
```

**Output:**
```
✅ UAT Execution results
✅ Handover for Antigravity
```

---

### **Khi có Change Request:**
```
@Antigravity
Dùng prompts CR-01 to CR-05 tại /project/prompt_lib/
CR Request: [description]
Current docs: [versions]
```

**Output:**
```
✅ Updated docs (v1.1)
✅ CONSOLIDATED
✅ Handover for OpenCode
```

```
@OpenCode
Dùng prompt CR-06 tại /project/prompt_lib/
Input: Consolidated docs v1.1
```

**Output:**
```
✅ Updated code
✅ CR Implementation summary
```

---

## 🔑 SYSTEM PROMPT INTEGRATION

### **Trong System Prompt của ANTIGRAVITY:**

```
You are ANTIGRAVITY - Design Authority.

PROMPT LIBRARY LOCATION: /project/prompt_lib/

When user requests design work, you will:
1. Identify which prompts to use (e.g., #01-#05 for full design)
2. Read each prompt file from /project/prompt_lib/prompt_XX.md
3. Execute according to prompt instructions
4. Create documents as specified
5. Generate handover for OpenCode

YOUR PROMPTS: #01-#05, #11, #13, #15, #16, #18, CR-01 to CR-05

RULES:
- ALWAYS read prompt file before executing
- NEVER write implementation code
- ALWAYS create handover documents
- Use Vietnamese language
```

---

### **Trong System Prompt của OPENCODE:**

```
You are OPENCODE - Implementation Executor.

PROMPT LIBRARY LOCATION: /project/prompt_lib/

When user requests implementation work, you will:
1. Identify which prompts to use (e.g., #06-#10 for implementation)
2. Read each prompt file from /project/prompt_lib/prompt_XX.md
3. Execute according to prompt instructions
4. Implement code as specified
5. Generate handover for Antigravity

YOUR PROMPTS: #06-#10, #12, #14, #17, #19, CR-06

RULES:
- ALWAYS read prompt file before executing
- NEVER make design decisions (follow docs strictly)
- ALWAYS trace code to documents
- Use Vietnamese language
```

---

## 💡 AUTOMATION EXAMPLES

### **Auto-execute Design Phase:**

Trong Antigravity system:
```python
def execute_design_phase(module_name, requirements):
    prompts = ['01', '02', '03', '04', '05']
    
    for prompt_num in prompts:
        prompt_file = f'/project/prompt_lib/prompt_{prompt_num}.md'
        
        # Read prompt
        with open(prompt_file, 'r') as f:
            prompt_content = f.read()
        
        # Execute prompt with LLM
        result = antigravity_llm.execute(
            prompt=prompt_content,
            context={
                'module': module_name,
                'requirements': requirements,
                'previous_outputs': outputs
            }
        )
        
        outputs.append(result)
    
    # Create handover
    create_handover(outputs)
```

---

### **Auto-execute Implementation Phase:**

Trong OpenCode system:
```python
def execute_implementation_phase(module_name, design_docs):
    prompts = ['06', '07', '08', '09', '10']
    
    for prompt_num in prompts:
        prompt_file = f'/project/prompt_lib/prompt_{prompt_num}.md'
        
        # Read prompt
        with open(prompt_file, 'r') as f:
            prompt_content = f.read()
        
        # Execute prompt with LLM
        result = opencode_llm.execute(
            prompt=prompt_content,
            context={
                'module': module_name,
                'design_docs': design_docs,
                'previous_outputs': outputs
            }
        )
        
        outputs.append(result)
    
    # Create handover
    create_handover(outputs)
```

---

## 📊 PROMPT MAPPING

| Prompt | Role | Phase | Use When |
|--------|------|-------|----------|
| #01 | Antigravity | Design | Create BRD |
| #02 | Antigravity | Design | Create FRD |
| #03 | Antigravity | Design | Create ERD |
| #04 | Antigravity | Design | Create UI Spec |
| #05 | Antigravity | Design | Create API Specs |
| #06 | OpenCode | Implement | Implement DB |
| #07 | OpenCode | Implement | Implement API |
| #08 | OpenCode | Implement | Implement Backend |
| #09 | OpenCode | Implement | Implement Frontend |
| #10 | OpenCode | Test | Run Integration Tests |
| #11 | Antigravity | Refactor | Analyze refactoring needs |
| #12 | OpenCode | Refactor | Execute refactoring |
| #13 | Antigravity | UAT | Create UAT plan |
| #14 | OpenCode | UAT | Execute UAT |
| #15 | Antigravity | UAT | Create UAT report |
| #16 | Antigravity | Bug | Confirm bugs |
| #17 | OpenCode | Bug | Fix bugs |
| #18 | Antigravity | Change | Analyze CR |
| #19 | OpenCode | Deploy | Deploy system |
| CR-01 | Antigravity | CR | CR Intake |
| CR-02 | Antigravity | CR | CR Impact |
| CR-03 | Antigravity | CR | Create drafts |
| CR-04 | Antigravity | CR | Review CR |
| CR-05 | Antigravity | CR | CONSOLIDATE |
| CR-06 | OpenCode | CR | Implement CR |

---

## ✅ BEST PRACTICES

### **Cho Antigravity:**
1. ✅ LUÔN đọc prompt file trước khi execute
2. ✅ Tạo documents đầy đủ theo prompt
3. ✅ Tạo handover rõ ràng cho OpenCode
4. ✅ KHÔNG viết code implementation

### **Cho OpenCode:**
1. ✅ LUÔN đọc prompt file trước khi execute
2. ✅ Đọc tất cả design docs trước khi code
3. ✅ Follow docs STRICTLY
4. ✅ KHÔNG tự quyết định thiết kế
5. ✅ Trace mọi code về documents

---

## 🎯 EXAMPLE COMPLETE WORKFLOW

```
Step 1: User request
"Tạo module Customer Loyalty Program"

Step 2: Call Antigravity
@Antigravity
Dùng prompts #01-#05 tại /project/prompt_lib/
Module: Customer Loyalty
Requirements: [list]

Step 3: Antigravity outputs
✅ BRD, FRD, ERD, API, UI specs
✅ Handover document

Step 4: Call OpenCode
@OpenCode
Dùng prompts #06-#10 tại /project/prompt_lib/
Input: Documents từ Antigravity

Step 5: OpenCode outputs
✅ DB, API, BE, FE code
✅ Tests passed
✅ Handover document

Step 6: Call Antigravity for UAT
@Antigravity
Dùng prompt #13
Input: Implementation từ OpenCode

Step 7: Call OpenCode for UAT execution
@OpenCode
Dùng prompt #14
Input: UAT plan từ Antigravity

Step 8: Deploy
@OpenCode
Dùng prompt #19
```

---

Đây mới là cách dùng đúng cho hệ thống Antigravity/OpenCode của bạn! 🚀
