"use client";

import * as React from "react";
import { AutocompleteFK } from "@/components/AutocompleteFK";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Providers } from "@/components/providers";

export default function AutocompleteFKDemo() {
    const [vehicleModelId, setVehicleModelId] = React.useState<number | null>(null);
    const [customerId, setCustomerId] = React.useState<number | null>(null);
    const [supplierId, setSupplierId] = React.useState<number | null>(null);
    const [partId, setPartId] = React.useState<number | null>(null);

    return (
        <Providers>
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">AutocompleteFK Demo</h1>
                    <p className="text-gray-600 mt-2">Demo component AutocompleteFK với các tính năng: search, pagination, quick create</p>
                </div>

                <div className="space-y-6">
                    {/* Vehicle Models */}
                    <Card className="p-6" data-testid="card-vehicle-models">
                        <h2 className="text-lg font-semibold mb-4">Dòng xe (Vehicle Models)</h2>
                        <div className="space-y-2">
                            <Label>Dòng xe *</Label>
                            <AutocompleteFK
                                data-testid="autocomplete-vehicle-models"
                                resource="master/vehicle-models"
                                value={vehicleModelId}
                                onChange={(id, item) => {
                                    setVehicleModelId(id);
                                    console.log("Selected vehicle model:", item);
                                }}
                                label="Dòng xe"
                                placeholder="Chọn dòng xe..."
                                required
                                canCreate={true}
                                createRoute="/master/vehicle-models/new"
                                filters={{ status: "ACTIVE" }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Selected ID: {vehicleModelId}</p>
                    </Card>

                    {/* Customers */}
                    <Card className="p-6" data-testid="card-customers">
                        <h2 className="text-lg font-semibold mb-4">Khách hàng (Customers)</h2>
                        <div className="space-y-2">
                            <Label>Khách hàng *</Label>
                            <AutocompleteFK
                                data-testid="autocomplete-customers"
                                resource="crm/customers"
                                value={customerId}
                                onChange={(id, item) => {
                                    setCustomerId(id);
                                    console.log("Selected customer:", item);
                                }}
                                label="Khách hàng"
                                placeholder="Chọn khách hàng..."
                                required
                                canCreate={true}
                                createRoute="/crm/customers/new"
                                displayField="name"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Selected ID: {customerId}</p>
                    </Card>

                    {/* Suppliers */}
                    <Card className="p-6" data-testid="card-suppliers">
                        <h2 className="text-lg font-semibold mb-4">Nhà cung cấp (Suppliers)</h2>
                        <div className="space-y-2">
                            <Label>Nhà cung cấp</Label>
                            <AutocompleteFK
                                data-testid="autocomplete-suppliers"
                                resource="master/suppliers"
                                value={supplierId}
                                onChange={(id, item) => {
                                    setSupplierId(id);
                                    console.log("Selected supplier:", item);
                                }}
                                label="Nhà cung cấp"
                                placeholder="Chọn nhà cung cấp..."
                                canCreate={true}
                                createRoute="/master/suppliers/new"
                                filters={{ status: "ACTIVE" }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Selected ID: {supplierId}</p>
                    </Card>

                    {/* Parts */}
                    <Card className="p-6" data-testid="card-parts">
                        <h2 className="text-lg font-semibold mb-4">Phụ tùng (Parts)</h2>
                        <div className="space-y-2">
                            <Label>Phụ tùng</Label>
                            <AutocompleteFK
                                data-testid="autocomplete-parts"
                                resource="master/parts"
                                value={partId}
                                onChange={(id, item) => {
                                    setPartId(id);
                                    console.log("Selected part:", item);
                                }}
                                label="Phụ tùng"
                                placeholder="Chọn phụ tùng..."
                                displayField="name"
                                searchFields={["name", "part_number"]}
                                canCreate={true}
                                createRoute="/master/parts/new"
                                filters={{ status: "ACTIVE" }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Selected ID: {partId}</p>
                    </Card>

                    {/* Feature Notes */}
                    <Card className="p-6 bg-blue-50 border-blue-200">
                        <h2 className="text-lg font-semibold mb-4 text-blue-900">Tính năng chính</h2>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>✅ <strong>Real-time search:</strong> Gõ từ khóa để tìm kiếm (debounce 300ms)</li>
                            <li>✅ <strong>Pagination:</strong> Tải thêm dữ liệu khi scroll xuống (5 items/page)</li>
                            <li>✅ <strong>Quick create:</strong> Tạo mới record khi không tìm thấy kết quả</li>
                            <li>✅ <strong>Keyboard navigation:</strong> Sử dụng mũi tên ↑/↓, Enter, Esc, Tab</li>
                            <li>✅ <strong>Performance:</strong> Response &lt;300ms, cache 5 phút</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
        </Providers>
    );
}
