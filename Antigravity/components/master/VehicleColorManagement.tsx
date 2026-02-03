"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

interface VehicleColor {
  id: string;
  color_code: string;
  color_name: string;
  hex_code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface VehicleColorFormData {
  color_name: string;
  hex_code: string;
  status: string;
}

export function VehicleColorManagement() {
  const [colors, setColors] = useState<VehicleColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<VehicleColor | null>(null);
  const [formData, setFormData] = useState<VehicleColorFormData>({
    color_name: "",
    hex_code: "",
    status: "ACTIVE"
  });

  const statuses = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/vehicle-colors?${params}`);
      if (response.ok) {
        const data = await response.json();
        setColors(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vehicle colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingColor ? `/api/master/vehicle-colors/${editingColor.id}` : "/api/master/vehicle-colors";
      const method = editingColor ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchColors();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu màu xe");
    }
  };

  const handleDelete = async (color: VehicleColor) => {
    if (!confirm(`Bạn có chắc muốn xóa ${color.color_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/vehicle-colors/${color.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchColors();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa màu xe");
    }
  };

  const handleEdit = (color: VehicleColor) => {
    setEditingColor(color);
    setFormData({
      color_name: color.color_name,
      hex_code: color.hex_code,
      status: color.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingColor(null);
    setFormData({
      color_name: "",
      hex_code: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredColors = colors.filter(color => {
    const searchMatch = searchTerm === "" || 
      color.color_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.color_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === "" || color.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Palette className="w-8 h-8 text-[#E60012]" />
            Màu Xe
          </h1>
          <p className="text-gray-600 mt-2">Quản lý màu xe</p>
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
              placeholder="Tìm kiếm màu xe..."
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Mã Màu</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Xem Trước</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trạng Thái</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredColors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredColors.map((color) => (
                  <tr key={color.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{color.color_code}</td>
                    <td className="py-3 px-4 font-medium">{color.color_name}</td>
                    <td className="py-3 px-4 font-mono text-sm">{color.hex_code}</td>
                    <td className="py-3 px-4">
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: color.hex_code }}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(color.status)}`}>
                        {color.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(color)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(color)}
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
                  {editingColor ? 'Chỉnh sửa Màu Xe' : 'Thêm Màu Xe Mới'}
                </h2>
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên Màu Xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.color_name}
                      onChange={(e) => setFormData({ ...formData, color_name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Nhập tên màu xe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã Màu (Hex) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.hex_code}
                        onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                        placeholder="#000000"
                      />
                      {formData.hex_code && (
                        <div 
                          className="w-10 h-10 rounded border flex items-center justify-center" 
                          style={{ backgroundColor: formData.hex_code }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
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
                    {editingColor ? 'Cập Nhật' : 'Thêm Mới'}
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
