"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';

interface UOM {
  id: string;
  uom_code: string;
  name: string;
  description: string;
  status: string;
  category: string;
  base_unit: string;
  conversion_factor: number;
  created_at: string;
  updated_at: string;
}

interface UOMFormData {
  name: string;
  description: string;
  status: string;
  category: string;
  base_unit: string;
  conversion_factor: number;
}

export function UOMManagement() {
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUOM, setEditingUOM] = useState<UOM | null>(null);
  const [formData, setFormData] = useState<UOMFormData>({
    name: "",
    description: "",
    status: "ACTIVE",
    category: "GENERAL",
    base_unit: "",
    conversion_factor: 1
  });

  const statuses = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const categories = [
    { value: "GENERAL", label: "Chung" },
    { value: "LENGTH", label: "Chiều dài" },
    { value: "WEIGHT", label: "Trọng lượng" },
    { value: "VOLUME", label: "Thể tích" },
    { value: "AREA", label: "Diện tích" },
    { value: "TIME", label: "Thời gian" },
    { value: "TEMPERATURE", label: "Nhiệt độ" },
    { value: "CURRENCY", label: "Tiền tệ" }
  ];

  const baseUnits = [
    { value: "", label: "Không (Đơn vị gốc)" },
    { value: "1", label: "Cái" },
    { value: "2", label: "Kilogam" },
    { value: "3", label: "Mét" },
    { value: "4", label: "Lít" },
    { value: "5", label: "Mét vuông" },
    { value: "6", label: "Mét khối" },
    { value: "7", label: "Giờ" }
  ];

  useEffect(() => {
    fetchUOMs();
  }, []);

  const fetchUOMs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/uoms?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUoms(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching UOMs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingUOM ? `/api/master/uoms/${editingUOM.id}` : "/api/master/uoms";
      const method = editingUOM ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchUOMs();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu đơn vị tính");
    }
  };

  const handleDelete = async (uom: UOM) => {
    if (!confirm(`Bạn có chắc muốn xóa ${uom.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/uoms/${uom.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchUOMs();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa đơn vị tính");
    }
  };

  const handleEdit = (uom: UOM) => {
    setEditingUOM(uom);
    setFormData({
      name: uom.name,
      description: uom.description,
      status: uom.status,
      category: uom.category,
      base_unit: uom.base_unit,
      conversion_factor: uom.conversion_factor
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingUOM(null);
    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
      category: "GENERAL",
      base_unit: "",
      conversion_factor: 1
    });
    setIsModalOpen(false);
  };

  const filteredUOMs = uoms.filter(uom => {
    const searchMatch = searchTerm === "" || 
      uom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uom.uom_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uom.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === "" || uom.status === selectedStatus;
    const categoryMatch = selectedCategory === "" || uom.category === selectedCategory;

    return searchMatch && statusMatch && categoryMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "GENERAL": "bg-blue-100 text-blue-800",
      "LENGTH": "bg-green-100 text-green-800",
      "WEIGHT": "bg-purple-100 text-purple-800",
      "VOLUME": "bg-yellow-100 text-yellow-800",
      "AREA": "bg-indigo-100 text-indigo-800",
      "TIME": "bg-pink-100 text-pink-800",
      "TEMPERATURE": "bg-red-100 text-red-800",
      "CURRENCY": "bg-orange-100 text-orange-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-[#E60012]" />
            Đơn Vị Tính
          </h1>
          <p className="text-gray-600 mt-2">Quản lý đơn vị tính</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn vị tính..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Danh Mục</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Đơn Vị Gốc</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Hệ Số</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trạng Thái</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredUOMs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredUOMs.map((uom) => (
                  <tr key={uom.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{uom.uom_code}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{uom.name}</div>
                        <div className="text-sm text-gray-500">{uom.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(uom.category)}`}>
                        {uom.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {uom.base_unit ? `ID: ${uom.base_unit}` : "Đơn vị gốc"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Calculator className="w-4 h-4 text-gray-400" />
                        {uom.conversion_factor}x
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(uom.status)}`}>
                        {uom.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(uom)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(uom)}
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
                  {editingUOM ? 'Chỉnh sửa Đơn Vị Tính' : 'Thêm Đơn Vị Tính Mới'}
                </h2>
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên Đơn Vị Tính <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Nhập tên đơn vị tính"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô Tả
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Nhập mô tả"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đơn Vị Gốc
                    </label>
                    <select
                      value={formData.base_unit}
                      onChange={(e) => setFormData({ ...formData, base_unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    >
                      {baseUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hệ Số Quy Đổi
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.conversion_factor}
                      onChange={(e) => setFormData({ ...formData, conversion_factor: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="1.0"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-[#E60012]">
                    <Save className="w-4 h-4 mr-2" />
                    {editingUOM ? 'Cập Nhật' : 'Thêm Mới'}
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
