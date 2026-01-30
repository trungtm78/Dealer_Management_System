"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  Globe, 
  Zap, 
  Shield, 
  Settings, 
  Plus,
  RotateCcw,
  Save,
  ExternalLink,
  Webhook
} from "lucide-react";
import { toast } from "sonner";

// --- Mock Data ---

const API_KEYS = [
  {
    id: "1",
    name: "Payment Gateway API",
    key: "pk_live_51N...",
    environment: "production",
    status: "active",
    lastUsed: "2024-01-30 14:23",
    rateLimit: "1000/hour",
    permissions: ["payments", "refunds"]
  },
  {
    id: "2", 
    name: "SMS Service API",
    key: "sms_prod_2024...",
    environment: "production",
    status: "active",
    lastUsed: "2024-01-30 13:45",
    rateLimit: "500/hour",
    permissions: ["sms", "notifications"]
  },
  {
    id: "3",
    name: "Email Service API",
    key: "mail_dev_2024...",
    environment: "development",
    status: "inactive",
    lastUsed: "2024-01-29 18:30",
    rateLimit: "200/hour",
    permissions: ["email", "templates"]
  }
];

const WEBHOOKS = [
  {
    id: "1",
    name: "Order Webhook",
    url: "https://api.honda.com/orders/webhook",
    events: ["order.created", "order.updated", "order.cancelled"],
    status: "active",
    lastTriggered: "2024-01-30 14:15"
  },
  {
    id: "2",
    name: "Customer Webhook",
    url: "https://crm.honda.com/customers/webhook",
    events: ["customer.created", "customer.updated"],
    status: "active",
    lastTriggered: "2024-01-30 13:30"
  }
];

const RATE_LIMITS = [
  { endpoint: "/api/customers", limit: 1000, window: "1h", current: 450 },
  { endpoint: "/api/quotations", limit: 500, window: "1h", current: 120 },
  { endpoint: "/api/inventory", limit: 2000, window: "1h", current: 890 },
  { endpoint: "/api/admin", limit: 100, window: "1h", current: 25 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'inactive': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getEnvironmentColor = (env: string) => {
  switch (env) {
    case 'production': return 'bg-red-500';
    case 'development': return 'bg-blue-500';
    case 'staging': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

export default function ApiConfiguration() {
  const [activeTab, setActiveTab] = useState("api-keys");

  const handleGenerateKey = () => {
    toast.success("API key mới đã được tạo");
  };

  const handleRotateKey = (keyName: string) => {
    toast.success(`API key ${keyName} đã được rotate`);
  };

  const handleSaveRateLimit = () => {
    toast.success("Cấu hình rate limit đã được lưu");
  };

  const handleSaveWebhook = () => {
    toast.success("Cấu hình webhook đã được lưu");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cấu Hình API</h2>
          <p className="text-muted-foreground">
            Quản lý API keys, rate limits và webhooks
          </p>
        </div>
        <Button className="bg-[#E60012] hover:bg-[#c50010]">
          <Save className="mr-2 h-4 w-4" />
          Lưu Cấu Hình
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="rate-limits" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Rate Limits</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center space-x-2">
            <Webhook className="h-4 w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Quản lý các khóa API cho các dịch vụ bên thứ ba
                  </CardDescription>
                </div>
                <Button onClick={handleGenerateKey}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {API_KEYS.map((key) => (
                  <div key={key.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{key.name}</h3>
                          <Badge variant="outline">{key.environment}</Badge>
                          <Badge 
                            variant={key.status === 'active' ? 'default' : 'secondary'}
                          >
                            {key.status}
                          </Badge>
                        </div>
                        <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                          {key.key}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Rate Limit: {key.rateLimit}</p>
                          <p>Last Used: {key.lastUsed}</p>
                          <p>Permissions: {key.permissions.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRotateKey(key.name)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Rotate
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Limits Tab */}
        <TabsContent value="rate-limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cấu Hình Rate Limits</CardTitle>
              <CardDescription>
                Giới hạn truy cập API cho từng endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RATE_LIMITS.map((limit, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div>
                        <Label className="text-sm font-medium">Endpoint</Label>
                        <p className="font-mono text-sm">{limit.endpoint}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Limit</Label>
                        <Input 
                          defaultValue={limit.limit} 
                          className="w-24"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Window</Label>
                        <Input 
                          defaultValue={limit.window}
                          className="w-20"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Current Usage</Label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#E60012] h-2 rounded-full"
                              style={{ width: `${(limit.current / limit.limit) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {limit.current}/{limit.limit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveRateLimit}>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu Thay Đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Webhook Endpoints</CardTitle>
                  <CardDescription>
                    Cấu hình các endpoint nhận webhook notification
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {WEBHOOKS.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{webhook.name}</h3>
                          <p className="font-mono text-sm text-muted-foreground">
                            {webhook.url}
                          </p>
                        </div>
                        <Badge 
                          variant={webhook.status === 'active' ? 'default' : 'secondary'}
                        >
                          {webhook.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Events</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {webhook.events.map((event, index) => (
                            <Badge key={index} variant="outline">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Last Triggered: {webhook.lastTriggered}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveWebhook}>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu Cấu Hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}