# UI Specification: Master Data Management

## Document Information
- **Module**: Master Data Management
- **Version**: 1.1
- **Created**: 31/01/2026
- **Updated**: 31/01/2026
- **Updated by**: CR-MD-002/003/004
- **Author**: Antigravity - UX Architect
- **Project**: Honda SPICE ERP System

---

## 📋 Mục Lục

1. [Refs Analysis](#1-refs-analysis)
2. [Screen: VehicleModel Management](#2-screen-vehiclemodel-management)
3. [Screen: Accessory Management](#3-screen-accessory-management)
4. [Screen: ServiceCatalog Management](#4-screen-servicecatalog-management)
5. [Screen: ServiceBay Management](#5-screen-servicebay-management)
6. [Screen: ScoringRule Management](#6-screen-scoringrule-management)
7. [Screen: SystemSetting Management](#7-screen-systemsetting-management)
8. [Menu Navigation](#8-menu-navigation)
9. [Component Reuse](#9-component-reuse)

---

## 1. Refs Analysis

### 1.1 Business Requirements
- **BR-MD-002**: Accessory Master Data Management - Manage accessories, compatibility, pricing
- **BR-MD-003**: ServiceCatalog Master Data Management - Manage services, packages, pricing
- **BR-MD-004**: Other Masters Data Management - Manage service bays, scoring rules, system settings

### 1.2 Functional Requirements
- **FR-MD-002**: Accessory Management (9 FRs) - CRUD, search, filter, compatibility matrix, price history
- **FR-MD-003**: ServiceCatalog Management (10 FRs) - CRUD, search, filter, service packages
- **FR-MD-004**: Other Masters (9 FRs) - ServiceBay, ScoringRule, SystemSetting management

### 1.3 Database Schema
- **Accessory**: 8 fields + compatibility matrix + price history
- **ServiceCatalog**: 7 fields + service packages + package items
- **ServiceBay**: 6 fields + capacity management
- **ScoringRule**: 6 fields + condition evaluation
- **SystemSetting**: 5 fields + configuration management

### 1.4 UI Patterns
- **Consistent Layout**: All screens follow same pattern as VehicleModel Management
- **Common Components**: Table, Search, Filters, Form Dialog, Import/Export
- **Permission-based Access**: Consistent permission checks across all screens
- **Responsive Design**: Mobile-friendly with card/table layouts

---

## 2. Screen: VehicleModel Management

**Route**: `/master/vehicle-models`  
**Added by**: CR-MD-001  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 2.1 Layout Structure

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

### 2.2 Components

#### 2.2.1 Header

- **Breadcrumb**: Home > Master Data > Vehicle Models
- **Title**: "Master Data / Vehicle Models" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create VehicleModel dialog

#### 2.2.2 Filter Bar

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

#### 2.2.3 Action Buttons

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

#### 2.2.4 Data Table

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

#### 2.2.5 Pagination

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

### 2.3 Dialogs

#### 2.3.1 Create/Edit VehicleModel Dialog

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

#### 2.3.2 Import Excel Dialog

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

#### 2.3.3 Delete Confirmation Dialog

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

### 2.4 UI Behavior

#### 2.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `model_name` OR `model_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 2.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Category (SEDAN, SUV) AND Status (ACTIVE)

#### 2.4.3 Validation Messages

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

### 2.5 Responsive Design

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

### 2.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 3. Screen: Accessory Management

**Route**: `/master/accessories`  
**Added by**: CR-MD-002  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 3.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content Area                                     │
│         ├───────────────────────────────────────────────────────┤
│ Master  │ Header: Master Data / Accessories          [+ New]  │
│ Data    ├───────────────────────────────────────────────────────┤
│ ├ Models│ Filters: [Search...] [Category ▼] [Status ▼]         │
│ ├ Access│ Actions: [Import Excel] [Export Excel] [Compatibility]│
│ ├ Servic├───────────────────────────────────────────────────────┤
│ ├ Other │ Table: Code | Name | Category | Price | Warranty | Act │
│         │        ACC/001 | Floor Mat | INTERIOR | 500K₫ | 12m | ✅ | ✎ 🗑 │
│         │        ACC/002 | Body Kit | EXTERIOR | 2M₫ | 24m | ✅ | ✎ 🗑 │
│         ├───────────────────────────────────────────────────────┤
│         │ Pagination: < 1 2 3 > | 20 per page ▼                │
└─────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Components

#### 3.2.1 Header

- **Breadcrumb**: Home > Master Data > Accessories
- **Title**: "Master Data / Accessories" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create Accessory dialog

#### 3.2.2 Filter Bar

**Search Input**:
- Placeholder: "Search by accessory name or code..."
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
  * INTERIOR
  * EXTERIOR
  * TECH
  * SAFETY
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

#### 3.2.3 Action Buttons

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

**Compatibility Matrix**:
- Icon: 🔄 Sync icon
- Text: "Compatibility"
- Style: Secondary button (gray)
- Permission: `MASTER_DATA.READ`
- Action: Opens Compatibility Matrix dialog

#### 3.2.4 Data Table

**Columns**:

| Column | Width | Alignment | Sortable | Format |
|--------|-------|-----------|----------|--------|
| Accessory Code | 120px | Left | Yes | Text (ACC/001) |
| Accessory Name | 200px | Left | Yes | Text |
| Category | 120px | Center | Yes | Badge (colored) |
| Price | 120px | Right | Yes | Currency (500,000₫) |
| Warranty | 80px | Center | No | Text (12m) |
| Installation | 100px | Center | No | Badge (Yes/No) |
| Status | 100px | Center | Yes | Badge (green/gray) |
| Actions | 80px | Center | No | Icons (✎ 🗑) |

**Column Details**:

1. **Accessory Code**:
   - Format: ACC/XXX
   - Font: Monospace
   - Color: Gray (#666)

2. **Accessory Name**:
   - Format: Plain text
   - Font: Regular
   - Truncate if > 25 chars, show tooltip on hover

3. **Category**:
   - Format: Badge
   - Colors:
     * INTERIOR: Blue (#3B82F6)
     * EXTERIOR: Green (#10B981)
     * TECH: Purple (#8B5CF6)
     * SAFETY: Orange (#F59E0B)
   - Text: Uppercase

4. **Price**:
   - Format: Currency with thousand separators (K for thousands)
   - Suffix: ₫
   - Example: 500K₫
   - Alignment: Right

5. **Warranty**:
   - Format: Period in months
   - Suffix: "m"
   - Example: 12m
   - Alignment: Center

6. **Installation**:
   - Format: Badge
   - Colors:
     * Yes: Green (#10B981)
     * No: Gray (#6B7280)
   - Text: "Yes"/"No"

7. **Status**:
   - Format: Badge
   - Colors:
     * ACTIVE: Green background (#10B981), white text
     * INACTIVE: Gray background (#6B7280), white text
   - Text: Uppercase

8. **Actions**:
   - Edit icon: ✎ (pencil)
     * Permission: `MASTER_DATA.UPDATE`
     * Tooltip: "Edit"
     * Action: Opens Edit dialog
   - Delete icon: 🗑 (trash)
     * Permission: `MASTER_DATA.DELETE`
     * Tooltip: "Delete"
     * Action: Shows confirmation dialog
   - Price History icon: 📊
     * Permission: `MASTER_DATA.READ`
     * Tooltip: "Price History"
     * Action: Opens Price History dialog

**Row Styling**:
- Default: White background
- Hover: Light gray background (#F3F4F6)
- Selected: Blue border (optional)
- INACTIVE rows: Slightly faded (opacity 0.7)

**Empty State**:
- Icon: 📦 Empty box
- Message: "No accessories found"
- Sub-message: "Click '+ New' to create your first accessory"
- Show when: No data or no search results

#### 3.2.5 Pagination

- **Items per page**: Dropdown
  * Options: 20 (default), 50, 100
  * Position: Bottom right
  
- **Navigation**: 
  * Buttons: < Previous | 1 2 3 ... | Next >
  * Current page: Highlighted (blue)
  * Disabled state: Gray, not clickable
  
- **Total count**: 
  * Format: "Showing 1-20 of 45 accessories"
  * Position: Bottom left

### 3.3 Dialogs

#### 3.3.1 Create/Edit Accessory Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Create Accessory                     [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Accessory Code*: [ACC/2026/004      ] (auto)  │
│                 Auto-generated, cannot be edited│
│                                               │
│ Accessory Name*: [                         ]   │
│                 Floor Mat Premium                │
│                                               │
│ Category*:      [INTERIOR           ▼]       │
│                 Select a category               │
│                                               │
│ Price*:         [                  ]₫         │
│                 500,000                         │
│                                               │
│ Installation:    ○ Yes   ○ No (default)         │
│                                               │
│ Warranty*:      [12                ] months   │
│                 6-60 months                    │
│                                               │
│ Status:         ○ Active (default) ○ Inactive  │
│                                               │
│ Compatible Models: [+ Add Model]              │
│                 ✅ City RS ✅ CR-V L            │
│                 ❌ Remove                       │
│                                               │
│                 [Cancel]  [Save]               │
└───────────────────────────────────────────────┘
```

**Fields**:

1. **Accessory Code**:
   - Type: Text input (read-only)
   - Value: Auto-generated (ACC/YYYY/XXX)
   - Style: Gray background, disabled
   - Helper text: "Auto-generated, cannot be edited"
   - Edit mode: Disabled, cannot be changed

2. **Accessory Name**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 100 characters
   - Placeholder: "Floor Mat Premium"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Accessory name is required"
     * Too long: "Maximum 100 characters"
     * Duplicate: "Accessory name already exists"

3. **Category**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: INTERIOR, EXTERIOR, TECH, SAFETY
   - Placeholder: "Select a category"
   - Default: None (must select)
   - Error message: "Please select a category"

4. **Price**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Format: Currency (thousand separators)
   - Suffix: ₫
   - Placeholder: "500,000"
   - Validation: Must be > 0
   - Error messages:
     * Empty: "Price is required"
     * Invalid: "Price must be greater than 0"

5. **Installation**:
   - Type: Radio buttons
   - Options: Yes, No
   - Default: No
   - Layout: Horizontal

6. **Warranty**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Suffix: "months"
   - Min: 6, Max: 60
   - Placeholder: "12"
   - Validation: Must be between 6-60
   - Error messages:
     * Empty: "Warranty period is required"
     * Invalid: "Warranty must be between 6-60 months"

7. **Status**:
   - Type: Radio buttons
   - Options: Active, Inactive
   - Default: Active
   - Layout: Horizontal

8. **Compatible Models**:
   - Type: Multi-select with search
   - Options: All active VehicleModels
   - Display: Selected models with badges
   - Action: "+ Add Model" opens model selection dialog
   - Remove: ❌ icon next to each selected model

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

#### 3.3.2 Import Excel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Import Accessories                   [X Close]│
├───────────────────────────────────────────────┤
│ Step 1: Download Template                    │
│ [Download Template] accessory_template.xlsx   │
│                                               │
│ Step 2: Upload File                          │
│ [Choose File] No file selected               │
│ Supported: .xlsx, Max 10MB                   │
│                                               │
│ [Upload]                                      │
├───────────────────────────────────────────────┤
│ Preview (after upload):                       │
│ ✅ Row 1: Floor Mat - Valid                  │
│ ✅ Row 2: Body Kit - Valid                   │
│ ❌ Row 3: Invalid - Warranty must be 6-60m   │
│                                               │
│ Summary: 2 valid, 1 invalid                  │
│                                               │
│ [Cancel] [Import Valid Rows]                 │
└───────────────────────────────────────────────┘
```

**Steps**:

1. **Download Template**:
   - Button: "Download Template"
   - File: `accessory_template.xlsx`
   - Columns: Accessory Code (optional), Accessory Name*, Category*, Price*, Installation, Warranty*, Status

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

#### 3.3.3 Compatibility Matrix Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Compatibility Matrix                [X Close] │
├───────────────────────────────────────────────┤
│ Accessory: Floor Mat Premium (ACC/001)        │
│                                               │
│ Compatible Vehicle Models:                    │
│                                               │
│ ┌─────────┬─────────────┬───────────┐         │
│ │ Model   │ Compatible  │ Action    │         │
│ ├─────────┼─────────────┼───────────┤         │
│ │ City RS │ ✅ Yes      │ ❌ Remove │         │
│ │ CR-V L  │ ✅ Yes      │ ❌ Remove │         │
│ │ Civic   │ ❌ No       │ ➕ Add     │         │
│ └─────────┴─────────────┴───────────┘         │
│                                               │
│ [+ Add Model] [Close]                         │
└───────────────────────────────────────────────┘
```

**Elements**:
- **Accessory Info**: Shows current accessory name and code
- **Model List**: All vehicle models with compatibility status
- **Status Icons**:
  * ✅ Yes: Currently compatible
  * ❌ No: Not compatible
- **Actions**:
  * ❌ Remove: Remove compatibility (only if currently compatible)
  * ➕ Add: Add compatibility (only if not compatible)
- **Add Model Button**: Opens model selection dialog

#### 3.3.4 Price History Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Price History - Floor Mat Premium  [X Close] │
├───────────────────────────────────────────────┤
│                                               │
│ Current Price: 500,000₫ (since 01/01/2026)    │
│                                               │
│ Price Changes:                                │
│                                               │
│ ┌─────────────┬────────────┬──────────────┐   │
│ │ Date        │ Old Price  │ New Price    │   │
│ ├─────────────┼────────────┼──────────────┤   │
│ │ 15/01/2026  │ 450,000₫   │ 500,000₫     │   │
│ │ 01/01/2026  │ -          │ 450,000₫     │   │
│ └─────────────┴────────────┴──────────────┘   │
│                                               │
│ [Export to Excel] [Close]                     │
└───────────────────────────────────────────────┘
```

**Elements**:
- **Current Price**: Shows current price and effective date
- **History Table**: All price changes with dates
- **Export Button**: Download price history as Excel
- **Close Button**: Close dialog

#### 3.3.5 Delete Confirmation Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Deactivate Accessory?                        │
├───────────────────────────────────────────────┤
│ ⚠️  This will set the accessory status to    │
│     INACTIVE. The accessory will no longer   │
│     be available for selection but historical │
│     data will be preserved.                  │
│                                               │
│ Accessory: Floor Mat Premium                  │
│                                               │
│              [Cancel]  [Deactivate]           │
└───────────────────────────────────────────────┘
```

**Elements**:
- Icon: ⚠️ Warning icon (yellow)
- Message: Clear explanation of soft delete
- Accessory name: Display for confirmation
- Buttons:
  * Cancel: Secondary (gray)
  * Deactivate: Danger (red)

### 3.4 UI Behavior

#### 3.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `accessory_name` OR `accessory_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 3.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Category (INTERIOR, EXTERIOR) AND Status (ACTIVE)

#### 3.4.3 Validation Messages

**Accessory Name**:
- Required: "Accessory name is required"
- Too long: "Accessory name must not exceed 100 characters"
- Duplicate: "Accessory name already exists. Please use a different name."

**Category**:
- Required: "Category is required"
- Invalid: "Please select a valid category"

**Price**:
- Required: "Price is required"
- Invalid: "Price must be greater than 0"
- Format: "Please enter a valid number"

**Warranty**:
- Required: "Warranty period is required"
- Invalid: "Warranty must be between 6-60 months"

### 3.5 Responsive Design

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

### 3.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 4. Screen: ServiceCatalog Management

**Route**: `/master/service-catalogs`  
**Added by**: CR-MD-003  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 4.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content Area                                     │
│         ├───────────────────────────────────────────────────────┤
│ Master  │ Header: Master Data / Service Catalogs     [+ New]  │
│ Data    ├───────────────────────────────────────────────────────┤
│ ├ Models│ Filters: [Search...] [Category ▼] [Status ▼]         │
│ ├ Access│ Actions: [Import Excel] [Export Excel] [Packages]   │
│ ├ Servic├───────────────────────────────────────────────────────┤
│ ├ Other │ Table: Code | Name | Category | Duration | Price | Act│
│         │        SVC/001 | Oil Change | MAINTENANCE | 1h | 500K₫ | ✅ | ✎ 🗑 │
│         │        SVC/002 | Tire Rotation | MAINTENANCE | 0.5h | 200K₫ | ✅ | ✎ 🗑 │
│         ├───────────────────────────────────────────────────────┤
│         │ Pagination: < 1 2 3 > | 20 per page ▼                │
└─────────┴───────────────────────────────────────────────────────┘
```

### 4.2 Components

#### 4.2.1 Header

- **Breadcrumb**: Home > Master Data > Service Catalogs
- **Title**: "Master Data / Service Catalogs" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create ServiceCatalog dialog

#### 4.2.2 Filter Bar

**Search Input**:
- Placeholder: "Search by service name or code..."
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
  * MAINTENANCE
  * REPAIR
  * INSPECTION
  * DETAILING
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

#### 4.2.3 Action Buttons

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

**Service Packages**:
- Icon: 📦 Box icon
- Text: "Packages"
- Style: Secondary button (gray)
- Permission: `MASTER_DATA.READ`
- Action: Opens Service Packages dialog

#### 4.2.4 Data Table

**Columns**:

| Column | Width | Alignment | Sortable | Format |
|--------|-------|-----------|----------|--------|
| Service Code | 120px | Left | Yes | Text (SVC/001) |
| Service Name | 200px | Left | Yes | Text |
| Category | 120px | Center | Yes | Badge (colored) |
| Duration | 80px | Center | Yes | Text (1h) |
| Base Price | 120px | Right | Yes | Currency (500,000₫) |
| Required Parts | 100px | Center | No | Badge (Yes/No) |
| Status | 100px | Center | Yes | Badge (green/gray) |
| Actions | 80px | Center | No | Icons (✎ 🗑) |

**Column Details**:

1. **Service Code**:
   - Format: SVC/XXX
   - Font: Monospace
   - Color: Gray (#666)

2. **Service Name**:
   - Format: Plain text
   - Font: Regular
   - Truncate if > 25 chars, show tooltip on hover

3. **Category**:
   - Format: Badge
   - Colors:
     * MAINTENANCE: Blue (#3B82F6)
     * REPAIR: Green (#10B981)
     * INSPECTION: Purple (#8B5CF6)
     * DETAILING: Orange (#F59E0B)
   - Text: Uppercase

4. **Duration**:
   - Format: Hours with decimal
   - Suffix: "h"
   - Example: 1h, 0.5h
   - Alignment: Center

5. **Base Price**:
   - Format: Currency with thousand separators (K for thousands)
   - Suffix: ₫
   - Example: 500K₫
   - Alignment: Right

6. **Required Parts**:
   - Format: Badge
   - Colors:
     * Yes: Green (#10B981)
     * No: Gray (#6B7280)
   - Text: "Yes"/"No"

7. **Status**:
   - Format: Badge
   - Colors:
     * ACTIVE: Green background (#10B981), white text
     * INACTIVE: Gray background (#6B7280), white text
   - Text: Uppercase

8. **Actions**:
   - Edit icon: ✎ (pencil)
     * Permission: `MASTER_DATA.UPDATE`
     * Tooltip: "Edit"
     * Action: Opens Edit dialog
   - Delete icon: 🗑 (trash)
     * Permission: `MASTER_DATA.DELETE`
     * Tooltip: "Delete"
     * Action: Shows confirmation dialog
   - Service Parts icon: 🔧
     * Permission: `MASTER_DATA.READ`
     * Tooltip: "Service Parts"
     * Action: Opens Service Parts dialog

**Row Styling**:
- Default: White background
- Hover: Light gray background (#F3F4F6)
- Selected: Blue border (optional)
- INACTIVE rows: Slightly faded (opacity 0.7)

**Empty State**:
- Icon: 🔧 Wrench icon
- Message: "No service catalogs found"
- Sub-message: "Click '+ New' to create your first service"
- Show when: No data or no search results

#### 4.2.5 Pagination

- **Items per page**: Dropdown
  * Options: 20 (default), 50, 100
  * Position: Bottom right
  
- **Navigation**: 
  * Buttons: < Previous | 1 2 3 ... | Next >
  * Current page: Highlighted (blue)
  * Disabled state: Gray, not clickable
  
- **Total count**: 
  * Format: "Showing 1-20 of 32 services"
  * Position: Bottom left

### 4.3 Dialogs

#### 4.3.1 Create/Edit ServiceCatalog Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Create Service                       [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Service Code*: [SVC/2026/004       ] (auto)  │
│                Auto-generated, cannot be edited│
│                                               │
│ Service Name*: [                         ]    │
│                Oil Change Premium              │
│                                               │
│ Category*:      [MAINTENANCE        ▼]       │
│                Select a category               │
│                                               │
│ Duration*:      [1.5               ] hours   │
│                0.5-8 hours                    │
│                                               │
│ Base Price*:    [                  ]₫         │
│                500,000                         │
│                                               │
│ Required Parts:○ Yes   ○ No (default)         │
│                                               │
│ Compatible Models: [+ Add Model]              │
│                ✅ City RS ✅ CR-V L            │
│                ❌ Remove                       │
│                                               │
│ Status:         ○ Active (default) ○ Inactive │
│                                               │
│ Service Parts:  [+ Add Part]                  │
│                Engine Oil 5W-30 (1L)           │
│                Oil Filter (1 pc)               │
│                ❌ Remove                       │
│                                               │
│                [Cancel]  [Save]               │
└───────────────────────────────────────────────┘
```

**Fields**:

1. **Service Code**:
   - Type: Text input (read-only)
   - Value: Auto-generated (SVC/YYYY/XXX)
   - Style: Gray background, disabled
   - Helper text: "Auto-generated, cannot be edited"
   - Edit mode: Disabled, cannot be changed

2. **Service Name**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 100 characters
   - Placeholder: "Oil Change Premium"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Service name is required"
     * Too long: "Maximum 100 characters"
     * Duplicate: "Service name already exists"

3. **Category**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: MAINTENANCE, REPAIR, INSPECTION, DETAILING
   - Placeholder: "Select a category"
   - Default: None (must select)
   - Error message: "Please select a category"

4. **Duration**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Suffix: "hours"
   - Min: 0.5, Max: 8, Step: 0.5
   - Placeholder: "1.5"
   - Validation: Must be between 0.5-8
   - Error messages:
     * Empty: "Duration is required"
     * Invalid: "Duration must be between 0.5-8 hours"

5. **Base Price**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Format: Currency (thousand separators)
   - Suffix: ₫
   - Placeholder: "500,000"
   - Validation: Must be > 0
   - Error messages:
     * Empty: "Base price is required"
     * Invalid: "Price must be greater than 0"

6. **Required Parts**:
   - Type: Radio buttons
   - Options: Yes, No
   - Default: No
   - Layout: Horizontal

7. **Compatible Models**:
   - Type: Multi-select with search
   - Options: All active VehicleModels
   - Display: Selected models with badges
   - Action: "+ Add Model" opens model selection dialog
   - Remove: ❌ icon next to each selected model

8. **Status**:
   - Type: Radio buttons
   - Options: Active, Inactive
   - Default: Active
   - Layout: Horizontal

9. **Service Parts**:
   - Type: Multi-select with search
   - Options: All active Accessories
   - Display: Selected parts with quantity
   - Action: "+ Add Part" opens part selection dialog
   - Remove: ❌ icon next to each selected part

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

#### 4.3.2 Import Excel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Import Services                     [X Close]│
├───────────────────────────────────────────────┤
│ Step 1: Download Template                    │
│ [Download Template] service_template.xlsx     │
│                                               │
│ Step 2: Upload File                          │
│ [Choose File] No file selected               │
│ Supported: .xlsx, Max 10MB                   │
│                                               │
│ [Upload]                                      │
├───────────────────────────────────────────────┤
│ Preview (after upload):                       │
│ ✅ Row 1: Oil Change - Valid                 │
│ ✅ Row 2: Tire Rotation - Valid              │
│ ❌ Row 3: Invalid - Duration must be 0.5-8h   │
│                                               │
│ Summary: 2 valid, 1 invalid                  │
│                                               │
│ [Cancel] [Import Valid Rows]                 │
└───────────────────────────────────────────────┘
```

**Steps**:

1. **Download Template**:
   - Button: "Download Template"
   - File: `service_template.xlsx`
   - Columns: Service Code (optional), Service Name*, Category*, Duration*, Base Price*, Required Parts, Status

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

#### 4.3.3 Service Packages Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Service Packages                    [X Close] │
├───────────────────────────────────────────────┤
│                                               │
│ Service Packages:                             │
│                                               │
│ ┌────────────────┬─────────────┬─────────────┐ │
│ │ Package Name   │ Services    │ Price       │ │
│ ├────────────────┼─────────────┼─────────────┤ │
│ │ Basic Package  │ Oil Change  │ 1,200,000₫  │ │
│ │                │ Tire Rot    │             │ │
│ ├────────────────┼─────────────┼─────────────┤ │
│ │ Premium Pkg    │ Oil Change  │ 2,500,000₫  │ │
│ │                │ Full Service│             │ │
│ │                │ Car Wash    │             │ │
│ └────────────────┴─────────────┴─────────────┘ │
│                                               │
│ [+ New Package] [Edit] [Delete] [Close]       │
└───────────────────────────────────────────────┘
```

**Elements**:
- **Package List**: All service packages with included services and prices
- **Package Details**: Shows package name, included services, and total price
- **Action Buttons**:
  * + New Package: Opens create package dialog
  * Edit: Opens edit package dialog
  * Delete: Shows delete confirmation
  * Close: Close dialog

#### 4.3.4 Service Parts Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Service Parts - Oil Change        [X Close]   │
├───────────────────────────────────────────────┤
│                                               │
│ Required Parts:                               │
│                                               │
│ ┌─────────────────┬────────────┬─────────────┐ │
│ │ Part Name       │ Quantity   │ Price       │ │
│ ├─────────────────┼────────────┼─────────────┤ │
│ │ Engine Oil 5W-30│ 1L         │ 150,000₫    │ │
│ │ Oil Filter      │ 1 pc       │ 80,000₫     │ │
│ └─────────────────┴────────────┴─────────────┘ │
│                                               │
│ Total Parts Cost: 230,000₫                    │
│                                               │
│ [+ Add Part] [Export] [Close]                 │
└───────────────────────────────────────────────┘
```

**Elements**:
- **Service Info**: Shows service name
- **Parts List**: All required parts with quantities and prices
- **Total Cost**: Sum of all part costs
- **Action Buttons**:
  * + Add Part: Opens part selection dialog
  * Export: Download parts list as Excel
  * Close: Close dialog

#### 4.3.5 Delete Confirmation Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Deactivate Service?                          │
├───────────────────────────────────────────────┤
│ ⚠️  This will set the service status to      │
│     INACTIVE. The service will no longer     │
│     be available for selection but historical │
│     data will be preserved.                  │
│                                               │
│ Service: Oil Change Premium                   │
│                                               │
│              [Cancel]  [Deactivate]           │
└───────────────────────────────────────────────┘
```

**Elements**:
- Icon: ⚠️ Warning icon (yellow)
- Message: Clear explanation of soft delete
- Service name: Display for confirmation
- Buttons:
  * Cancel: Secondary (gray)
  * Deactivate: Danger (red)

### 4.4 UI Behavior

#### 4.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `service_name` OR `service_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 4.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Category (MAINTENANCE, REPAIR) AND Status (ACTIVE)

#### 4.4.3 Validation Messages

**Service Name**:
- Required: "Service name is required"
- Too long: "Service name must not exceed 100 characters"
- Duplicate: "Service name already exists. Please use a different name."

**Category**:
- Required: "Category is required"
- Invalid: "Please select a valid category"

**Duration**:
- Required: "Duration is required"
- Invalid: "Duration must be between 0.5-8 hours"

**Base Price**:
- Required: "Base price is required"
- Invalid: "Price must be greater than 0"
- Format: "Please enter a valid number"

### 4.5 Responsive Design

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

### 4.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 5. Screen: ServiceBay Management

**Route**: `/master/service-bays`  
**Added by**: CR-MD-004  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 5.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content Area                                     │
│         ├───────────────────────────────────────────────────────┤
│ Master  │ Header: Master Data / Service Bays        [+ New]  │
│ Data    ├───────────────────────────────────────────────────────┤
│ ├ Models│ Filters: [Search...] [Type ▼] [Status ▼]             │
│ ├ Access│ Actions: [Import Excel] [Export Excel]              │
│ ├ Servic├───────────────────────────────────────────────────────┤
│ ├ Other │ Table: Code | Name | Type | Capacity | Current | Act │
│         │        BAY/001 | Bay A | STANDARD | 2 | 1/2 | ✅ | ✎ 🗑 │
│         │        BAY/002 | Bay B | PREMIUM | 1 | 0/1 | ✅ | ✎ 🗑 │
│         ├───────────────────────────────────────────────────────┤
│         │ Pagination: < 1 2 3 > | 20 per page ▼                │
└─────────┴───────────────────────────────────────────────────────┘
```

### 5.2 Components

#### 5.2.1 Header

- **Breadcrumb**: Home > Master Data > Service Bays
- **Title**: "Master Data / Service Bays" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create ServiceBay dialog

#### 5.2.2 Filter Bar

**Search Input**:
- Placeholder: "Search by bay name or code..."
- Icon: 🔍 (left side)
- Clear button: ✕ (right side, appears when text entered)
- Width: 300px
- Debounce: 300ms after last keystroke
- Behavior: Search as you type

**Type Filter**:
- Type: Multi-select dropdown
- Label: "Type"
- Options: 
  * All (default, all selected)
  * STANDARD
  * PREMIUM
  * EXPRESS
- Display: Selected count badge (e.g., "Type (2)")
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

#### 5.2.3 Action Buttons

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

#### 5.2.4 Data Table

**Columns**:

| Column | Width | Alignment | Sortable | Format |
|--------|-------|-----------|----------|--------|
| Bay Code | 120px | Left | Yes | Text (BAY/001) |
| Bay Name | 150px | Left | Yes | Text |
| Type | 120px | Center | Yes | Badge (colored) |
| Capacity | 100px | Center | Yes | Number |
| Current Usage | 120px | Center | No | Progress |
| Status | 100px | Center | Yes | Badge (green/gray) |
| Actions | 80px | Center | No | Icons (✎ 🗑) |

**Column Details**:

1. **Bay Code**:
   - Format: BAY/XXX
   - Font: Monospace
   - Color: Gray (#666)

2. **Bay Name**:
   - Format: Plain text
   - Font: Regular
   - Truncate if > 20 chars, show tooltip on hover

3. **Type**:
   - Format: Badge
   - Colors:
     * STANDARD: Blue (#3B82F6)
     * PREMIUM: Purple (#8B5CF6)
     * EXPRESS: Orange (#F59E0B)
   - Text: Uppercase

4. **Capacity**:
   - Format: Number (vehicle count)
   - Alignment: Center
   - Example: 2

5. **Current Usage**:
   - Format: Progress bar + text
   - Text: "X/Y" (current/total)
   - Progress bar: Visual representation of usage
   - Colors:
     * Low (<50%): Green (#10B981)
     * Medium (50-80%): Yellow (#F59E0B)
     * High (>80%): Red (#EF4444)
   - Alignment: Center

6. **Status**:
   - Format: Badge
   - Colors:
     * ACTIVE: Green background (#10B981), white text
     * INACTIVE: Gray background (#6B7280), white text
   - Text: Uppercase

7. **Actions**:
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
- Icon: 🏭 Factory icon
- Message: "No service bays found"
- Sub-message: "Click '+ New' to create your first service bay"
- Show when: No data or no search results

#### 5.2.5 Pagination

- **Items per page**: Dropdown
  * Options: 20 (default), 50, 100
  * Position: Bottom right
  
- **Navigation**: 
  * Buttons: < Previous | 1 2 3 ... | Next >
  * Current page: Highlighted (blue)
  * Disabled state: Gray, not clickable
  
- **Total count**: 
  * Format: "Showing 1-20 of 15 service bays"
  * Position: Bottom left

### 5.3 Dialogs

#### 5.3.1 Create/Edit ServiceBay Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Create Service Bay                  [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Bay Code*:    [BAY/2026/004       ] (auto)   │
│               Auto-generated, cannot be edited │
│                                               │
│ Bay Name*:    [                         ]     │
│               Bay A                           │
│                                               │
│ Type*:        [STANDARD            ▼]        │
│               Select bay type                 │
│                                               │
│ Capacity*:    [1                  ] vehicles │
│               1-5 vehicles                   │
│                                               │
│ Location*:    [                         ]     │
│               Building A, Floor 1            │
│                                               │
│ Description:  [                         ]     │
│               Standard service bay with...    │
│                                               │
│ Status:       ○ Active (default) ○ Inactive   │
│                                               │
│               [Cancel]  [Save]               │
└───────────────────────────────────────────────┘
```

**Fields**:

1. **Bay Code**:
   - Type: Text input (read-only)
   - Value: Auto-generated (BAY/YYYY/XXX)
   - Style: Gray background, disabled
   - Helper text: "Auto-generated, cannot be edited"
   - Edit mode: Disabled, cannot be changed

2. **Bay Name**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 50 characters
   - Placeholder: "Bay A"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Bay name is required"
     * Too long: "Maximum 50 characters"
     * Duplicate: "Bay name already exists"

3. **Type**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: STANDARD, PREMIUM, EXPRESS
   - Placeholder: "Select bay type"
   - Default: None (must select)
   - Error message: "Please select bay type"

4. **Capacity**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Suffix: "vehicles"
   - Min: 1, Max: 5
   - Placeholder: "1"
   - Validation: Must be between 1-5
   - Error messages:
     * Empty: "Capacity is required"
     * Invalid: "Capacity must be between 1-5 vehicles"

5. **Location**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 100 characters
   - Placeholder: "Building A, Floor 1"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Location is required"
     * Too long: "Maximum 100 characters"

6. **Description**:
   - Type: Textarea
   - Required: No
   - Max length: 500 characters
   - Placeholder: "Standard service bay with..."
   - Rows: 3

7. **Status**:
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

#### 5.3.2 Import Excel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Import Service Bays                [X Close]│
├───────────────────────────────────────────────┤
│ Step 1: Download Template                    │
│ [Download Template] service_bay_template.xlsx│
│                                               │
│ Step 2: Upload File                          │
│ [Choose File] No file selected               │
│ Supported: .xlsx, Max 10MB                   │
│                                               │
│ [Upload]                                      │
├───────────────────────────────────────────────┤
│ Preview (after upload):                       │
│ ✅ Row 1: Bay A - Valid                      │
│ ✅ Row 2: Bay B - Valid                      │
│ ❌ Row 3: Invalid - Capacity must be 1-5      │
│                                               │
│ Summary: 2 valid, 1 invalid                  │
│                                               │
│ [Cancel] [Import Valid Rows]                 │
└───────────────────────────────────────────────┘
```

**Steps**:

1. **Download Template**:
   - Button: "Download Template"
   - File: `service_bay_template.xlsx`
   - Columns: Bay Code (optional), Bay Name*, Type*, Capacity*, Location*, Description, Status

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

#### 5.3.3 Delete Confirmation Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Deactivate Service Bay?                      │
├───────────────────────────────────────────────┤
│ ⚠️  This will set the service bay status to  │
│     INACTIVE. The bay will no longer be       │
│     available for scheduling but historical  │
│     data will be preserved.                  │
│                                               │
│ Service Bay: Bay A                           │
│                                               │
│              [Cancel]  [Deactivate]           │
└───────────────────────────────────────────────┘
```

**Elements**:
- Icon: ⚠️ Warning icon (yellow)
- Message: Clear explanation of soft delete
- Bay name: Display for confirmation
- Buttons:
  * Cancel: Secondary (gray)
  * Deactivate: Danger (red)

### 5.4 UI Behavior

#### 5.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `bay_name` OR `bay_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 5.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Type (STANDARD, PREMIUM) AND Status (ACTIVE)

#### 5.4.3 Validation Messages

**Bay Name**:
- Required: "Bay name is required"
- Too long: "Bay name must not exceed 50 characters"
- Duplicate: "Bay name already exists. Please use a different name."

**Type**:
- Required: "Bay type is required"
- Invalid: "Please select a valid bay type"

**Capacity**:
- Required: "Capacity is required"
- Invalid: "Capacity must be between 1-5 vehicles"

**Location**:
- Required: "Location is required"
- Too long: "Location must not exceed 100 characters"

### 5.5 Responsive Design

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

### 5.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 6. Screen: ScoringRule Management

**Route**: `/master/scoring-rules`  
**Added by**: CR-MD-004  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 6.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content Area                                     │
│         ├───────────────────────────────────────────────────────┤
│ Master  │ Header: Master Data / Scoring Rules       [+ New]  │
│ Data    ├───────────────────────────────────────────────────────┤
│ ├ Models│ Filters: [Search...] [Category ▼] [Status ▼]         │
│ ├ Access│ Actions: [Import Excel] [Export Excel]              │
│ ├ Servic├───────────────────────────────────────────────────────┤
│ ├ Other │ Table: Code | Name | Category | Weight | Status | Act │
│         │        SCR/001 | Lead Score | LEAD | 30 | ✅ | ✎ 🗑 │
│         │        SCR/002 | Service Score | SERVICE | 20 | ✅ | ✎ 🗑 │
│         ├───────────────────────────────────────────────────────┤
│         │ Pagination: < 1 2 3 > | 20 per page ▼                │
└─────────┴───────────────────────────────────────────────────────┘
```

### 6.2 Components

#### 6.2.1 Header

- **Breadcrumb**: Home > Master Data > Scoring Rules
- **Title**: "Master Data / Scoring Rules" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create ScoringRule dialog

#### 6.2.2 Filter Bar

**Search Input**:
- Placeholder: "Search by rule name or code..."
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
  * LEAD
  * SERVICE
  * CUSTOMER
  * PERFORMANCE
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

#### 6.2.3 Action Buttons

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

#### 6.2.4 Data Table

**Columns**:

| Column | Width | Alignment | Sortable | Format |
|--------|-------|-----------|----------|--------|
| Rule Code | 120px | Left | Yes | Text (SCR/001) |
| Rule Name | 200px | Left | Yes | Text |
| Category | 120px | Center | Yes | Badge (colored) |
| Weight | 80px | Center | Yes | Number |
| Min Score | 100px | Center | Yes | Number |
| Max Score | 100px | Center | Yes | Number |
| Status | 100px | Center | Yes | Badge (green/gray) |
| Actions | 80px | Center | No | Icons (✎ 🗑) |

**Column Details**:

1. **Rule Code**:
   - Format: SCR/XXX
   - Font: Monospace
   - Color: Gray (#666)

2. **Rule Name**:
   - Format: Plain text
   - Font: Regular
   - Truncate if > 25 chars, show tooltip on hover

3. **Category**:
   - Format: Badge
   - Colors:
     * LEAD: Blue (#3B82F6)
     * SERVICE: Green (#10B981)
     * CUSTOMER: Purple (#8B5CF6)
     * PERFORMANCE: Orange (#F59E0B)
   - Text: Uppercase

4. **Weight**:
   - Format: Number (percentage)
   - Suffix: "%"
   - Example: 30%
   - Alignment: Center

5. **Min Score**:
   - Format: Number
   - Alignment: Center
   - Example: 0

6. **Max Score**:
   - Format: Number
   - Alignment: Center
   - Example: 100

7. **Status**:
   - Format: Badge
   - Colors:
     * ACTIVE: Green background (#10B981), white text
     * INACTIVE: Gray background (#6B7280), white text
   - Text: Uppercase

8. **Actions**:
   - Edit icon: ✎ (pencil)
     * Permission: `MASTER_DATA.UPDATE`
     * Tooltip: "Edit"
     * Action: Opens Edit dialog
   - Delete icon: 🗑 (trash)
     * Permission: `MASTER_DATA.DELETE`
     * Tooltip: "Delete"
     * Action: Shows confirmation dialog
   - Test Rule icon: 🧪
     * Permission: `MASTER_DATA.READ`
     * Tooltip: "Test Rule"
     * Action: Opens Test Rule dialog

**Row Styling**:
- Default: White background
- Hover: Light gray background (#F3F4F6)
- Selected: Blue border (optional)
- INACTIVE rows: Slightly faded (opacity 0.7)

**Empty State**:
- Icon: 📊 Chart icon
- Message: "No scoring rules found"
- Sub-message: "Click '+ New' to create your first scoring rule"
- Show when: No data or no search results

#### 6.2.5 Pagination

- **Items per page**: Dropdown
  * Options: 20 (default), 50, 100
  * Position: Bottom right
  
- **Navigation**: 
  * Buttons: < Previous | 1 2 3 ... | Next >
  * Current page: Highlighted (blue)
  * Disabled state: Gray, not clickable
  
- **Total count**: 
  * Format: "Showing 1-20 of 12 scoring rules"
  * Position: Bottom left

### 6.3 Dialogs

#### 6.3.1 Create/Edit ScoringRule Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Create Scoring Rule                 [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Rule Code*:   [SCR/2026/004       ] (auto)   │
│               Auto-generated, cannot be edited │
│                                               │
│ Rule Name*:   [                         ]     │
│               Lead Score Rule                 │
│                                               │
│ Category*:    [LEAD                ▼]        │
│               Select category                 │
│                                               │
│ Weight*:      [30                 ] %        │
│               1-100%                         │
│                                               │
│ Min Score*:   [0                  ]          │
│               0-1000                         │
│                                               │
│ Max Score*:   [100                ]          │
│               > Min Score                    │
│                                               │
│ Condition*:   [                           ]  │
│               lead_source = 'WEBSITE'         │
│                                               │
│ Description:  [                           ]  │
│               Scores leads from website...    │
│                                               │
│ Status:       ○ Active (default) ○ Inactive   │
│                                               │
│               [Cancel]  [Save]               │
└───────────────────────────────────────────────┘
```

**Fields**:

1. **Rule Code**:
   - Type: Text input (read-only)
   - Value: Auto-generated (SCR/YYYY/XXX)
   - Style: Gray background, disabled
   - Helper text: "Auto-generated, cannot be edited"
   - Edit mode: Disabled, cannot be changed

2. **Rule Name**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 100 characters
   - Placeholder: "Lead Score Rule"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Rule name is required"
     * Too long: "Maximum 100 characters"
     * Duplicate: "Rule name already exists"

3. **Category**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: LEAD, SERVICE, CUSTOMER, PERFORMANCE
   - Placeholder: "Select category"
   - Default: None (must select)
   - Error message: "Please select category"

4. **Weight**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Suffix: "%"
   - Min: 1, Max: 100
   - Placeholder: "30"
   - Validation: Must be between 1-100
   - Error messages:
     * Empty: "Weight is required"
     * Invalid: "Weight must be between 1-100%"

5. **Min Score**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Min: 0, Max: 1000
   - Placeholder: "0"
   - Validation: Must be between 0-1000
   - Error messages:
     * Empty: "Minimum score is required"
     * Invalid: "Minimum score must be between 0-1000"

6. **Max Score**:
   - Type: Number input
   - Required: Yes (red asterisk *)
   - Min: 0, Max: 1000
   - Placeholder: "100"
   - Validation: Must be > Min Score and <= 1000
   - Error messages:
     * Empty: "Maximum score is required"
     * Invalid: "Maximum score must be greater than minimum score"

7. **Condition**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 500 characters
   - Placeholder: "lead_source = 'WEBSITE'"
   - Helper text: "SQL-like condition, e.g., field = 'value'"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Condition is required"
     * Too long: "Maximum 500 characters"
     * Invalid: "Invalid condition format"

8. **Description**:
   - Type: Textarea
   - Required: No
   - Max length: 500 characters
   - Placeholder: "Scores leads from website..."
   - Rows: 3

9. **Status**:
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

#### 6.3.2 Import Excel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Import Scoring Rules              [X Close]│
├───────────────────────────────────────────────┤
│ Step 1: Download Template                    │
│ [Download Template] scoring_rule_template.xlsx│
│                                               │
│ Step 2: Upload File                          │
│ [Choose File] No file selected               │
│ Supported: .xlsx, Max 10MB                   │
│                                               │
│ [Upload]                                      │
├───────────────────────────────────────────────┤
│ Preview (after upload):                       │
│ ✅ Row 1: Lead Score - Valid                 │
│ ✅ Row 2: Service Score - Valid              │
│ ❌ Row 3: Invalid - Weight must be 1-100%     │
│                                               │
│ Summary: 2 valid, 1 invalid                  │
│                                               │
│ [Cancel] [Import Valid Rows]                 │
└───────────────────────────────────────────────┘
```

**Steps**:

1. **Download Template**:
   - Button: "Download Template"
   - File: `scoring_rule_template.xlsx`
   - Columns: Rule Code (optional), Rule Name*, Category*, Weight*, Min Score*, Max Score*, Condition*, Description, Status

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

#### 6.3.3 Test Rule Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Test Scoring Rule                   [X Close] │
├───────────────────────────────────────────────┤
│                                               │
│ Rule: Lead Score Rule (SCR/001)               │
│ Condition: lead_source = 'WEBSITE'            │
│                                               │
│ Test Data:                                    │
│                                               │
│ Field: [lead_source               ▼]         │
│ Value: [WEBSITE                    ]         │
│                                               │
│ Expected Result: [30                ]         │
│                    Score to assign              │
│                                               │
│ [Test Rule]                                  │
│                                               │
│ Result: ✅ PASSED - Score: 30 assigned        │
│        ❌ FAILED - Condition not met          │
│                                               │
│ [Close]                                      │
└───────────────────────────────────────────────┘
```

**Elements**:
- **Rule Info**: Shows rule name, code, and condition
- **Test Data**:
  * Field: Dropdown of available fields based on category
  * Value: Input field for test value
- **Expected Result**: Input for expected score
- **Test Button**: Triggers rule evaluation
- **Result Display**: Shows pass/fail status and actual score

#### 6.3.4 Delete Confirmation Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Deactivate Scoring Rule?                    │
├───────────────────────────────────────────────┤
│ ⚠️  This will set the scoring rule status to│
│     INACTIVE. The rule will no longer be    │
│     used in calculations but historical     │
│     data will be preserved.                │
│                                               │
│ Scoring Rule: Lead Score Rule                │
│                                               │
│              [Cancel]  [Deactivate]           │
└───────────────────────────────────────────────┘
```

**Elements**:
- Icon: ⚠️ Warning icon (yellow)
- Message: Clear explanation of soft delete
- Rule name: Display for confirmation
- Buttons:
  * Cancel: Secondary (gray)
  * Deactivate: Danger (red)

### 6.4 UI Behavior

#### 6.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `rule_name` OR `rule_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 6.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Category (LEAD, SERVICE) AND Status (ACTIVE)

#### 6.4.3 Validation Messages

**Rule Name**:
- Required: "Rule name is required"
- Too long: "Rule name must not exceed 100 characters"
- Duplicate: "Rule name already exists. Please use a different name."

**Category**:
- Required: "Category is required"
- Invalid: "Please select a valid category"

**Weight**:
- Required: "Weight is required"
- Invalid: "Weight must be between 1-100%"

**Min Score**:
- Required: "Minimum score is required"
- Invalid: "Minimum score must be between 0-1000"

**Max Score**:
- Required: "Maximum score is required"
- Invalid: "Maximum score must be greater than minimum score"

**Condition**:
- Required: "Condition is required"
- Too long: "Condition must not exceed 500 characters"
- Invalid: "Invalid condition format. Use SQL-like syntax."

### 6.5 Responsive Design

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

### 6.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 7. Screen: SystemSetting Management

**Route**: `/master/system-settings`  
**Added by**: CR-MD-004  
**Access**: Admin (full CRUD), Others (read-only)  
**Permission**: `MASTER_DATA.READ` (minimum)

### 7.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Main Content Area                                     │
│         ├───────────────────────────────────────────────────────┤
│ Master  │ Header: Master Data / System Settings     [+ New]  │
│ Data    ├───────────────────────────────────────────────────────┤
│ ├ Models│ Filters: [Search...] [Category ▼] [Status ▼]         │
│ ├ Access│ Actions: [Import Excel] [Export Excel]              │
│ ├ Servic├───────────────────────────────────────────────────────┤
│ ├ Other │ Table: Code | Name | Category | Type | Value | Status │
│         │        SYS/001 | Lead Expiry | LEAD | DAYS | 30 | ✅ │
│         │        SYS/002 | Max Upload | SYSTEM | MB | 10 | ✅ │
│         ├───────────────────────────────────────────────────────┤
│         │ Pagination: < 1 2 3 > | 20 per page ▼                │
└─────────┴───────────────────────────────────────────────────────┘
```

### 7.2 Components

#### 7.2.1 Header

- **Breadcrumb**: Home > Master Data > System Settings
- **Title**: "Master Data / System Settings" (H1, bold)
- **Action Button**: "+ New" 
  * Style: Primary button (blue background)
  * Icon: Plus icon
  * Position: Top right
  * Permission: `MASTER_DATA.CREATE`
  * Action: Opens Create SystemSetting dialog

#### 7.2.2 Filter Bar

**Search Input**:
- Placeholder: "Search by setting name or code..."
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
  * LEAD
  * SERVICE
  * CUSTOMER
  * SYSTEM
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

#### 7.2.3 Action Buttons

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

#### 7.2.4 Data Table

**Columns**:

| Column | Width | Alignment | Sortable | Format |
|--------|-------|-----------|----------|--------|
| Setting Code | 120px | Left | Yes | Text (SYS/001) |
| Setting Name | 200px | Left | Yes | Text |
| Category | 120px | Center | Yes | Badge (colored) |
| Data Type | 100px | Center | Yes | Badge |
| Default Value | 120px | Left | Yes | Text |
| Current Value | 120px | Left | Yes | Text (with edit) |
| Status | 100px | Center | Yes | Badge (green/gray) |
| Actions | 80px | Center | No | Icons (✎ 🗑) |

**Column Details**:

1. **Setting Code**:
   - Format: SYS/XXX
   - Font: Monospace
   - Color: Gray (#666)

2. **Setting Name**:
   - Format: Plain text
   - Font: Regular
   - Truncate if > 25 chars, show tooltip on hover

3. **Category**:
   - Format: Badge
   - Colors:
     * LEAD: Blue (#3B82F6)
     * SERVICE: Green (#10B981)
     * CUSTOMER: Purple (#8B5CF6)
     * SYSTEM: Orange (#F59E0B)
   - Text: Uppercase

4. **Data Type**:
   - Format: Badge
   - Colors:
     * STRING: Blue (#3B82F6)
     * NUMBER: Green (#10B981)
     * BOOLEAN: Purple (#8B5CF6)
     * DATE: Orange (#F59E0B)
   - Text: Uppercase

5. **Default Value**:
   - Format: Based on data type
   - Alignment: Left
   - Example: "30", "true", "2026-01-01"

6. **Current Value**:
   - Format: Based on data type + inline edit
   - Alignment: Left
   - Edit icon: ✏️ when hover (for inline edit)
   - Example: "30", "true", "2026-01-01"

7. **Status**:
   - Format: Badge
   - Colors:
     * ACTIVE: Green background (#10B981), white text
     * INACTIVE: Gray background (#6B7280), white text
   - Text: Uppercase

8. **Actions**:
   - Edit icon: ✎ (pencil)
     * Permission: `MASTER_DATA.UPDATE`
     * Tooltip: "Edit"
     * Action: Opens Edit dialog
   - Delete icon: 🗑 (trash)
     * Permission: `MASTER_DATA.DELETE`
     * Tooltip: "Delete"
     * Action: Shows confirmation dialog
   - Reset icon: 🔄
     * Permission: `MASTER_DATA.UPDATE`
     * Tooltip: "Reset to Default"
     * Action: Reset to default value

**Row Styling**:
- Default: White background
- Hover: Light gray background (#F3F4F6)
- Selected: Blue border (optional)
- INACTIVE rows: Slightly faded (opacity 0.7)

**Empty State**:
- Icon: ⚙️ Gear icon
- Message: "No system settings found"
- Sub-message: "Click '+ New' to create your first system setting"
- Show when: No data or no search results

#### 7.2.5 Pagination

- **Items per page**: Dropdown
  * Options: 20 (default), 50, 100
  * Position: Bottom right
  
- **Navigation**: 
  * Buttons: < Previous | 1 2 3 ... | Next >
  * Current page: Highlighted (blue)
  * Disabled state: Gray, not clickable
  
- **Total count**: 
  * Format: "Showing 1-20 of 25 system settings"
  * Position: Bottom left

### 7.3 Dialogs

#### 7.3.1 Create/Edit SystemSetting Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Create System Setting               [X Close]│
├───────────────────────────────────────────────┤
│                                               │
│ Setting Code*: [SYS/2026/004       ] (auto)  │
│                Auto-generated, cannot be edited│
│                                               │
│ Setting Name*: [                         ]    │
│                Lead Expiry Days                │
│                                               │
│ Category*:     [LEAD                ▼]       │
│                Select category                 │
│                                               │
│ Data Type*:    [STRING              ▼]       │
│                Select data type                │
│                                               │
│ Default Value*:[30                  ]         │
│                30 days                        │
│                                               │
│ Description:  [                         ]    │
│                Number of days before lead...  │
│                                               │
│ Status:        ○ Active (default) ○ Inactive  │
│                                               │
│                [Cancel]  [Save]               │
└───────────────────────────────────────────────┘
```

**Fields**:

1. **Setting Code**:
   - Type: Text input (read-only)
   - Value: Auto-generated (SYS/YYYY/XXX)
   - Style: Gray background, disabled
   - Helper text: "Auto-generated, cannot be edited"
   - Edit mode: Disabled, cannot be changed

2. **Setting Name**:
   - Type: Text input
   - Required: Yes (red asterisk *)
   - Max length: 100 characters
   - Placeholder: "Lead Expiry Days"
   - Validation: Real-time on blur
   - Error messages:
     * Empty: "Setting name is required"
     * Too long: "Maximum 100 characters"
     * Duplicate: "Setting name already exists"

3. **Category**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: LEAD, SERVICE, CUSTOMER, SYSTEM
   - Placeholder: "Select category"
   - Default: None (must select)
   - Error message: "Please select category"

4. **Data Type**:
   - Type: Dropdown (single select)
   - Required: Yes (red asterisk *)
   - Options: STRING, NUMBER, BOOLEAN, DATE
   - Placeholder: "Select data type"
   - Default: None (must select)
   - Error message: "Please select data type"

5. **Default Value**:
   - Type: Dynamic based on data type
   - Required: Yes (red asterisk *)
   - STRING: Text input
   - NUMBER: Number input
   - BOOLEAN: Radio buttons (Yes/No)
   - DATE: Date picker
   - Validation: Based on data type
   - Error messages:
     * Empty: "Default value is required"
     * Invalid: "Invalid value format"

6. **Description**:
   - Type: Textarea
   - Required: No
   - Max length: 500 characters
   - Placeholder: "Number of days before lead..."
   - Rows: 3

7. **Status**:
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

#### 7.3.2 Import Excel Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Import System Settings             [X Close]│
├───────────────────────────────────────────────┤
│ Step 1: Download Template                    │
│ [Download Template] system_setting_template.xlsx│
│                                               │
│ Step 2: Upload File                          │
│ [Choose File] No file selected               │
│ Supported: .xlsx, Max 10MB                   │
│                                               │
│ [Upload]                                      │
├───────────────────────────────────────────────┤
│ Preview (after upload):                       │
│ ✅ Row 1: Lead Expiry - Valid                │
│ ✅ Row 2: Max Upload - Valid                 │
│ ❌ Row 3: Invalid - Invalid data type        │
│                                               │
│ Summary: 2 valid, 1 invalid                  │
│                                               │
│ [Cancel] [Import Valid Rows]                 │
└───────────────────────────────────────────────┘
```

**Steps**:

1. **Download Template**:
   - Button: "Download Template"
   - File: `system_setting_template.xlsx`
   - Columns: Setting Code (optional), Setting Name*, Category*, Data Type*, Default Value*, Description, Status

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

#### 7.3.3 Inline Edit Current Value

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Edit Setting Value                 [X Close]  │
├───────────────────────────────────────────────┤
│                                               │
│ Setting: Lead Expiry Days                    │
│ Default: 30                                  │
│                                               │
│ New Value: [35                           ]   │
│             Number input (1-365)                │
│                                               │
│ Reason:   [                              ]    │
│           System configuration update          │
│                                               │
│           [Cancel]  [Update]                 │
└───────────────────────────────────────────────┘
```

**Elements**:
- **Setting Info**: Shows setting name and default value
- **New Value**: Input field based on data type
- **Reason**: Textarea for change reason (required for audit)
- **Action Buttons**:
  * Cancel: Secondary (gray)
  * Update: Primary (blue)

#### 7.3.4 Delete Confirmation Dialog

**Layout**:
```
┌───────────────────────────────────────────────┐
│ Deactivate System Setting?                  │
├───────────────────────────────────────────────┤
│ ⚠️  This will set the system setting status │
│     to INACTIVE. The setting will no longer  │
│     be used but historical data will be      │
│     preserved.                               │
│                                               │
│ System Setting: Lead Expiry Days             │
│                                               │
│              [Cancel]  [Deactivate]           │
└───────────────────────────────────────────────┘
```

**Elements**:
- Icon: ⚠️ Warning icon (yellow)
- Message: Clear explanation of soft delete
- Setting name: Display for confirmation
- Buttons:
  * Cancel: Secondary (gray)
  * Deactivate: Danger (red)

### 7.4 UI Behavior

#### 7.4.1 Search Behavior

- **Trigger**: 300ms after last keystroke (debounce)
- **Match**: Partial, case-insensitive
- **Fields**: `setting_name` OR `setting_code`
- **Highlight**: Matched text in results (optional)
- **Clear**: ✕ button clears search and reloads

#### 7.4.2 Filter Behavior

- **Logic**: AND between all filters
- **Apply**: Immediate on selection
- **Persist**: Filters saved in URL query params
- **Reset**: "Clear Filters" button (if any filter active)
- **Example**: Category (LEAD, SERVICE) AND Status (ACTIVE)

#### 7.4.3 Validation Messages

**Setting Name**:
- Required: "Setting name is required"
- Too long: "Setting name must not exceed 100 characters"
- Duplicate: "Setting name already exists. Please use a different name."

**Category**:
- Required: "Category is required"
- Invalid: "Please select a valid category"

**Data Type**:
- Required: "Data type is required"
- Invalid: "Please select a valid data type"

**Default Value**:
- Required: "Default value is required"
- Invalid: "Invalid value format for selected data type"

### 7.5 Responsive Design

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

### 7.6 Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab order, Enter to submit, Esc to cancel
- **Focus indicators**: Blue outline on focused elements
- **Screen reader**: Descriptive labels and announcements
- **Color contrast**: WCAG AA compliant

---

## 8. Menu Navigation

### 8.1 Sidebar Structure

```
┌─────────────────────────────────────────────┐
│ 🏠 Home                                     │
│ 📊 Dashboard                               │
├─────────────────────────────────────────────┤
│ 🗂️ Master Data           ▼                 │
│ ├─ 🚗 Models                              │
│ ├─ 🔧 Accessories                         │
│ ├─ ⚙️ Services                            │
│ ├─ 🏭 Service Bays                        │
│ ├─ 📊 Scoring Rules                       │
│ ├─ ⚙️ System Settings                     │
├─────────────────────────────────────────────┤
│ 🤝 CRM                                    │
│ ├─ 👥 Leads                              │
│ ├─ 📞 Contacts                          │
│ ├─ 📋 Quotations                         │
├─────────────────────────────────────────────┤
│ 🛠️ Admin                                  │
│ ├─ 👤 Users                              │
│ ├─ 🔐 Roles                              │
│ ├─ 📊 Reports                            │
├─────────────────────────────────────────────┤
│ ⚙️ System                                 │
│ ├─ 📊 System Logs                        │
│ ├─ 🔄 Data Sync                          │
└─────────────────────────────────────────────┘
```

### 8.2 Navigation Updates

**Master Data Group (Expanded)**:

1. **Models** (Existing)
   - Route: `/master/vehicle-models`
   - Icon: 🚗 Car
   - Permission: `MASTER_DATA.READ`

2. **Accessories** (NEW - CR-MD-002)
   - Route: `/master/accessories`
   - Icon: 🔧 Wrench
   - Permission: `MASTER_DATA.READ`

3. **Services** (NEW - CR-MD-003)
   - Route: `/master/service-catalogs`
   - Icon: ⚙️ Gear
   - Permission: `MASTER_DATA.READ`

4. **Service Bays** (NEW - CR-MD-004)
   - Route: `/master/service-bays`
   - Icon: 🏭 Factory
   - Permission: `MASTER_DATA.READ`

5. **Scoring Rules** (NEW - CR-MD-004)
   - Route: `/master/scoring-rules`
   - Icon: 📊 Chart
   - Permission: `MASTER_DATA.READ`

6. **System Settings** (NEW - CR-MD-004)
   - Route: `/master/system-settings`
   - Icon: ⚙️ Settings
   - Permission: `MASTER_DATA.READ`

### 8.3 CRM Group Updates

**Enhanced with Master Data References**:

1. **Leads** (Updated)
   - Route: `/crm/leads`
   - Icon: 👥 Users
   - Permission: `CRM.READ`
   - **Dependencies**: VehicleModels, ScoringRules

2. **Contacts** (Updated)
   - Route: `/crm/contacts`
   - Icon: 📞 Phone
   - Permission: `CRM.READ`
   - **Dependencies**: VehicleModels

3. **Quotations** (Updated)
   - Route: `/crm/quotations`
   - Icon: 📋 Document
   - Permission: `CRM.READ`
   - **Dependencies**: VehicleModels, Accessories, ServiceCatalogs

### 8.4 Breadcrumb Navigation

**Master Data Screens**:

```
Home > Master Data > [Screen Name]
```

**Examples**:
- `Home > Master Data > Accessories`
- `Home > Master Data > Service Catalogs`
- `Home > Master Data > Service Bays`
- `Home > Master Data > Scoring Rules`
- `Home > Master Data > System Settings`

### 8.5 Permission-Based Navigation

**Visibility Rules**:

1. **Master Data Group**:
   - Visible if: User has `MASTER_DATA.READ` OR `CRM.READ` OR `ADMIN.READ`
   - Collapsed by default if no permissions

2. **Individual Screens**:
   - **Models**: Visible if `MASTER_DATA.READ`
   - **Accessories**: Visible if `MASTER_DATA.READ`
   - **Services**: Visible if `MASTER_DATA.READ`
   - **Service Bays**: Visible if `MASTER_DATA.READ`
   - **Scoring Rules**: Visible if `MASTER_DATA.READ`
   - **System Settings**: Visible if `ADMIN.READ`

3. **CRM Group**:
   - Visible if: User has `CRM.READ`
   - Enhanced with master data indicators

### 8.6 Active State Management

**Current Screen Highlighting**:

- **Master Data Group**: Expanded when any master data screen is active
- **Active Screen**: Blue background, white text
- **Parent Screens**: Italic text when child screen is active

**Examples**:
- When on `/master/accessories`: Master Data group expanded, Accessories highlighted
- When on `/crm/quotations`: CRM group expanded, Quotations highlighted

### 8.7 Mobile Navigation

**Responsive Behavior**:

1. **Desktop (>1024px)**:
   - Full sidebar expanded
   - All groups visible
   - Text labels + icons

2. **Tablet (768-1024px)**:
   - Sidebar collapsible
   - Icons + text when expanded
   - Icons only when collapsed
   - Tooltip on hover

3. **Mobile (<768px)**:
   - Sidebar hidden
   - Hamburger menu
   - Bottom navigation bar with main items
   - Master Data item with submenu

**Mobile Bottom Navigation**:
```
[🏠] [📊] [🗂️] [🤝] [⚙️]
 Home  Data  Master CRM   System
```

### 8.8 Keyboard Navigation

**Accessibility Features**:

1. **Tab Order**: Logical flow through menu items
2. **Enter/Space**: Activate menu item
3. **Arrow Keys**: Navigate within expanded groups
4. **Escape**: Close mobile menu
5. **Screen Reader**: ARIA labels for all items

---

## 9. Component Reuse

### 9.1 Existing Components to Reuse

**From existing codebase**:

1. **Table Component**:
   - Reference: `PartsStockTake.tsx`
   - Features: Sorting, pagination, row actions
   - Customization: Add category/status badges, progress bars
   - Usage: All 6 master data screens

2. **Form Dialog**:
   - Reference: `QuotationForm.tsx`
   - Features: Validation, error messages, submit handling
   - Customization: Adapt fields for each entity type
   - Usage: All create/edit dialogs

3. **File Upload**:
   - Reference: `PickingPacking.tsx`
   - Features: File picker, validation, preview
   - Customization: Excel-specific validation
   - Usage: All import dialogs

4. **Search Input**:
   - Reference: Common component
   - Features: Debounce, clear button
   - Customization: None needed
   - Usage: All filter bars

5. **Dropdown Filter**:
   - Reference: Common component
   - Features: Multi-select, single-select
   - Customization: None needed
   - Usage: All filter bars

6. **Pagination Component**:
   - Reference: Common component
   - Features: Page navigation, items per page
   - Customization: None needed
   - Usage: All data tables

7. **Badge Component**:
   - Reference: Common component
   - Features: Color variations, text styling
   - Customization: Add new colors for categories
   - Usage: All table columns requiring badges

8. **Progress Bar Component**:
   - Reference: Common component
   - Features: Percentage display, color coding
   - Customization: Service bay usage display
   - Usage: ServiceBay management screen

### 9.2 New Components to Create

#### 9.2.1 Base Components

1. **MasterDataPage.tsx** (Base page):
   - Combines: Table + Search + Filters + Actions
   - Template for all 6 master data screens
   - Props: entity type, columns, filters, actions

2. **MasterDataForm.tsx** (Base form):
   - Dynamic form based on entity schema
   - Validation: Real-time and on submit
   - Modes: Create, Edit
   - Usage: All entity forms with field configuration

3. **MasterDataImport.tsx** (Base import):
   - Steps: Download template, Upload file, Preview, Import
   - Validation: Excel parsing, row validation
   - Result: Success message + error report
   - Usage: All import dialogs

4. **MasterDataTable.tsx** (Base table):
   - Dynamic columns based on entity
   - Features: Sorting, pagination, row actions
   - Styling: Badges, currency format, progress bars
   - Usage: All data tables

#### 9.2.2 Entity-Specific Components

5. **VehicleModelManagement.tsx**:
   - Extends: MasterDataPage
   - Route: `/master/vehicle-models`
   - Specific: Category badges, price formatting

6. **AccessoryManagement.tsx**:
   - Extends: MasterDataPage
   - Route: `/master/accessories`
   - Specific: Warranty display, compatibility button

7. **ServiceCatalogManagement.tsx**:
   - Extends: MasterDataPage
   - Route: `/master/service-catalogs`
   - Specific: Duration display, service packages button

8. **ServiceBayManagement.tsx**:
   - Extends: MasterDataPage
   - Route: `/master/service-bays`
   - Specific: Capacity display, usage progress bar

9. **ScoringRuleManagement.tsx**:
   - Extends: MasterDataPage
   - Route: `/master/scoring-rules`
   - Specific: Weight display, test rule button

10. **SystemSettingManagement.tsx**:
    - Extends: MasterDataPage
    - Route: `/master/system-settings`
    - Specific: Data type badges, inline edit

#### 9.2.3 Dialog Components

11. **VehicleModelForm.tsx**:
    - Fields: model_code, model_name, category, base_price, status
    - Validation: Real-time and on submit

12. **AccessoryForm.tsx**:
    - Fields: accessory_code, accessory_name, category, price, installation_required, warranty_period_months, status
    - Extra: Compatible models selection

13. **ServiceCatalogForm.tsx**:
    - Fields: service_code, service_name, category, duration_hours, base_price, requires_parts, status
    - Extra: Compatible models, service parts

14. **ServiceBayForm.tsx**:
    - Fields: bay_code, bay_name, bay_type, capacity_vehicles, location, description, status
    - Validation: Capacity limits

15. **ScoringRuleForm.tsx**:
    - Fields: rule_code, rule_name, category, weight_percentage, min_score, max_score, condition_expression, description, status
    - Extra: Condition validation

16. **SystemSettingForm.tsx**:
    - Fields: setting_code, setting_name, category, data_type, default_value, description, status
    - Extra: Dynamic field based on data type

#### 9.2.4 Specialized Components

17. **CompatibilityMatrix.tsx**:
    - Features: Model compatibility grid
    - Actions: Add/remove compatibility
    - Usage: Accessory and ServiceCatalog screens

18. **PriceHistory.tsx**:
    - Features: Historical price display
    - Export: Excel download
    - Usage: Accessory screen

19. **ServicePackages.tsx**:
    - Features: Package management
    - Actions: Create, edit, delete packages
    - Usage: ServiceCatalog screen

20. **ServiceParts.tsx**:
    - Features: Parts assignment
    - Actions: Add/remove parts
    - Usage: ServiceCatalog screen

21. **TestRule.tsx**:
    - Features: Rule testing interface
    - Actions: Test with sample data
    - Usage: ScoringRule screen

22. **InlineEditValue.tsx**:
    - Features: Quick value editing
    - Actions: Update with audit reason
    - Usage: SystemSetting screen

### 9.3 Component Hierarchy

```
MasterDataPage (Base)
├── MasterDataTable
├── SearchInput
├── FilterBar
│   ├── DropdownFilter
│   └── StatusFilter
├── ActionButtons
│   ├── ImportButton
│   ├── ExportButton
│   └── SpecialButton (Compatibility, Packages, etc.)
└── Pagination

MasterDataForm (Base)
├── FormFields (Dynamic)
├── Validation
├── ActionButtons
└── ErrorDisplay

MasterDataImport (Base)
├── TemplateDownload
├── FileUpload
├── ValidationPreview
└── ImportResult

Entity-Specific Pages (Extend Base)
├── VehicleModelManagement
├── AccessoryManagement
├── ServiceCatalogManagement
├── ServiceBayManagement
├── ScoringRuleManagement
└── SystemSettingManagement
```

### 9.4 Implementation Strategy

1. **Phase 1**: Create base components (MasterDataPage, MasterDataForm, MasterDataImport)
2. **Phase 2**: Implement existing VehicleModel screen with base components
3. **Phase 3**: Create 5 new entity-specific pages
4. **Phase 4**: Implement specialized dialog components
5. **Phase 5**: Add features (compatibility, packages, testing, inline edit)
6. **Phase 6**: Integration testing and optimization

### 9.5 Code Reuse Benefits

1. **Consistency**: All screens follow same patterns
2. **Maintenance**: Single point of change for common features
3. **Testing**: Base components tested once, reused everywhere
4. **Performance**: Optimized components shared across screens
5. **Development**: Faster implementation of new screens
6. **Accessibility**: Centralized accessibility features

---

## Change Log

### v1.1 (31/01/2026) - CR-MD-002/003/004
- Added Refs Analysis section with business requirements mapping
- Added Screen: Accessory Management (FR-MD-002)
- Added Screen: ServiceCatalog Management (FR-MD-003)
- Added Screen: ServiceBay Management (FR-MD-004)
- Added Screen: ScoringRule Management (FR-MD-004)
- Added Screen: SystemSetting Management (FR-MD-004)
- Added Menu Navigation section with updated sidebar structure
- Updated Component Reuse plan with 12 new components
- Added specialized dialogs: Compatibility Matrix, Price History, Service Packages, Test Rule, Inline Edit
- Enhanced all screens with consistent patterns and behaviors
- Updated responsive design guidelines for all new screens
- Added accessibility requirements for new components

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