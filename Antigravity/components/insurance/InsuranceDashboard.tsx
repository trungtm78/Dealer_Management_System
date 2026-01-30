"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  BarChart3,
  Plus
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

// --- Mock Data ---

const INSURANCE_KPI_DATA = [
  { label: "Tổng Hợp Đồng", value: 1247, trend: "+12.5%", icon: FileText, color: "text-blue-600" },
  { label: "Đang Hiệu Lực", value: 1056, trend: "+8.3%", icon: CheckCircle, color: "text-green-600" },
  { label: "Sắp Hết Hạn", value: 45, trend: "Cần gia hạn", icon: Clock, color: "text-orange-600" },
  { label: "Đang Xử Lý", value: 23, trend: "+5", icon: AlertTriangle, color: "text-red-600" },
];

const PREMIUM_REVENUE = [
  { month: "T1", premium: 285000000, claims: 45000000 },
  { month: "T2", premium: 320000000, claims: 52000000 },
  { month: "T3", premium: 295000000, claims: 38000000 },
  { month: "T4", premium: 350000000, claims: 61000000 },
  { month: "T5", premium: 380000000, claims: 55000000 },
  { month: "T6", premium: 420000000, claims: 48000000 },
];

const PROVIDER_DISTRIBUTION = [
  { name: "Bảo Việt", value: 35, color: "#E60012" },
  { name: "PVI", value: 28, color: "#007ACC" },
  { name: "Prudential", value: 20, color: "#FFBB28" },
  { name: "Manulife", value: 12, color: "#00C49F" },
  { name: "Khác", value: 5, color: "#888888" },
];

const RENEWAL_ALERTS = [
  { 
    id: "1", 
    contractNumber: "BH-2024-001", 
    customerName: "Nguyễn Văn A", 
    vehicle: "Honda CR-V", 
    expiryDate: "2024-02-15",
    daysLeft: 16,
    premium: 12500000
  },
  { 
    id: "2", 
    contractNumber: "BH-2024-002", 
    customerName: "Trần Thị B", 
    vehicle: "Honda Civic", 
    expiryDate: "2024-02-20",
    daysLeft: 21,
    premium: 9800000
  },
  { 
    id: "3", 
    contractNumber: "BH-2024-003", 
    customerName: "Lê Văn C", 
    vehicle: "Honda HR-V", 
    expiryDate: "2024-02-28",
    daysLeft: 29,
    premium: 11200000
  },
  { 
    id: "4", 
    contractNumber: "BH-2024-004", 
    customerName: "Phạm D", 
    vehicle: "Honda City", 
    expiryDate: "2024-03-05",
    daysLeft: 35,
    premium: 8500000
  },
  { 
    id: "5", 
    contractNumber: "BH-2024-005", 
    customerName: "Hoàng E", 
    vehicle: "Honda Accord", 
    expiryDate: "2024-03-10",
    daysLeft: 40,
    premium: 15800000
  },
];

const RECENT_CLAIMS = [
  {
    id: "CL-2024-001",
    contractNumber: "BH-2024-045",
    customerName: "Nguyễn Văn A",
    claimAmount: 25000000,
    status: "APPROVED",
    submitDate: "2024-01-28",
    processingTime: "3 ngày"
  },
  {
    id: "CL-2024-002",
    contractNumber: "BH-2024-089",
    customerName: "Trần Thị B",
    claimAmount: 18000000,
    status: "REVIEWING",
    submitDate: "2024-01-29",
    processingTime: "1 ngày"
  },
  {
    id: "CL-2024-003",
    contractNumber: "BH-2024-123",
    customerName: "Lê Văn C",
    claimAmount: 35000000,
    status: "SUBMITTED",
    submitDate: "2024-01-30",
    processingTime: "0 ngày"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-500';
    case 'EXPIRED': return 'bg-red-500';
    case 'PENDING': return 'bg-yellow-500';
    case 'APPROVED': return 'bg-green-500';
    case 'REVIEWING': return 'bg-blue-500';
    case 'SUBMITTED': return 'bg-orange-500';
    case 'REJECTED': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'ACTIVE':
    case 'APPROVED': return 'default' as const;
    case 'EXPIRED':
    case 'REJECTED': return 'destructive' as const;
    case 'PENDING':
    case 'REVIEWING':
    case 'SUBMITTED': return 'secondary' as const;
    default: return 'outline' as const;
  }
};

