# UI Specification: Master Data Management

## Document Information
- **Module**: Master Data Management
- **Version**: 1.0
- **Created**: 31/01/2026
- **Updated by**: CR-MD-001
- **Author**: Antigravity - UX Architect
- **Project**: Honda SPICE ERP System

---

## 📋 Mục Lục

1. [Screen: VehicleModel Management](#1-screen-vehiclemodel-management)
2. [Component Reuse](#2-component-reuse)

---

## 1. Screen: VehicleModel Management

**Route**: `/master/vehicle-models`  
**Added by**: CR-MD-001  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 1.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content Area                                     │
│         ├───────────────────────────────────────────────────────┤
│ Master  │ Header: Master Data / Vehicle Models         [+ New]  │
│ Data    ├───────────────────────────────────────────────────────┤
│ ├ Models│ Filters: [Search...] [Category ▼] [Status ▼]         │
│ ├ Access│ Actions: [Import Excel] [Export Excel]                │
│ ├ Servic├───────────────────────────────────────────────────────┤
│ ├ Other │ Table: Code | Name | Category | Price | Status | Act  │
│         │        MOD/001 | City RS | SEDAN | 559M₫ | ✅ | ✎ 🗑 │
│         │        MOD/002 | CR-V L | SUV | 1,029M₫ | ✅ | ✎ 🗑  │
│         ├───────────────────────────────────────────────────────┤
│         │ Pagination: < 1 2 3 > | 20 per page ▼                │
└─────────┴───────────────────────────────────────────────────────┘
```

### 1.2 Components

#### 1.2.1 Header

- **Breadcrumb**: Home > Master Data > Vehicle Models
- **Title**: "Master Data / Vehicle Models" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create VehicleModel dialog

#### 1.2.2 Filter Bar

**Search Input**:
- Placeholder: "Search by model name or code..."
- Icon: 🔍 (left side)
- Clear button: ✕ (right side, appears when text entered)
- Width: 300px
- Debounce: 300ms after last keystroke
- Behavior: Search as you type

**Category Filter**:
- Type: Multi-select dropdown
- Label: "Category"
- Options: 
  * All (default, all selected)
  * SEDAN
  * SUV
  * HATCHBACK
  * MPV
- Display: Selected count badge (e.g., "Category (2)")
- Behavior: Apply immediately on selection

**Status Filter**:
- Type: Single-select dropdown
- Label: "Status"
- Options:
  * All
  * ACTIVE (default)
  * INACTIVE
- Display: Current selection
- Behavior: Apply immediately on selection

#### 1.2.3 Action Buttons

**Import Excel**:
- Icon: 📥 Upload icon
- Text: "Import Excel"
- Style: Secondary button (gray)
- Permission: `MASTER_DATA.IMPORT`
- Action: Opens Import dialog

**Export Excel**:
- Icon: 📤 Download icon
- Text: "Export Excel"
- Style: Secondary button (gray)
- Permission: `MASTER_DATA.EXPORT`
- Action: Downloads .xlsx file immediately

#### 1.2.4 Data Table

**Columns**:

| Column | Width | Alignment | Sortable | Format |
|--------|-------|-----------|----------|--------|
| Model Code | 120px | Left | Yes | Text (MOD/001) |
| Model Name | 250px | Left | Yes | Text |
| Category | 120px | Center | Yes | Badge (colored) |
| Base Price | 150px | Right | Yes | Currency (559,000,000₫) |
| Status | 100px | Center | Yes | Badge (green/gray) |
| Actions | 80px | Center | No | Icons (✎ 🗑) |

**Column Details**:

1. **Model Code**:
   - Format: MOD/XXX
   - Font: Monospace
   - Color: Gray (#666)

2. **Model Name**:
   - Format: Plain text
   - Font: Regular
   - Truncate if > 30 chars, show tooltip on hover

3. **Category**:
   - Format: Badge
   - Colors:
     * SEDAN: Blue (#3B82F6)
     * SUV: Green (#10B981)
     * HATCHBACK: Purple (#8B5CF6)
     * MPV: Orange (#F59E0B)
   - Text: Uppercase

4. **Base Price**:
   - Format: Currency with thousand separators
   - Suffix: ₫
   - Example: 559,000,000₫
   - Alignment: Right

5. **Status**:
   - Format: Badge
   - Colors:
     * ACTIVE: Green background (#10B981), white text
     * INACTIVE: Gray background (#6B7280), white text
   - Text: Uppercase

6. **Actions**:
   - Edit icon: ✎ (pencil)
     * Permission: `MASTER_DATA.UPDATE`
     * Tooltip: "Edit"
     * Action: Opens Edit dialog
   - Delete icon: 🗑 (trash)
     * Permission: `MASTER_DATA.DELETE`
     * Tooltip: "Delete"
     * Action: Shows confirmation dialog

**Row Styling**:
- Default: White background
- Hover: Light gray background (#F3F4F6)
- Selected: Blue border (optional)
- INACTIVE rows: Slightly faded (opacity 0.7)

**Empty State**:
- Icon: 📦 Empty box
- Message: "No vehicle models found"
- Sub-message: "Click '+ New' to create your first model"
- Show when: No data or no search results

#### 1.2.5 Pagination

- **Items per page**: Dropdown
  * Options: 20 (default), 50, 100
  * Position: Bottom right
  
- **Navigation**: 
  * Buttons: < Previous | 1 2 3 ... | Next >
  * Current page: Highlighted (blue)
  * Disabled state: Gray, not clickable
  
- **Total count**: 
  * Format: "Showing 1-20 of 156 models"
  * Position: Bottom left

### 1.3 Dialogs

#### 1.3.1 Create/Edit VehicleModel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Create Vehicle Model                 [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Model Code*: [MOD/2026/004        ] (auto)   │
│              Auto-generated, cannot be edited │
│                                               │
│ Model Name*: [                            ]   │
│              Honda City RS                    │
│                                               │
│ Category*:   [SEDAN              ▼]          │
│              Select a category                │
│                                               │
│ Base Price*: [                            ]₫  │
│              559,000,000                      │
│                                               │
│ Status:      ○ Active   ○ Inactive            │
│                                               │
│                                               │
│              [Cancel]  [Save]                 │
└───────────────────────────────────────────────┘
```

**Fields**:

1. **Model Code**:
   - Type: Text input (read-only)
   - Value: Auto-generated (MOD/YYYY/XXX)
   - Style: Gray background, disabled
   - Helper text: "Auto-generated, cannot be edited"
   - Edit mode: Disabled, cannot be changed

2. **Model Name**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 100 characters
   - Placeholder: "Honda City RS"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Model name is required"
     * Too long: "Maximum 100 characters"
     * Duplicate: "Model name already exists"

3. **Category**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: SEDAN, SUV, HATCHBACK, MPV
   - Placeholder: "Select a category"
   - Default: None (must select)
   - Error message: "Please select a category"

4. **Base Price**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Format: Currency (thousand separators)
   - Suffix: ₫
   - Placeholder: "559,000,000"
   - Validation: Must be > 0
   - Error messages:
     * Empty: "Base price is required"
     * Invalid: "Price must be greater than 0"

5. **Status**:
   - Type: Radio buttons
   - Options: Active, Inactive
   - Default: Active
   - Layout: Horizontal

**Buttons**:
- **Cancel**: 
  * Style: Secondary (gray)
  * Action: Close dialog without saving
  * Shortcut: Esc key
  
- **Save**:
  * Style: Primary (blue)
  * Action: Validate and save
  * Disabled: If validation fails
  * Shortcut: Ctrl+Enter

**Validation Behavior**:
- Real-time: On blur (when field loses focus)
- On submit: Validate all fields before saving
- Error display: Red text below field
- Success: Green checkmark icon (optional)

#### 1.3.2 Import Excel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Import Vehicle Models                [X Close]│
├───────────────────────────────────────────────┤
│ Step 1: Download Template                    │
│ [Download Template] vehicle_model_template.xlsx│
│                                               │
│ Step 2: Upload File                          │
│ [Choose File] No file selected               │
│ Supported: .xlsx, Max 10MB                   │
│                                               │
│ [Upload]                                      │
├───────────────────────────────────────────────┤
│ Preview (after upload):                       │
│ ✅ Row 1: Honda City RS - Valid              │
│ ✅ Row 2: Honda CR-V L - Valid               │
│ ❌ Row 3: Invalid - Price must be > 0        │
│                                               │
│ Summary: 2 valid, 1 invalid                  │
│                                               │
│ [Cancel] [Import Valid Rows]                 │
└───────────────────────────────────────────────┘
```

**Steps**:

1. **Download Template**:
   - Button: "Download Template"
   - File: `vehicle_model_template.xlsx`
   - Columns: Model Code (optional), Model Name*, Category*, Base Price*

2. **Upload File**:
   - Input: File picker
   - Validation: .xlsx only, max 10MB
   - Button: "Upload" (triggers validation)

3. **Preview**:
   - Display: List of rows with validation status
   - Valid rows: Green checkmark ✅
   - Invalid rows: Red X ❌ with error message
   - Summary: "X valid, Y invalid"

4. **Import**:
   - Button: "Import Valid Rows"
   - Disabled: If no valid rows
   - Action: Import only valid rows
   - Result: Success message + error report download

#### 1.3.3 Delete Confirmation Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Deactivate Vehicle Model?                    │
├───────────────────────────────────────────────┤
│ ⚠️  This will set the model status to        │
│     INACTIVE. The model will no longer appear │
│     in dropdowns but historical data will be  │
│     preserved.                                │
│                                               │
│ Model: Honda City RS                         │
│                                               │
│              [Cancel]  [Deactivate]           │
└───────────────────────────────────────────────┘
```

**Elements**:
- Icon: ⚠️ Warning icon (yellow)
- Message: Clear explanation of soft delete
- Model name: Display for confirmation
- Buttons:
  * Cancel: Secondary (gray)
  * Deactivate: Danger (red)

### 1.4 UI Behavior

#### 1.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `model_name` OR `model_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 1.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Category (SEDAN, SUV) AND Status (ACTIVE)

#### 1.4.3 Validation Messages

**Model Name**:
- Required: "Model name is required"
- Too long: "Model name must not exceed 100 characters"
- Duplicate: "Model name already exists. Please use a different name."

**Category**:
- Required: "Category is required"
- Invalid: "Please select a valid category"

**Base Price**:
- Required: "Base price is required"
- Invalid: "Price must be greater than 0"
- Format: "Please enter a valid number"

### 1.5 Responsive Design

**Desktop (>1024px)**:
- Full table layout
- All columns visible
- Sidebar expanded

**Tablet (768-1024px)**:
- Table with horizontal scroll
- Sidebar collapsible
- Filters in dropdown

**Mobile (<768px)**:
- Card layout instead of table
- Filters in bottom sheet
- Sidebar hidden (hamburger menu)

### 1.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 2. Component Reuse

### 2.1 Existing Components to Reuse

**From existing codebase**:

1. **Table Component**:
   - Reference: `PartsStockTake.tsx`
   - Features: Sorting, pagination, row actions
   - Customization: Add category/status badges

2. **Form Dialog**:
   - Reference: `QuotationForm.tsx`
   - Features: Validation, error messages, submit handling
   - Customization: Adapt fields for VehicleModel

3. **File Upload**:
   - Reference: `PickingPacking.tsx`
   - Features: File picker, validation, preview
   - Customization: Excel-specific validation

4. **Search Input**:
   - Reference: Common component
   - Features: Debounce, clear button
   - Customization: None needed

5. **Dropdown Filter**:
   - Reference: Common component
   - Features: Multi-select, single-select
   - Customization: None needed

### 2.2 New Components to Create

1. **VehicleModelManagement.tsx** (Main page):
   - Combines: Table + Search + Filters + Actions
   - Route: `/master/vehicle-models`
   - Layout: Full page with sidebar

2. **VehicleModelForm.tsx** (Create/Edit dialog):
   - Form fields: model_code, model_name, category, base_price, status
   - Validation: Real-time and on submit
   - Modes: Create, Edit

3. **VehicleModelImport.tsx** (Import dialog):
   - Steps: Download template, Upload file, Preview, Import
   - Validation: Excel parsing, row validation
   - Result: Success message + error report

4. **VehicleModelTable.tsx** (Table component):
   - Columns: Code, Name, Category, Price, Status, Actions
   - Features: Sorting, pagination, row actions
   - Styling: Badges, currency format

---

## Change Log

### v1.0 (31/01/2026) - CR-MD-001
- Initial UI Spec for Master Data Management
- Added Screen: VehicleModel Management (main page)
- Added Dialogs: Create/Edit, Import, Delete Confirmation
- Added UI Behavior specifications (search, filter, validation)
- Added Responsive Design guidelines
- Added Accessibility requirements
- Added Component Reuse plan (existing + new components)

---

**End of Document**
