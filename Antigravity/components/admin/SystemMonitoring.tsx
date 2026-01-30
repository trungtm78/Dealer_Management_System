"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  BarChart3,
  Users,
  Zap,
  HardDrive
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Mock Data ---

const SYSTEM_HEALTH = [
  { name: 'API Server', status: 'healthy', responseTime: 45, uptime: '99.9%' },
  { name: 'Database', status: 'healthy', responseTime: 12, uptime: '99.8%' },
  { name: 'Redis Cache', status: 'warning', responseTime: 89, uptime: '98.5%' },
  { name: 'File Storage', status: 'healthy', responseTime: 23, uptime: '99.7%' },
  { name: 'Email Service', status: 'error', responseTime: 0, uptime: '95.2%' },
];

const PERFORMANCE_METRICS = [
  { time: '00:00', cpu: 25, memory: 45, disk: 30 },
  { time: '04:00', cpu: 20, memory: 42, disk: 30 },
  { time: '08:00', cpu: 65, memory: 68, disk: 35 },
  { time: '12:00', cpu: 78, memory: 72, disk: 38 },
  { time: '16:00', cpu: 85, memory: 75, disk: 40 },
  { time: '20:00', cpu: 45, memory: 55, disk: 35 },
  { time: '24:00', cpu: 30, memory: 48, disk: 32 },
];

const ERROR_LOGS = [
  { time: '14:23', level: 'error', message: 'Database connection timeout', count: 3 },
  { time: '14:15', level: 'warning', message: 'High memory usage detected', count: 1 },
  { time: '14:10', level: 'error', message: 'Email service unavailable', count: 5 },
  { time: '13:45', level: 'info', message: 'Scheduled backup completed', count: 1 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getErrorLevelColor = (level: string) => {
  switch (level) {
    case 'error': return 'text-red-600 bg-red-50';
    case 'warning': return 'text-yellow-600 bg-yellow-50';
    case 'info': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export default function SystemMonitoring() {
  const healthyCount = SYSTEM_HEALTH.filter(s => s.status === 'healthy').length;
  const warningCount = SYSTEM_HEALTH.filter(s => s.status === 'warning').length;
  const errorCount = SYSTEM_HEALTH.filter(s => s.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Giám Sát Hệ Thống</h2>
          <p className="text-muted-foreground">
            Tình trạng hệ thống và hiệu suất thời gian thực
          </p>
        </div>
        <Button className="bg-[#E60012] hover:bg-[#c50010]">
          <BarChart3 className="mr-2 h-4 w-4" />
          Xuất Báo Cáo
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch Vụ Hoạt Động</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyCount}/{SYSTEM_HEALTH.length}</div>
            <p className="text-xs text-muted-foreground">
              {healthyCount === SYSTEM_HEALTH.length ? 'Tất cả đều hoạt động tốt' : `${warningCount} cảnh báo, ${errorCount} lỗi`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người Dùng Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +12% so với giờ thấp điểm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Bất thường +15%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38%</div>
            <p className="text-xs text-muted-foreground">
              245GB / 650GB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Performance Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hiệu Suất Hệ Thống (24h)</CardTitle>
            <CardDescription>CPU, Memory, Disk usage theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={PERFORMANCE_METRICS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#E60012" fill="#E60012" fillOpacity={0.3} />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#007ACC" fill="#007ACC" fillOpacity={0.3} />
                <Area type="monotone" dataKey="disk" stackId="1" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tình Trạng Dịch Vụ</CardTitle>
            <CardDescription>Trạng thái các dịch vụ chính</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SYSTEM_HEALTH.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Response: {service.responseTime}ms | Uptime: {service.uptime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(service.status)}`} />
                    <Badge variant={
                      service.status === 'healthy' ? 'default' : 
                      service.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {service.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Log Hệ Thống</CardTitle>
          <CardDescription>Các lỗi và cảnh báo gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ERROR_LOGS.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge className={getErrorLevelColor(log.level)}>
                    {log.level.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="font-medium">{log.message}</p>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {log.count} lần
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}