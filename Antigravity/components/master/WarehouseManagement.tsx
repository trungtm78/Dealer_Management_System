"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

interface Warehouse {
  id: string;
  warehouse_code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager_id: string;
  manager_name?: string;
  status: string;
  capacity: number;
  current_stock: number;
  created_at: string;
  updated_at: string;
}

interface WarehouseFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  manager_id: string;
  status: string;
  capacity: number;
}

export function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    manager_id: "",
    status: "ACTIVE",
    capacity: 1000
  });

  const statuses = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" },
    { value: "MAINTENANCE", label: "Bảo trì" }
  ];

  const managers = [
    { id: "1", name: "Nguyễn Văn A" },
    { id: "2", name: "Trần Thị B" },
    { id: "3", name: "Lê Văn C" },
    { id: "4", name: "Phạm Thị D" },
    { id: "5", name: "Hoàng Văn E" },
    { id: "6", name: "Ngô Thị F" }
  ];

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/warehouses?${params}`);
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingWarehouse ? `/api/master/warehouses/${editingWarehouse.id}` : "/api/master/warehouses";
      const method = editingWarehouse ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchWarehouses();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu kho");
    }
  };

  const handleDelete = async (warehouse: Warehouse) => {
    if (!confirm(`Bạn có chắc muốn xóa ${warehouse.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/warehouses/${warehouse.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchWarehouses();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa kho");
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      address: warehouse.address,
      phone: warehouse.phone,
      email: warehouse.email,
      manager_id: warehouse.manager_id,
      status: warehouse.status,
      capacity: warehouse.capacity
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingWarehouse(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      manager_id: "",
      status: "ACTIVE",
      capacity: 1000
    });
    setIsModalOpen(false);
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    const searchMatch = searchTerm === "" || 
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.warehouse_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === "" || warehouse.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-gray-100 text-gray-800";
      case "MAINTENANCE": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "bg-red-100 text-red-800";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-[#E60012]" />
            Kho Hàng
          </h1>
          <p className="text-gray-600 mt-2">Quản lý kho hàng</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E60012]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm kho hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Mã</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tên</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Địa Chỉ</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Quản Lý</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sức Chứa</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trạng Thái</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{warehouse.warehouse_code}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{warehouse.name}</div>
                        <div className="text-sm text-gray-500">
                          {warehouse.email} | {warehouse.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {warehouse.address}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {warehouse.manager_name || warehouse.manager_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {warehouse.current_stock} / {warehouse.capacity} đơn vị
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCapacityColor(warehouse.current_stock, warehouse.capacity)}`}>
                          {Math.round((warehouse.current_stock / warehouse.capacity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(warehouse.status)}`}>
                        {warehouse.status === "ACTIVE" ? "Hoạt động" : warehouse.status === "MAINTENANCE" ? "Bảo trì" : "Ngưng hoạt động"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(warehouse)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(warehouse)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingWarehouse ? 'Chỉnh sửa Kho Hàng' : 'Thêm Kho Hàng Mới'}
                </h2>
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên Kho Hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Nhập tên kho hàng"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa Chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Địa chỉ đầy đủ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Số điện thoại"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="kho@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quản Lý <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.manager_id}
                      onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    >
                      <option value="">Chọn quản lý</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>{manager.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sức Chứa (đơn vị) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="1000"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng Thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-[#E60012]">
                    <Save className="w-4 h-4 mr-2" />
                    {editingWarehouse ? 'Cập Nhật' : 'Thêm Mới'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
