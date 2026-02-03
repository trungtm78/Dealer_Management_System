
## 15. Master Data Screens (Draft v1.3)

### 15.1 Generic Master Layout
**Reference**: UI-MD-GENERIC
**Structure**:
- Left Sidebar: Navigation Tree (Categorized by Service, Sales, Parts, System)
- Main/Top: Breadcrumb + "New" Button + Search/Filter Bar
- Content: Data Grid (Sortable columns, Status badge, Actions)
- Drawer/Modal: Create/Edit Form

### 15.2 Screen List
1. **Vehicle Colors**: Grid (Code, Name, Hex Preview). Form (Color Picker).
2. **Vehicle Engines**: Grid (Code, Specs). Form (Dropdowns for Fuel/Trans).
3. **Parts Categories**: Tree View or Indented Grid. Form (Parent Selector).
4. **Parts Locations**: Grid (Warehouse, Zone, Bin). Form (Cascading Select).
5. **Service Types**: Grid. Form (Priority Slider).
6. **Insurance Companies**: Grid. Form (Contact Details).
7. **Payment Methods**: Grid. Form (Fee Input).
8. **Tax Rates**: Grid. Form (Rate %, Default Checkbox).
9. **Geographic**: Tree View (Province -> District -> Ward). Read-Only sync usually, but editable for admins.

### 15.3 Component Reuse
- `MasterGridComponent`: Reused for 90% of screens. inputs: `columns`, `apiUrl`.
- `MasterFormComponent`: Dynamic form builder based on JSON config.
