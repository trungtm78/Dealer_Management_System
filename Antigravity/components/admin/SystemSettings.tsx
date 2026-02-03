"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save,
  RefreshCw,
  Settings,
  Building,
  Mail,
  Shield,
  Database,
  Bell,
  Globe,
  Users
} from "lucide-react";

interface SystemConfig {
  general: {
    company_name: string;
    company_address: string;
    company_phone: string;
    company_email: string;
    tax_code: string;
    working_hours: string;
    currency: string;
    timezone: string;
    language: string;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
    enable_ssl: boolean;
  };
  security: {
    session_timeout: number;
    password_min_length: number;
    password_expire_days: number;
    max_login_attempts: number;
    enable_two_factor: boolean;
    log_retention_days: number;
  };
  backup: {
    auto_backup: boolean;
    backup_frequency: string;
    backup_time: string;
    backup_location: string;
    retention_days: number;
    compression_enabled: boolean;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    low_stock_alert: boolean;
    appointment_reminders: boolean;
    system_alerts: boolean;
  };
}

const MOCK_CONFIG: SystemConfig = {
  general: {
    company_name: "Honda Ô tô Cộng Hòa",
    company_address: "123 Nguyễn Huệ, Q1, TP.HCM",
    company_phone: "(028) 3822 8888",
    company_email: "info@hondach.info.vn",
    tax_code: "0301234567",
    working_hours: "08:00 - 18:00",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi-VN"
  },
  email: {
    smtp_host: "smtp.hondach.info.vn",
    smtp_port: 587,
    smtp_username: "noreply@hondach.info.vn",
    smtp_password: "********",
    from_email: "noreply@hondach.info.vn",
    from_name: "Honda Ô tô Cộng Hòa",
    enable_ssl: true
  },
  security: {
    session_timeout: 30,
    password_min_length: 8,
    password_expire_days: 90,
    max_login_attempts: 5,
    enable_two_factor: false,
    log_retention_days: 365
  },
  backup: {
    auto_backup: true,
    backup_frequency: "daily",
    backup_time: "22:00",
    backup_location: "/backups",
    retention_days: 30,
    compression_enabled: true
  },
  notifications: {
    email_notifications: true,
    sms_notifications: false,
    low_stock_alert: true,
    appointment_reminders: true,
    system_alerts: true
  }
};

const TIMEZONES = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok", 
  "Asia/Singapore",
  "UTC"
];

const LANGUAGES = [
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "en-US", label: "English" }
];

const CURRENCIES = [
  { value: "VND", label: "Việt Nam Đồng (VND)" },
  { value: "USD", label: "US Dollar (USD)" }
];

