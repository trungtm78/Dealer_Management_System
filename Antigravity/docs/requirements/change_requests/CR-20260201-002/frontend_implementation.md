# Frontend Implementation Plan: CR-20260201-002

## 1. Components to Modify
- **`Sidebar.tsx`**: Update the menu configuration array (or JSX structure) to include the new groups.
- **`SidebarGroup.tsx`**: Ensure it supports collapsible functionality (if not already present).
- **`IconRegistry.ts`**: Import new icons (Car, Package, FileClock, etc.) from `lucide-react`.

## 2. Navigation Logic
- Implement permission check logic for rendering menu items.
  ```typescript
  const menuConfig = [
    {
       title: "Admin",
       permission: "admin.view",
       items: [...]
    }
  ];
  ```

## 3. Routing
- Verify `routes.ts` or `app/router` has placeholders for all new paths to prevent 404s when clicked.
