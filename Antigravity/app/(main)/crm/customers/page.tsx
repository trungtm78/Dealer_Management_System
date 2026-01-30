// FRD: SCR-CRM-002
// Refs: components/crm/CustomerList.tsx
// API: GET /api/crm/customers
// ERD: customers
import { CustomerList } from "@/components/crm/CustomerList";

export const metadata = {
    title: "Danh Sách Khách Hàng | Honda CRM",
};

export default function CustomerListPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Quản Lý Khách Hàng</h1>
            <CustomerList />
        </div>
    );
}

