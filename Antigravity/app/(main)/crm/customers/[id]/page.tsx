// FRD: SCR-CRM-002
// Refs: components/crm/CustomerForm.tsx
// API: GET /api/crm/customers/{id}
// ERD: customers
import { CustomerForm } from "@/components/crm/CustomerForm";
import { getCustomer } from "@/actions/crm/customers";


export const metadata = {
    title: "Chi Tiết Khách Hàng | Honda CRM",
};

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    const customer = await getCustomer(params.id);

    if (!customer) {
        return (
            <div className="p-6">
                <div className="alert alert-error">Không tìm thấy khách hàng!</div>
            </div>
        );
    }

    return <CustomerForm initialData={customer} />;
}