const BACKUP_FREQUENCIES = [
  { value: "hourly", label: "Hàng Giờ" },
  { value: "daily", label: "Hàng Ngày" },
  { value: "weekly", label: "Hàng Tuần" },
  { value: "monthly", label: "Hàng Tháng" }
];

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>(MOCK_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Cấu hình hệ thống đã được lưu thành công!");
    } catch (error) {
      alert("Lỗi khi lưu cấu hình: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Bạn có chắc chắn muốn khôi phục lại cấu hình mặc định?")) {
      setConfig(MOCK_CONFIG);
      alert("Đã khôi phục lại cấu hình mặc định!");
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cấu Hình Hệ Thống</h2>
          <p className="text-muted-foreground">
            Quản lý cài đặt và cấu hình hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Khôi Phục
          </Button>
          <Button className="bg-[#E60012] hover:bg-[#c50010]" onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Đang Lưu..." : "Lưu Cấu Hình"}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Tổng Quan</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Bảo Mật</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sao Lưu</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Thông Báo</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Công Ty</CardTitle>
              <CardDescription>
                Cấu hình thông tin cơ bản của công ty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Tên Công Ty</Label>
                  <Input
                    id="company-name"
                    value={config.general.company_name}
                    onChange={(e) => updateConfig("general", "company_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-code">Mã Số Thuế</Label>
                  <Input
                    id="tax-code"
                    value={config.general.tax_code}
                    onChange={(e) => updateConfig("general", "tax_code", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Địa Chỉ</Label>
                <Textarea
                  id="company-address"
                  value={config.general.company_address}
                  onChange={(e) => updateConfig("general", "company_address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Điện Thoại</Label>
                  <Input
                    id="company-phone"
                    value={config.general.company_phone}
                    onChange={(e) => updateConfig("general", "company_phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={config.general.company_email}
                    onChange={(e) => updateConfig("general", "company_email", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="working-hours">Giờ Làm Việc</Label>
                  <Input
                    id="working-hours"
                    value={config.general.working_hours}
                    onChange={(e) => updateConfig("general", "working_hours", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Đồng Tiền</Label>
                  <Select value={config.general.currency} onValueChange={(value) => updateConfig("general", "currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi Giờ</Label>
                  <Select value={config.general.timezone} onValueChange={(value) => updateConfig("general", "timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map(timezone => (
                        <SelectItem key={timezone} value={timezone}>{timezone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu Hình Email</CardTitle>
              <CardDescription>
                Thiết lập server SMTP để gửi email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    value={config.email.smtp_host}
                    onChange={(e) => updateConfig("email", "smtp_host", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={config.email.smtp_port}
                    onChange={(e) => updateConfig("email", "smtp_port", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input
                    id="smtp-username"
                    value={config.email.smtp_username}
                    onChange={(e) => updateConfig("email", "smtp_username", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={config.email.smtp_password}
                    onChange={(e) => updateConfig("email", "smtp_password", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={config.email.from_email}
                    onChange={(e) => updateConfig("email", "from_email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    value={config.email.from_name}
                    onChange={(e) => updateConfig("email", "from_name", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-ssl"
                  checked={config.email.enable_ssl}
                  onCheckedChange={(checked) => updateConfig("email", "enable_ssl", checked)}
                />
                <Label htmlFor="enable-ssl">Kích hoạt SSL/TLS</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu Hình Bảo Mật</CardTitle>
              <CardDescription>
                Thiết lập các tham số bảo mật hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Thời Hết Hết Phiên (phút)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={config.security.session_timeout}
                    onChange={(e) => updateConfig("security", "session_timeout", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-min-length">Độ Dài Mật Khẩu Tối Thiểu</Label>
                  <Input
                    id="password-min-length"
                    type="number"
                    value={config.security.password_min_length}
                    onChange={(e) => updateConfig("security", "password_min_length", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-expire">Hết Hạn Mật Khẩu (ngày)</Label>
                  <Input
                    id="password-expire"
                    type="number"
                    value={config.security.password_expire_days}
                    onChange={(e) => updateConfig("security", "password_expire_days", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Số Lần Đăng Nhập Tối Đa</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    value={config.security.max_login_attempts}
                    onChange={(e) => updateConfig("security", "max_login_attempts", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="log-retention">Giữ Lịch Sử (ngày)</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    value={config.security.log_retention_days}
                    onChange={(e) => updateConfig("security", "log_retention_days", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-two-factor"
                  checked={config.security.enable_two_factor}
                  onCheckedChange={(checked) => updateConfig("security", "enable_two_factor", checked)}
                />
                <Label htmlFor="enable-two-factor">Kích hoạt Xác Thực 2 Yếu Tố</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu Hình Sao Lưu</CardTitle>
              <CardDescription>
                Thiết lập lịch sao lưu và khôi phục dữ liệu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-backup"
                  checked={config.backup.auto_backup}
                  onCheckedChange={(checked) => updateConfig("backup", "auto_backup", checked)}
                />
                <Label htmlFor="auto-backup">Sao Lưu Tự Động</Label>
              </div>
              {config.backup.auto_backup && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Tần Suất</Label>
                      <Select value={config.backup.backup_frequency} onValueChange={(value) => updateConfig("backup", "backup_frequency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BACKUP_FREQUENCIES.map(freq => (
                            <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-time">Thời Gian</Label>
                      <Input
                        id="backup-time"
                        type="time"
                        value={config.backup.backup_time}
                        onChange={(e) => updateConfig("backup", "backup_time", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-location">Thư Mục Lưu Trữ</Label>
                  <Input
                    id="backup-location"
                    value={config.backup.backup_location}
                    onChange={(e) => updateConfig("backup", "backup_location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Giữ Dữ Liệu (ngày)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    value={config.backup.retention_days}
                    onChange={(e) => updateConfig("backup", "retention_days", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="compression-enabled"
                  checked={config.backup.compression_enabled}
                  onCheckedChange={(checked) => updateConfig("backup", "compression_enabled", checked)}
                />
                <Label htmlFor="compression-enabled">Nén Dữ Liệu Khi Sao Lưu</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu Hình Thông Báo</CardTitle>
              <CardDescription>
                Thiết lập các loại thông báo hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông Báo Email</Label>
                  <p className="text-sm text-muted-foreground">Kích hoạt gửi thông báo qua email</p>
                </div>
                <Switch
                  checked={config.notifications.email_notifications}
                  onCheckedChange={(checked) => updateConfig("notifications", "email_notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông Báo SMS</Label>
                  <p className="text-sm text-muted-foreground">Kích hoạt gửi thông báo qua SMS</p>
                </div>
                <Switch
                  checked={config.notifications.sms_notifications}
                  onCheckedChange={(checked) => updateConfig("notifications", "sms_notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cảnh Báo Hết Hàng</Label>
                  <p className="text-sm text-muted-foreground">Thông báo khi tồn kho thấp</p>
                </div>
                <Switch
                  checked={config.notifications.low_stock_alert}
                  onCheckedChange={(checked) => updateConfig("notifications", "low_stock_alert", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc Lịch Hẹn</Label>
                  <p className="text-sm text-muted-foreground">Tự động nhắc lịch hẹn dịch vụ</p>
                </div>
                <Switch
                  checked={config.notifications.appointment_reminders}
                  onCheckedChange={(checked) => updateConfig("notifications", "appointment_reminders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cảnh Báo Hệ Thống</Label>
                  <p className="text-sm text-muted-foreground">Thông báo lỗi và cảnh báo hệ thống</p>
                </div>
                <Switch
                  checked={config.notifications.system_alerts}
                  onCheckedChange={(checked) => updateConfig("notifications", "system_alerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}