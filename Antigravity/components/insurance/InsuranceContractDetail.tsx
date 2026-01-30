"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Calendar, 
  User,
  Car,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Edit,
  Download,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// --- Mock Data ---

const CONTRACT_DATA = {
  id: "1",
  contractNumber: "BH-2024-001",
  customer: {
    id: "CUST-001",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyena@example.com",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    type: "INDIVIDUAL"
  },
  vehicle: {
    vin: "1HGBH41JXMN109186",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    color: "Trắng",
    licensePlate: "51A-123.45"
  },
  policy: {
    provider: "Bảo Việt",
    policyNumber: "BV-PH-2024-001234",
    policyType: "Bảo hiểm vật chất xe",
    coverageAmount: 850000000,
    premium: 12500000,
    startDate: "2023-02-15",
    endDate: "2024-02-15",
    status: "ACTIVE",
    renewalPremium: 13200000
  },
  coverage: {
    mainCoverages: [
      { name: "Tai nạn bên ngoài", amount: 850000000, deductible: 1000000 },
      { name: "Cháy nổ", amount: 850000000, deductible: 1000000 },
      { name: "Mất cắp toàn bộ", amount: 850000000, deductible: 1000000 },
      { name: "Thiên tai", amount: 850000000, deductible: 1000000 }
    ],
    additionalCoverages: [
      { name: "Tai nạn người ngồi trên xe", amount: 100000000, premium: 1500000 },
      { name: "Tai nạn bên ngoài về người", amount: 50000000, premium: 500000 }
    ]
  },
  documents: [
    {
      id: "DOC-001",
      name: "Giấy chứng nhận bảo hiểm",
      type: "POLICY_CERTIFICATE",
      uploadDate: "2023-02-15",
      size: "2.1 MB",
      url: "/documents/bh-2024-001-certificate.pdf"
    },
    {
      id: "DOC-002",
      name: "Điều khoản bảo hiểm",
      type: "TERMS_AND_CONDITIONS",
      uploadDate: "2023-02-15",
      size: "1.8 MB",
      url: "/documents/bh-2024-001-terms.pdf"
    },
    {
      id: "DOC-003",
      name: "Hóa đơn phí bảo hiểm",
      type: "INVOICE",
      uploadDate: "2023-02-15",
      size: "0.5 MB",
      url: "/documents/bh-2024-001-invoice.pdf"
    }
  ],
  history: [
    {
      id: "HIST-001",
      date: "2023-02-15",
      action: "Tạo hợp đồng mới",
      user: "Nguyễn Thị B",
      details: "Khởi tạo hợp đồng bảo hiểm cho Honda CR-V"
    },
    {
      id: "HIST-002",
      date: "2023-08-20",
      action: "Cập nhật thông tin",
      user: "Trần Văn C",
      details: "Cập nhật địa chỉ khách hàng"
    },
    {
      id: "HIST-003",
      date: "2024-01-15",
      action: "Gửi thông báo gia hạn",
      user: "System",
      details: "Tự động gửi email thông báo gia hạn"
    }
  ],
  claims: [
    {
      id: "CL-2024-001",
      date: "2023-11-15",
      amount: 25000000,
      status: "APPROVED",
      description: "Va chạm giao thông - Thiệt hại phía trước",
      processingTime: "3 ngày"
    },
    {
      id: "CL-2023-045",
      date: "2023-06-20",
      amount: 15000000,
      status: "APPROVED",
      description: "Trầy xước thân xe",
      processingTime: "2 ngày"
    }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-500';
    case 'EXPIRED': return 'bg-red-500';
    case 'PENDING': return 'bg-yellow-500';
    case 'CANCELLED': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'default' as const;
    case 'EXPIRED': 
    case 'CANCELLED': return 'destructive' as const;
    case 'PENDING': return 'secondary' as const;
    default: return 'outline' as const;
  }
};

