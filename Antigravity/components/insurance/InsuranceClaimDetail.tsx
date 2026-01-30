"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Calendar, 
  User,
  Car,
  DollarSign,
  MapPin,
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  Paperclip,
  Send,
  Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// --- Mock Data ---

const CLAIM_DATA = {
  id: "CL-2024-001",
  contractNumber: "BH-2024-045",
  customer: {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyena@example.com"
  },
  vehicle: {
    make: "Honda",
    model: "CR-V",
    year: 2023,
    licensePlate: "51A-123.45",
    vin: "1HGBH41JXMN109186"
  },
  claimInfo: {
    incidentDate: "2024-01-15",
    incidentTime: "14:30",
    incidentLocation: "Ngã tư Lê Lợi - Nguyễn Huệ, Q.1, TP.HCM",
    incidentDescription: "Va chạm giao thông với xe phía trước khi đang di chuyển trong làn đường. Thiệt hại主要集中在 phía trước xe: cản trước, đèn pha, capô.",
    claimAmount: 25000000,
    estimatedRepairCost: 22000000,
    approvedAmount: 21000000,
    deductible: 1000000,
    status: "APPROVED",
    submittedDate: "2024-01-16",
    approvedDate: "2024-01-19",
    paymentDate: "2024-01-22"
  },
  documents: [
    {
      id: "DOC-001",
      name: "Biên bản hiện trường",
      type: "INCIDENT_REPORT",
      uploadDate: "2024-01-16",
      size: "1.2 MB",
      url: "/documents/cl-2024-001-incident-report.pdf",
      status: "APPROVED"
    },
    {
      id: "DOC-002",
      name: "Ảnh thiệt hại",
      type: "DAMAGE_PHOTOS",
      uploadDate: "2024-01-16",
      size: "3.5 MB",
      url: "/documents/cl-2024-001-photos.zip",
      status: "APPROVED"
    },
    {
      id: "DOC-003",
      name: "Báo giá sửa chữa",
      type: "REPAIR_QUOTE",
      uploadDate: "2024-01-17",
      size: "0.8 MB",
      url: "/documents/cl-2024-001-repair-quote.pdf",
      status: "APPROVED"
    },
    {
      id: "DOC-004",
      name: "Giấy tờ xe",
      type: "VEHICLE_DOCUMENTS",
      uploadDate: "2024-01-17",
      size: "2.1 MB",
      url: "/documents/cl-2024-001-vehicle-docs.pdf",
      status: "APPROVED"
    }
  ],
  assessment: {
    assessor: "Trần Thị B - Giám định viên Bảo Việt",
    assessmentDate: "2024-01-18",
    assessmentNotes: "Kiểm tra thực tế tại garage. Thiệt hại phù hợp với sự việc mô tả. Báo giá sửa chữa hợp lý. Khấu trừ hao mòn 10% cho một số bộ phận đã sử dụng.",
    damageAssessment: [
      { part: "Cản trước", damage: "Móp, trầy", repairCost: 3500000, approvedCost: 3200000 },
      { part: "Đèn pha trái", damage: "Vỡ", repairCost: 2800000, approvedCost: 2800000 },
      { part: "Capô", damage: "Móp", repairCost: 4200000, approvedCost: 3800000 },
      { part: "Lưới tản nhiệt", damage: "Cong vênh", repairCost: 1500000, approvedCost: 1350000 },
      { part: "Sơn sửa", damage: "Trầy rộng", repairCost: 10000000, approvedCost: 9850000 }
    ]
  },
  workflow: [
    {
      id: "WF-001",
      status: "SUBMITTED",
      date: "2024-01-16 09:15",
      user: "Nguyễn Văn A",
      action: "Nộp hồ sơ claim",
      description: "Khách hàng nộp đầy đủ hồ sơ ban đầu"
    },
    {
      id: "WF-002",
      status: "REVIEWING",
      date: "2024-01-16 14:30",
      user: "Lê Văn C",
      action: "Tiếp nhận hồ sơ",
      description: "Kiểm tra tính đầy đủ của hồ sơ"
    },
    {
      id: "WF-003",
      status: "REVIEWING",
      date: "2024-01-17 10:00",
      user: "Trần Thị B",
      action: "Giám định hiện trường",
      description: "Giám định viên đến hiện trường kiểm tra"
    },
    {
      id: "WF-004",
      status: "APPROVED",
      date: "2024-01-19 15:45",
      user: "Phạm D",
      action: "Phê duyệt claim",
      description: "Claim được phê duyệt với số tiền 21,000,000đ"
    },
    {
      id: "WF-005",
      status: "PAID",
      date: "2024-01-22 11:20",
      user: "System",
      action: "Thanh toán",
      description: "Số tiền 21,000,000đ đã được chuyển đến tài khoản khách hàng"
    }
  ],
  communications: [
    {
      id: "COM-001",
      date: "2024-01-16 10:30",
      type: "EMAIL",
      from: "system@honda.com",
      to: "nguyena@example.com",
      subject: "Tiếp nhận hồ sơ claim CL-2024-001",
      content: "Chúng tôi đã tiếp nhận hồ sơ claim của quý khách. Sẽ liên hệ trong 24h để thông báo lịch giám định."
    },
    {
      id: "COM-002",
      date: "2024-01-17 16:45",
      type: "PHONE",
      from: "Trần Thị B",
      to: "Nguyễn Văn A",
      subject: "Hẹn giám định hiện trường",
      content: "Điện thoại hẹn khách hàng lịch giám định vào ngày 18/01/2024 lúc 10:00"
    },
    {
      id: "COM-003",
      date: "2024-01-19 16:00",
      type: "EMAIL",
      from: "phamd@honda.com",
      to: "nguyena@example.com",
      subject: "Thông báo phê duyệt claim CL-2024-001",
      content: "Claim của quý khách đã được phê duyệt. Số tiền bồi thường: 21,000,000đ"
    }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUBMITTED': return 'bg-orange-500';
    case 'REVIEWING': return 'bg-blue-500';
    case 'APPROVED': return 'bg-green-500';
    case 'REJECTED': return 'bg-red-500';
    case 'PAID': return 'bg-green-600';
    case 'CLOSED': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED':
    case 'PAID': return 'default' as const;
    case 'REJECTED': return 'destructive' as const;
    case 'SUBMITTED':
    case 'REVIEWING': return 'secondary' as const;
    case 'CLOSED': return 'outline' as const;
    default: return 'outline' as const;
  }
};

