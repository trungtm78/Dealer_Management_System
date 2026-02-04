"use client";

import { SmartCustomerSelect } from "@/components/common/SmartCustomerSelect";
import { useState } from "react";
import { SelectItem } from "@/types/smart-select";

export default function DemoSmartSelect() {
    const [selectedId, setSelectedId] = useState<string | number>("");

    const handleChange = (item: SelectItem | null) => {
        console.log("Selected:", item);
        setSelectedId(item?.id || "");
    };

    return (
        <div className="p-10 max-w-md mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Smart Customer Select Demo</h1>

            <div className="space-y-2">
                <label className="text-sm font-medium">Chọn khách hàng (Cơ bản)</label>
                <SmartCustomerSelect
                    value={selectedId}
                    onChange={handleChange}
                    placeholder="Tìm theo tên, sđt, email..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Chỉ khách hàng Active + Có nút tạo mới</label>
                <SmartCustomerSelect
                    value={selectedId}
                    onChange={handleChange}
                    context={{
                        onlyActive: true,
                        createEnabled: true,
                        defaultCreatePayload: {
                            type: 'INDIVIDUAL',
                            source: 'SMART_SELECT'
                        }
                    }}
                    placeholder="Nhập tên để tạo mới nếu chưa có..."
                />
            </div>

            <div className="p-4 bg-slate-100 rounded text-xs font-mono">
                Current Value: {selectedId || "(none)"}
            </div>
        </div>
    );
}
