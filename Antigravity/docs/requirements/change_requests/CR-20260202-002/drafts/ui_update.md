# UI Spec Update: Master Data (CR-20260202-002)

## 1. Navigation Menu Structure
The `SIDEBAR_MENU` configuration must be updated to include a "Master Data" section (Icon: Database/Settings) with the following hierarchy:

- **Master Data**
    - **Vehicle Management**
        - Vehicle List (`/master/vehicles`)
        - Models (`/master/models`)
        - Versions (`/master/versions`)
        - Colors (`/master/colors`)
    - **Employee Management**
        - Employee List (`/master/employees`)
        - Departments (`/master/departments`)
        - Positions (`/master/positions`)
        - Levels (`/master/levels`)
    - **Supplier Management**
        - Supplier List (`/master/suppliers`)
        - Contacts (`/master/supplier-contacts`)
        - Contracts (`/master/supplier-contracts`)
    - **Service Management**
        - Service Catalog (`/master/services`)
        - Service Packages (`/master/service-packages`)
        - Service Pricing (`/master/service-pricing`)
    - **System Setup**
        - Locations (`/master/locations`)
        - Banks (`/master/banks`)
        - Payment Methods (`/master/payment-methods`)
        - UOMs (`/master/uoms`)
        - Warehouses (`/master/warehouses`)

## 2. Common Screen Patterns
All Master Data screens must follow the **"Standard Master Layout"**:

1.  **Header**:
    -   Title (e.g., "Vehicle Versions")
    -   Breadcrumbs (Master Data > Vehicle > Versions)
    -   Action Button: "Create New" (Primary Color)
2.  **Filter Bar**:
    -   Search Input (debounce 300ms)
    -   Status Filter (Active/All)
    -   Date Range (Created At) - Optional
3.  **Data Table**:
    -   Columns: ID, Name, Code, [Specific Attributes], Status, Actions
    -   Actions: Edit (Icon), Delete (Icon), View (Icon)
    -   Pagination: Bottom right (10/20/50 per page)
4.  **Creation/Edit Drawer (Slide-over)**:
    -   Opens from right side.
    -   Form Validation (Zod schema).
    -   Footer: Cancel (Secondary), Save (Primary).

## 3. Screen-Specific Requirements

### 3.1 Vehicle Versions
- **List Columns**: Version Name, Model Name, Engine Type.
- **Form Fields**: Model Select (Searchable), Version Name, Specs JSON Editor (optional).

### 3.2 Vehicle Colors
- **List Columns**: Color Preview (Circle), Color Name, Color Code, Price Adjust.
- **Form Fields**: Model Select, Color Name, Hex Code (Color Picker), Price Adjustment (Currency Input).

### 3.3 Departments
- **List Layout**: Tree Grid (to show hierarchy).
- **Form Fields**: Dept Name, Code, Parent Dept (Select), Manager (Employee Select).

### 3.4 Locations (Tabbed Layout)
- **Tabs**: Provinces | Districts | Wards
- **Provinces**: Import Only (Read-only for users usually).
- **Districts/Wards**: Filterable by Parent.

### 3.5 Banks
- **List Columns**: Logo, Bank Code, Bank Name.
- **Form Fields**: Bank Name, Code, Logo URL, Swift Code.

## 4. Interaction Design
- **Delete Action**: Must show strict confirmation dialog ("Are you sure? This may affect X records...").
- **Success Feedback**: Toast notification (Top-Right, 3s).
- **Error Handling**: Form field validation messages (Red text below input).