const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'text-green-600';
    case 'PENDING': return 'text-orange-600';
    case 'REJECTED': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default function InsuranceClaimDetail() {
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success("Đã gửi tin nhắn đến khách hàng");
      setNewMessage("");
    }
  };

  const handleUploadDocument = () => {
    toast.success("Đang mở cửa sổ tải lên tài liệu");
  };

  const processingTime = Math.ceil(
    (new Date(CLAIM_DATA.claimInfo.approvedDate).getTime() - new Date(CLAIM_DATA.claimInfo.submittedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {CLAIM_DATA.id}
            </h2>
            <Badge variant={getStatusVariant(CLAIM_DATA.claimInfo.status)}>
              {CLAIM_DATA.claimInfo.status}
            </Badge>
            <Badge variant="outline">
              {processingTime} ngày xử lý
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Claim bảo hiểm cho xe Honda {CLAIM_DATA.vehicle.make} {CLAIM_DATA.vehicle.model}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            In Claim
          </Button>
          <Button className="bg-[#E60012] hover:bg-[#c50010]">
            <Send className="mr-2 h-4 w-4" />
            Gửi Thông Báo
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Tiền Claim</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E60012]">
              {CLAIM_DATA.claimInfo.claimAmount.toLocaleString()}đ
            </div>
            <p className="text-xs text-muted-foreground">
              Đã duyệt: {CLAIM_DATA.claimInfo.approvedAmount.toLocaleString()}đ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ngày Việc</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(CLAIM_DATA.claimInfo.incidentDate).toLocaleDateString('vi-VN')}
            </div>
            <p className="text-xs text-muted-foreground">
              {CLAIM_DATA.claimInfo.incidentTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách Hàng</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CLAIM_DATA.customer.name}</div>
            <p className="text-xs text-muted-foreground">
              {CLAIM_DATA.vehicle.licensePlate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hợp Đồng</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CLAIM_DATA.contractNumber}</div>
            <p className="text-xs text-muted-foreground">
              Mất phí: {CLAIM_DATA.claimInfo.deductible.toLocaleString()}đ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="documents">Tài Liệu</TabsTrigger>
          <TabsTrigger value="assessment">Giám Định</TabsTrigger>
          <TabsTrigger value="workflow">Quy Trình</TabsTrigger>
          <TabsTrigger value="communications">Liên Lạc</TabsTrigger>
          <TabsTrigger value="payment">Thanh Toán</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Chi Tiết Sự Việc</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Ngày giờ</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(CLAIM_DATA.claimInfo.incidentDate).toLocaleDateString('vi-VN')} 
                      {' '} 
                      {CLAIM_DATA.claimInfo.incidentTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Địa điểm</p>
                    <p className="text-sm text-muted-foreground">{CLAIM_DATA.claimInfo.incidentLocation}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Mô tả sự việc</p>
                  <p className="text-sm text-muted-foreground">
                    {CLAIM_DATA.claimInfo.incidentDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Claim Amount */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Chi Tiết Số Tiền</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Số tiền yêu cầu</p>
                    <p className="text-sm text-muted-foreground">
                      {CLAIM_DATA.claimInfo.claimAmount.toLocaleString()}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chi phí ước tính</p>
                    <p className="text-sm text-muted-foreground">
                      {CLAIM_DATA.claimInfo.estimatedRepairCost.toLocaleString()}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Số tiền duyệt</p>
                    <p className="text-sm text-muted-foreground">
                      {CLAIM_DATA.claimInfo.approvedAmount.toLocaleString()}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mất phí</p>
                    <p className="text-sm text-muted-foreground">
                      {CLAIM_DATA.claimInfo.deductible.toLocaleString()}đ
                    </p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm font-medium">Số tiền thực nhận</p>
                  <p className="text-lg font-bold text-green-600">
                    {(CLAIM_DATA.claimInfo.approvedAmount - CLAIM_DATA.claimInfo.deductible).toLocaleString()}đ
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tài Liệu Claim</CardTitle>
                  <CardDescription>
                    Các tài liệu đã nộp cho claim này
                  </CardDescription>
                </div>
                <Button onClick={handleUploadDocument}>
                  <Upload className="mr-2 h-4 w-4" />
                  Tải Lên Tài Liệu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CLAIM_DATA.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • Tải lên: {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDocumentStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Xem
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo Cáo Giám Định</CardTitle>
              <CardDescription>
                Kết quả giám định hiện trường và chi phí
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assessor Info */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Thông tin giám định</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Giám định viên:</strong> {CLAIM_DATA.assessment.assessor}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Ngày giám định:</strong> {new Date(CLAIM_DATA.assessment.assessmentDate).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* Assessment Notes */}
              <div>
                <h3 className="font-medium mb-2">Nhận xét giám định</h3>
                <p className="text-sm text-muted-foreground">
                  {CLAIM_DATA.assessment.assessmentNotes}
                </p>
              </div>

              {/* Damage Assessment */}
              <div>
                <h3 className="font-medium mb-3">Chi tiết thiệt hại và chi phí</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Bộ Phận</th>
                        <th className="text-left p-3 text-sm font-medium">Thiệt Hại</th>
                        <th className="text-right p-3 text-sm font-medium">Chi Phí Đề Xuất</th>
                        <th className="text-right p-3 text-sm font-medium">Chi Phí Duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLAIM_DATA.assessment.damageAssessment.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 text-sm">{item.part}</td>
                          <td className="p-3 text-sm">{item.damage}</td>
                          <td className="p-3 text-sm text-right">{item.repairCost.toLocaleString()}đ</td>
                          <td className="p-3 text-sm text-right font-medium">{item.approvedCost.toLocaleString()}đ</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="p-3 text-sm font-medium text-right">Tổng cộng</td>
                        <td className="p-3 text-sm font-medium text-right">
                          {CLAIM_DATA.assessment.damageAssessment.reduce((sum, item) => sum + item.repairCost, 0).toLocaleString()}đ
                        </td>
                        <td className="p-3 text-sm font-medium text-right">
                          {CLAIM_DATA.assessment.damageAssessment.reduce((sum, item) => sum + item.approvedCost, 0).toLocaleString()}đ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quy Trình Xử Lý</CardTitle>
              <CardDescription>
                Các bước xử lý claim từ lúc nộp đến hoàn tất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CLAIM_DATA.workflow.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs ${
                      index === CLAIM_DATA.workflow.length - 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{step.action}</h4>
                        <Badge variant={getStatusVariant(step.status)}>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.user} • {new Date(step.date).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch Sử Liên Lạc</CardTitle>
              <CardDescription>
                Các thông tin trao đổi với khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CLAIM_DATA.communications.map((comm) => (
                  <div key={comm.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline">{comm.type}</Badge>
                        <h4 className="font-medium">{comm.subject}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comm.date).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Từ:</strong> {comm.from}</p>
                      <p><strong>Đến:</strong> {comm.to}</p>
                      <p>{comm.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Message */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Gửi tin nhắn mới</h4>
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại liên lạc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="PHONE">Điện thoại</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button onClick={handleSendMessage} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Gửi Tin Nhắn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Thanh Toán</CardTitle>
              <CardDescription>
                Chi tiết thanh toán cho claim này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Summary */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Tóm tắt thanh toán</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Số tiền duyệt:</span>
                      <span className="font-medium">{CLAIM_DATA.claimInfo.approvedAmount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mất phí:</span>
                      <span className="font-medium">{CLAIM_DATA.claimInfo.deductible.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">Thực nhận:</span>
                      <span className="font-bold text-green-600">
                        {(CLAIM_DATA.claimInfo.approvedAmount - CLAIM_DATA.claimInfo.deductible).toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Thông tin thanh toán</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ngày duyệt:</span>
                      <span className="text-sm">
                        {new Date(CLAIM_DATA.claimInfo.approvedDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ngày thanh toán:</span>
                      <span className="text-sm">
                        {new Date(CLAIM_DATA.claimInfo.paymentDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Trạng thái:</span>
                      <Badge variant="default">Đã thanh toán</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                <div className="border rounded-lg p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Số tài khoản</Label>
                      <p className="text-sm text-muted-foreground">0123456789 - Vietcombank</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Chủ tài khoản</Label>
                      <p className="text-sm text-muted-foreground">NGUYEN VAN A</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  In Phiếu Thanh Toán
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu Thay Đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}