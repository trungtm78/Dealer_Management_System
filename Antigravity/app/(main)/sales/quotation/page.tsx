// FRD: SCR-SAL-001
// Refs: components/sales/QuotationForm.tsx
// API: POST /api/sales/quotations
// ERD: quotations, customers, vehicle_models, accessories
import QuotationForm from "@/components/sales/QuotationForm";

export default function CreateQuotationPage() {
    return (
        <div className="h-full">
            <QuotationForm />
        </div>
    );
}

