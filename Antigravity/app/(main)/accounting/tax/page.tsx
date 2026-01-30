
import TaxReport from "@/components/accounting/TaxReport";

export default function TaxPage() {
    return (
        <div className="h-full p-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Báo Cáo Thuế</h2>
                    <p className="text-muted-foreground">
                        Tờ khai thuế GTGT, TNDN, TNCN và nghĩa vụ thuế khác.
                    </p>
                </div>
            </div>
            <TaxReport />
        </div>
    );
}
