"use client";

import { useState } from 'react';
import { SmartSelect } from "@/components/SmartSelect";
import type { SelectDataSource } from "@/types/smart-select";
import { Save, Mail, Printer, ChevronDown, Gift, CreditCard, Calendar, FileText, Plus, X, Info, ChevronRight, Calculator, PieChart, TrendingUp, DollarSign, Settings, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SalesService } from "@/services/sales.service";

interface Promotion {
    id: string;
    name: string;
    value: number;
    desc: string;
    type: 'discount' | 'free' | 'finance' | 'voucher' | 'device' | 'service';
    customItem?: string;
}

const exteriorAccessories = [
    { id: 'body-kit', name: 'Body kit thể thao', price: 18500000, desc: 'Bộ body kit Honda chính hãng' },
    { id: 'spoiler', name: 'Cánh gió thể thao', price: 9500000, desc: 'Cánh gió carbon' },
    { id: 'chrome-kit', name: 'Bộ mạ chrome', price: 6000000, desc: 'Mạ chrome viền cửa' },
    { id: 'led-fog', name: 'Đèn LED gầm', price: 5500000, desc: 'Đèn LED chiếu sáng cao cấp' },
];

const interiorAccessories = [
    { id: 'floor-mat', name: 'Thảm lót sàn 5D', price: 4500000, desc: 'Thảm lót sàn cao cấp' },
    { id: 'leather-seat', name: 'Bọc ghế da Nappa', price: 15000000, desc: 'Da Nappa cao cấp' },
    { id: 'ambient-light', name: 'Đèn viền nội thất', price: 3500000, desc: 'Đèn LED 64 màu' },
    { id: 'armrest', name: 'Hộp tỳ tay trung tâm', price: 2500000, desc: 'Hộp đựng đồ tỳ tay' },
];

const techAccessories = [
    { id: 'camera-360', name: 'Camera 360 độ', price: 12000000, desc: 'Camera 360 cao cấp' },
    { id: 'dash-cam', name: 'Camera hành trình', price: 7500000, desc: 'Camera trước sau Full HD' },
    { id: 'android-box', name: 'Android Box', price: 8500000, desc: 'Màn hình Android giải trí' },
    { id: 'hud', name: 'Màn hình HUD', price: 6500000, desc: 'Hiển thị kính lái' },
];

const protectionAccessories = [
    { id: 'film-3m', name: 'Phim cách nhiệt 3M', price: 8500000, desc: 'Phim 3M chính hãng' },
    { id: 'ppf', name: 'Dán PPF toàn xe', price: 35000000, desc: 'PPF bảo vệ sơn' },
    { id: 'ceramic-coat', name: 'Phủ Ceramic Pro', price: 12000000, desc: 'Phủ ceramic 9H' },
    { id: 'undercoat', name: 'Phủ gầm chống rỉ', price: 4500000, desc: 'Phủ gầm cao su' },
];

const servicePackages = [
    { id: 'service-3times', name: 'Bảo dưỡng miễn phí 3 lần', price: 0, desc: 'Miễn phí 3 lần đầu', isFree: true },
    { id: 'service-5years', name: 'Gói bảo dưỡng 5 năm', price: 18000000, desc: 'Trọn gói 5 năm' },
    { id: 'warranty-ext', name: 'Bảo hành mở rộng 2 năm', price: 15000000, desc: 'Tổng 5 năm bảo hành' },
    { id: 'rescue-24h', name: 'Cứu hộ 24/7 (3 năm)', price: 6000000, desc: 'Cứu hộ khẩn cấp' },
];

const colors = [
    { id: 'red', name: 'Đỏ Passion', color: '#E31937' },
    { id: 'white', name: 'Trắng Ngọc Trai', color: '#FFFFFF' },
    { id: 'black', name: 'Đen Huyền Bí', color: '#000000' },
    { id: 'silver', name: 'Bạc Ánh Kim', color: '#C0C0C0' },
];

// DataSource for Customers
const customerDataSource: SelectDataSource = {
    search: async (req) => {
        const response = await fetch('/api/shared/search/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        });
        return response.json();
    }
};

// DataSource for Vehicle Models
const vehicleModelDataSource: SelectDataSource = {
    search: async (req) => {
        const response = await fetch('/api/shared/search/vehicle-models', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        });
        return response.json();
    }
};