const getUrgencyColor = (daysLeft: number) => {
  if (daysLeft <= 7) return 'text-red-600';
  if (daysLeft <= 30) return 'text-orange-600';
  return 'text-yellow-600';
};

export default function InsuranceDashboard() {
  const totalActiveContracts = INSURANCE_KPI_DATA.find(kpi => kpi.label === "Đang Hiệu Lực")?.value || 0;
  const totalExpiringSoon = INSURANCE_KPI_DATA.find(kpi => kpi.label === "Sắp Hết Hạn")?.value || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Bảo Hiểm</h2>
          <p className="text-muted-foreground">
            Tổng quan hợp đồng và claims bảo hiểm
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Xuất Báo Cáo
          </Button>
          <Button className="bg-[#E60012] hover:bg-[#c50010]">
            <Plus className="mr-2 h-4 w-4" />
            Hợp Đồng Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {INSURANCE_KPI_DATA.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Premium vs Claims Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh Thu & Chi Trả (6 tháng)</CardTitle>
            <CardDescription>So sánh phí bảo hiểm và chi trả claims</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={PREMIUM_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString() + ' VND'} />
                <Legend />
                <Area type="monotone" dataKey="premium" stackId="1" stroke="#E60012" fill="#E60012" fillOpacity={0.6} name="Phí Bảo Hiểm" />
                <Area type="monotone" dataKey="claims" stackId="2" stroke="#007ACC" fill="#007ACC" fillOpacity={0.6} name="Chi Trả Claims" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Provider Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Công Ty Bảo Hiểm</CardTitle>
            <CardDescription>Phân bố hợp đồng theo nhà cung cấp</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={PROVIDER_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PROVIDER_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Alerts & Recent Claims */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Renewal Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Cảnh Báo Gia Hạn</CardTitle>
            <CardDescription>
              {totalExpiringSoon} hợp đồng cần gia hạn trong 30 ngày
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RENEWAL_ALERTS.slice(0, 5).map((alert) => (
                <div key={alert.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{alert.contractNumber}</h4>
                        <Badge variant="outline">{alert.customerName}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        Hết hạn: {new Date(alert.expiryDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getUrgencyColor(alert.daysLeft)}`}>
                        Còn {alert.daysLeft} ngày
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {alert.premium.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                Xem tất cả {totalExpiringSoon} cảnh báo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Claims */}
        <Card>
          <CardHeader>
            <CardTitle>Claims Gần Đây</CardTitle>
            <CardDescription>
              Các yêu cầu bồi thường đang xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_CLAIMS.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{claim.id}</h4>
                        <Badge variant={getStatusVariant(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{claim.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        Hợp đồng: {claim.contractNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#E60012]">
                        {claim.claimAmount.toLocaleString()}đ
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {claim.processingTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                Xem tất cả claims
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉ Số Hiệu Suất</CardTitle>
          <CardDescription>
            Các metrics quan trọng của phòng bảo hiểm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E60012]">84.6%</div>
              <p className="text-sm text-muted-foreground">Tỷ lệ Gia Hạn</p>
              <p className="text-xs text-green-600">+2.3% so với Q trước</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#007ACC]">15.2%</div>
              <p className="text-sm text-muted-foreground">Tỷ lệ Claim</p>
              <p className="text-xs text-green-600">-1.8% so với Q trước</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FFBB28]">3.2 ngày</div>
              <p className="text-sm text-muted-foreground">Thời Gian Xử Lý</p>
              <p className="text-xs text-green-600">-0.8 ngày so với Q trước</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00C49F]">92.8%</div>
              <p className="text-sm text-muted-foreground">Hài Lòng Khách Hàng</p>
              <p className="text-xs text-green-600">+1.5% so với Q trước</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}