export default function InsuranceContractDetail() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleRenew = () => {
    toast.success("Đã gửi yêu cầu gia hạn hợp đồng");
  };

  const handleDownload = (docName: string) => {
    toast.success(`Đang tải xuống ${docName}`);
  };

  const daysUntilExpiry = Math.ceil(
    (new Date(CONTRACT_DATA.policy.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {CONTRACT_DATA.contractNumber}
            </h2>
            <Badge variant={getStatusVariant(CONTRACT_DATA.policy.status)}>
              {CONTRACT_DATA.policy.status}
            </Badge>
            {daysUntilExpiry <= 30 && (
              <Badge variant="secondary" className="text-orange-600">
                Sắp hết hạn
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Hợp đồng bảo hiểm xe Honda {CONTRACT_DATA.vehicle.model} {CONTRACT_DATA.vehicle.year}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh Sửa
          </Button>
          <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleRenew}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Gia Hạn
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Hợp Đồng</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CONTRACT_DATA.contractNumber}</div>
            <p className="text-xs text-muted-foreground">
              {CONTRACT_DATA.policy.provider}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời Hạn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysUntilExpiry} ngày</div>
            <p className="text-xs text-muted-foreground">
              Hết hạn: {new Date(CONTRACT_DATA.policy.endDate).toLocaleDateString('vi-VN')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phí Bảo Hiểm</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CONTRACT_DATA.policy.premium.toLocaleString()}đ
            </div>
            <p className="text-xs text-muted-foreground">
              Gia hạn: {CONTRACT_DATA.policy.renewalPremium.toLocaleString()}đ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Tiền BH</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(CONTRACT_DATA.policy.coverageAmount / 1000000).toFixed(0)}M đ
            </div>
            <p className="text-xs text-muted-foreground">
              Mức bảo hiểm tối đa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="coverage">Quyền Lợi</TabsTrigger>
          <TabsTrigger value="documents">Tài Liệu</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="history">Lịch Sử</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Thông Tin Khách Hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Họ và Tên</p>
                    <p className="text-sm text-muted-foreground">{CONTRACT_DATA.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mã KH</p>
                    <p className="text-sm text-muted-foreground">{CONTRACT_DATA.customer.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Điện Thoại</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {CONTRACT_DATA.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {CONTRACT_DATA.customer.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Địa Chỉ</p>
                  <p className="text-sm text-muted-foreground flex items-start">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                    {CONTRACT_DATA.customer.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>Thông Tin Xe</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Hãng/Xe</p>
                    <p className="text-sm text-muted-foreground">
                      {CONTRACT_DATA.vehicle.make} {CONTRACT_DATA.vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Năm SX</p>
                    <p className="text-sm text-muted-foreground">{CONTRACT_DATA.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Màu Xe</p>
                    <p className="text-sm text-muted-foreground">{CONTRACT_DATA.vehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Biển Số</p>
                    <p className="text-sm text-muted-foreground">{CONTRACT_DATA.vehicle.licensePlate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Số Khung (VIN)</p>
                  <p className="text-sm font-mono text-muted-foreground">{CONTRACT_DATA.vehicle.vin}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Coverage Tab */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chi Tiết Quyền Lợi Bảo Hiểm</CardTitle>
              <CardDescription>
                Các quyền lợi chính và bổ sung của hợp đồng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Coverages */}
              <div>
                <h3 className="font-semibold mb-3">Quyền Lợi Chính</h3>
                <div className="space-y-3">
                  {CONTRACT_DATA.coverage.mainCoverages.map((coverage, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{coverage.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Số tiền bảo hiểm: {coverage.amount.toLocaleString()}đ
                          </p>
                        </div>
                        <Badge variant="outline">
                          Mất phí: {coverage.deductible.toLocaleString()}đ
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Coverages */}
              <div>
                <h3 className="font-semibold mb-3">Quyền Lợi Bổ Sung</h3>
                <div className="space-y-3">
                  {CONTRACT_DATA.coverage.additionalCoverages.map((coverage, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{coverage.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Phí bổ sung: {coverage.premium.toLocaleString()}đ/năm
                          </p>
                        </div>
                        <Badge variant="outline">
                          {coverage.amount.toLocaleString()}đ
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài Liệu Hợp Đồng</CardTitle>
              <CardDescription>
                Các tài liệu liên quan đến hợp đồng bảo hiểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CONTRACT_DATA.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • Tải lên: {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(doc.name)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch Sử Claims</CardTitle>
              <CardDescription>
                Các lần yêu cầu bồi thường của hợp đồng này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CONTRACT_DATA.claims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{claim.id}</h4>
                          <Badge variant={getStatusVariant(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{claim.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Ngày xảy ra: {new Date(claim.date).toLocaleDateString('vi-VN')} • 
                          Thời gian xử lý: {claim.processingTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#E60012]">
                          {claim.amount.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch Sử Hợp Đồng</CardTitle>
              <CardDescription>
                Các thay đổi và sự kiện liên quan đến hợp đồng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CONTRACT_DATA.history.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <History className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.action}</h4>
                            <p className="text-sm text-muted-foreground">{event.details}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.user} • {new Date(event.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}