export default function QuotationForm() {
    const router = useRouter();

    const [customerId, setCustomerId] = useState<string | undefined>(undefined);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedModel, setSelectedModel] = useState<number | null>(null);
    const [selectedVersion, setSelectedVersion] = useState('1.5 Turbo L');
    const [selectedColor, setSelectedColor] = useState('white');

    const accessories = [...exteriorAccessories, ...interiorAccessories, ...techAccessories, ...protectionAccessories];
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>(['service-3times']);
    const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('basic');

    const [errors, setErrors] = useState<{ name?: string, phone?: string }>({});

    const validatePhone = (phone: string) => {
        const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return regex.test(phone);
    };

    const validateForm = () => {
        const newErrors: { name?: string, phone?: string } = {};
        if (!customerName.trim()) newErrors.name = "Tên khách hàng là bắt buộc";
        if (!customerPhone.trim()) {
            newErrors.phone = "Số điện thoại là bắt buộc";
        } else if (!validatePhone(customerPhone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (VN)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [promotions, setPromotions] = useState<Promotion[]>([
        { id: 'promo-cash', name: 'Giảm giá tiền mặt', value: -10000000, desc: 'Giảm 10tr', type: 'discount' },
    ]);
    const [showAddPromotion, setShowAddPromotion] = useState(false);
    const [newPromoType, setNewPromoType] = useState('discount');
    const [newPromoName, setNewPromoName] = useState('');
    const [newPromoValue, setNewPromoValue] = useState('');

    const [actualCommission, setActualCommission] = useState<number>(5000000);
    const [discount, setDiscount] = useState<number>(0);

    const getBasePrice = () => {
        if (!selectedModel) return 0;
        const modelPriceMap: Record<number, number> = {
            1: 1109000000,
            2: 559000000,
            3: 730000000,
            4: 1319000000
        };
        return modelPriceMap[selectedModel] || 0;
    };

    const basePrice = getBasePrice();

    const manufacturerCost = basePrice * 0.88;
    const operatingCost = 5000000;
    const marketingCost = 2000000;

    const accessoriesTotal = accessories
        .filter(acc => selectedAccessories.includes(acc.id))
        .reduce((sum, acc) => sum + acc.price, 0);

    const servicesTotal = servicePackages
        .filter(srv => selectedServices.includes(srv.id))
        .reduce((sum, srv) => sum + srv.price, 0);

    const promotionValue = promotions
        .filter(promo => selectedPromotions.includes(promo.id))
        .reduce((sum, promo) => sum + promo.value, 0);

    const discountAmount = discount;

    const insurance = basePrice * 0.015;
    const registrationTax = basePrice * 0.1;
    const registration = 20000000;
    const otherFees = 3000000;

    const otrTotal = basePrice + accessoriesTotal + servicesTotal + insurance + registrationTax + registration + otherFees;
    const finalTotal = otrTotal + promotionValue - discountAmount;

    const totalRevenue = finalTotal;
    const accessoryCost = accessoriesTotal * 0.6;
    const serviceCost = servicesTotal * 0.7;
    const promotionCost = Math.abs(promotionValue);
    const discountCost = discountAmount;
    const commissionCost = actualCommission;

    const totalCost = manufacturerCost + accessoryCost + serviceCost + (insurance + registrationTax + registration + otherFees) + operatingCost + marketingCost + commissionCost;

    const grossProfit = totalRevenue - totalCost;
    const profitMargin = (grossProfit / (totalRevenue - (insurance + registrationTax + registration + otherFees))) * 100;

    const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

    const handleSaveQuote = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin nhập liệu");
            return;
        }

        try {
            const modelNameMap: Record<number, string> = {
                1: 'Honda CR-V',
                2: 'Honda City',
                3: 'Honda Civic',
                4: 'Honda Accord'
            };

            const result = await SalesService.createQuotation({
                customerId,
                customerName,
                customerPhone: customerPhone,
                customerEmail: undefined,
                model: modelNameMap[selectedModel || 1],
                version: selectedVersion,
                color: selectedColor,
                basePrice,
                accessories: selectedAccessories,
                services: selectedServices,
                accessoriesTotal,
                servicesTotal,
                insurance,
                registrationTax,
                registration,
                otherFees,
                discount: discountAmount,
                promotionValue,
                totalPrice: finalTotal,
                userId: 'user-1',
            });

            if (result.success) {
                toast.success(`Đã lưu báo giá ${result.data?.quoteNumber} vào database!`);
                router.push('/sales/quotations');
            } else {
                toast.error(result.error || 'Không thể lưu báo giá');
            }
        } catch (error) {
            console.error('Error saving quotation:', error);
            toast.error('Lỗi khi lưu báo giá');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Bán Hàng</span>
                            <ChevronRight className="w-4 h-4" />
                            <span>Tạo Báo Giá</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">BÁO GIÁ MỚI</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleSaveQuote}>
                            <Save className="w-4 h-4 mr-2" /> Lưu Báo Giá
                        </Button>
                        <Button variant="default" size="sm" className='bg-[#E60012] hover:bg-[#CC0010]' onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" /> In Báo Giá
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white border p-1 mb-6 rounded-lg w-full justify-start h-auto">
                        <TabsTrigger value="basic" className="px-6 py-2">1. Thông tin & Xe</TabsTrigger>
                        <TabsTrigger value="accessories" className="px-6 py-2">2. Phụ kiện & Dịch vụ</TabsTrigger>
                        <TabsTrigger value="analysis" className="px-6 py-2 flex items-center gap-2">
                            <PieChart className="w-4 h-4" /> 3. Phân tích Giá
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><div className='p-2 bg-blue-50 rounded-lg'><Info className='w-4 h-4 text-blue-600' /></div> Thông tin Khách hàng</h3>
                                <div className="space-y-4">
                                    <div>
                                        <SmartSelect
                                            dataSource={customerDataSource}
                                            value={customerId}
                                            onChange={(id, item) => {
                                                setCustomerId(id ? id.toString() : undefined);
                                                if (item) {
                                                    setCustomerName(item.label);
                                                    setCustomerPhone((item.meta as any)?.phone || (item.meta as any)?.mobile || "");
                                                }
                                            }}
                                            label="Khách hàng"
                                            placeholder="Tìm khách hàng..."
                                            required
                                            context={{ onlyActive: true }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Số điện thoại</Label>
                                            <Input placeholder="09xx..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input placeholder="example@email.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Nguồn khách hàng</Label>
                                        <Select defaultValue="showroom">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="showroom">Showroom (Walk-in)</SelectItem>
                                                <SelectItem value="facebook">Facebook Ads</SelectItem>
                                                <SelectItem value="google">Google Ads</SelectItem>
                                                <SelectItem value="referral">Giới thiệu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><div className='p-2 bg-red-50 rounded-lg'><Calculator className='w-4 h-4 text-red-600' /></div> Thông tin Xe</h3>
                                <div className="space-y-4">
                                    <div>
                                        <SmartSelect
                                            dataSource={vehicleModelDataSource}
                                            value={selectedModel}
                                            onChange={(id) => setSelectedModel(id as number | null)}
                                            label="Dòng xe"
                                            placeholder="Chọn dòng xe..."
                                            required
                                            context={{ onlyActive: true }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <Label>Phiên bản</Label>
                                        <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1.5 Turbo CVT">1.5 Turbo CVT</SelectItem>
                                                <SelectItem value="2.0 Hybrid">2.0 Hybrid</SelectItem>
                                                <SelectItem value="RS Sensing">RS Sensing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Màu sắc</Label>
                                        <div className="flex gap-3 mt-2">
                                            {colors.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setSelectedColor(c.id)}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: c.color }}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <span className="font-medium text-gray-600">Giá Niêm Yết:</span>
                                        <span className="text-xl font-bold text-[#E60012]">{formatPrice(basePrice)}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Card className="p-6 border-t-4 border-t-gray-800">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Ước tính lăn bánh (Tạm tính)</p>
                                    <h2 className="text-3xl font-bold text-gray-900">{formatPrice(otrTotal)}</h2>
                                </div>
                                <Button onClick={() => setActiveTab('accessories')}>Tiếp tục: Chọn Phụ kiện <ChevronRight className="w-4 h-4 ml-1" /></Button>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="accessories" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {[{ title: 'Ngoại thất', items: exteriorAccessories },
                                { title: 'Nội thất', items: interiorAccessories },
                                { title: 'Công nghệ', items: techAccessories },
                                ].map(group => (
                                    <Card key={group.title} className="p-4">
                                        <h4 className="font-semibold mb-3 border-b pb-2">{group.title}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {group.items.map(acc => (
                                                <div key={acc.id} className={`p-3 border rounded-lg flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedAccessories.includes(acc.id) ? 'border-red-500 bg-red-50' : ''}`}
                                                    onClick={() => {
                                                        if (selectedAccessories.includes(acc.id)) setSelectedAccessories(prev => prev.filter(id => id !== acc.id));
                                                        else setSelectedAccessories(prev => [...prev, acc.id]);
                                                    }}
                                                >
                                                    <Checkbox checked={selectedAccessories.includes(acc.id)} />
                                                    <div>
                                                        <p className="font-medium text-sm">{acc.name}</p>
                                                        <p className="text-red-600 font-bold text-sm">{formatPrice(acc.price)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <Card className="p-6 sticky top-24">
                                    <h3 className="font-bold text-lg mb-4">Tổng kết Phụ kiện & Dịch vụ</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phụ kiện ({selectedAccessories.length}):</span>
                                            <span className="font-bold">{formatPrice(accessoriesTotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dịch vụ ({selectedServices.length}):</span>
                                            <span className="font-bold">{formatPrice(servicesTotal)}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between text-base">
                                            <span className="font-bold">Tổng cộng:</span>
                                            <span className="font-bold text-[#E60012]">{formatPrice(accessoriesTotal + servicesTotal)}</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-6" onClick={() => setActiveTab('analysis')}>
                                        Xem Phân Tích Giá <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-gray-500" /> Thiết lập tham số tính toán
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label>Giảm giá trực tiếp (VNĐ)</Label>
                                        <CurrencyInput
                                            className="font-bold text-red-600 mt-1.5"
                                            value={discount}
                                            onChange={setDiscount}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Trừ vào giá bán cuối cùng</p>
                                    </div>
                                    <div>
                                        <Label>Ước tính Hoa hồng (VNĐ)</Label>
                                        <CurrencyInput
                                            className="font-bold mt-1.5"
                                            value={actualCommission}
                                            onChange={setActualCommission}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Chi phí hoa hồng nhân viên</p>
                                    </div>
                                    <div>
                                        <Label>Khuyến mãi khác</Label>
                                        <div className="text-sm font-bold mt-3 text-green-600">{formatPrice(Math.abs(promotionValue))}</div>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="p-6 border-l-4 border-l-blue-500">
                                    <h3 className="text-lg font-bold mb-4 text-blue-900">Doanh Thu (Revenue)</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                            <span>Giá xe (NIÊM YẾT)</span>
                                            <span className="font-bold">{formatPrice(basePrice)}</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                            <span>Phụ kiện & Dịch vụ</span>
                                            <span className="font-bold">{formatPrice(accessoriesTotal + servicesTotal)}</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                                            <span>Các loại phí (Hộ)</span>
                                            <span className="font-bold">{formatPrice(insurance + registrationTax + registration + otherFees)}</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-red-50 rounded text-red-700">
                                            <span>Giảm giá & KM</span>
                                            <span className="font-bold">-{formatPrice(discountAmount + Math.abs(promotionValue))}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between items-center">
                                            <span className="text-lg font-bold">TỔNG THU KHÁCH:</span>
                                            <span className="text-2xl font-bold text-blue-700">{formatPrice(finalTotal)}</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 border-l-4 border-l-orange-500">
                                    <h3 className="text-lg font-bold mb-4 text-orange-900">Lợi Nhuận Ước Tính (Gross Profit)</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Doanh thu thuần (Trừ phí hộ):</span>
                                            <span className="font-semibold">{formatPrice(finalTotal - (insurance + registrationTax + registration + otherFees))}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Tổng Chi Phí (Xe + Acc + Ops...):</span>
                                            <span className="font-semibold text-red-600">-{formatPrice(totalCost - (insurance + registrationTax + registration + otherFees))}</span>
                                        </div>

                                        <div className="my-4 p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                                            <p className="text-sm text-green-800 font-medium uppercase tracking-wide">Lợi Nhuận Gộp</p>
                                            <p className={`text-4xl font-black mt-1 ${grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {formatPrice(grossProfit)}
                                            </p>
                                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white text-sm font-bold shadow-sm">
                                                Margin: {profitMargin.toFixed(2)}%
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400 italic text-center">
                                            * Số liệu chỉ mang tính chất tham khảo dựa trên cấu hình chi phí tiêu chuẩn.
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
