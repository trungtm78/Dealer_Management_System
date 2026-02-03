"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

interface InsuranceCompany {
  id: string;
  company_code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InsuranceCompanyFormData {
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

export function InsuranceCompanyManagement() {
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<InsuranceCompany | null>(null);
  const [formData, setFormData] = useState<InsuranceCompanyFormData>({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    status: "ACTIVE"
  });

  const statuses = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/insurance-companies?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching insurance companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCompany ? `/api/master/insurance-companies/${editingCompany.id}` : "/api/master/insurance-companies";
      const method = editingCompany ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCompanies();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu công ty bảo hiểm");
    }
  };

  const handleDelete = async (company: InsuranceCompany) => {
    if (!confirm(`Bạn có chắc muốn xóa ${company.company_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/insurance-companies/${company.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchCompanies();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa công ty bảo hiểm");
    }
  };

  const handleEdit = (company: InsuranceCompany) => {
    setEditingCompany(company);
    setFormData({
      company_name: company.company_name,
      contact_person: company.contact_person,
      phone: company.phone,
      email: company.email,
      address: company.address,
      status: company.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCompany(null);
    setFormData({
      company_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredCompanies = companies.filter(company => {
    const searchMatch = searchTerm === "" || 
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.company_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === "" || company.status === selectedStatus;

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
            <Shield className="w-8 h-8 text-[#E60012]" />
            Công Ty Bảo Hiểm
          </h1>
          <p className="text-gray-600 mt-2">Quản lý công ty bảo hiểm</p>
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
              placeholder="Tìm kiếm công ty bảo hiểm..."
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Người Liên Hệ</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Điện Thoại</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trạng Thái</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Đang tải...</td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{company.company_code}</td>
                    <td className="py-3 px-4 font-medium">{company.company_name}</td>
                    <td className="py-3 px-4">{company.contact_person}</td>
                    <td className="py-3 px-4">{company.phone}</td>
                    <td className="py-3 px-4">{company.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                        {company.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(company)}
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
                  {editingCompany ? 'Chỉnh sửa Công Ty Bảo Hiểm' : 'Thêm Công Ty Bảo Hiểm Mới'}
                </h2>
                <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên Công Ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Nhập tên công ty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Người Liên Hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                      placeholder="Người liên hệ"
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
                      placeholder="email@example.com"
                    />
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
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-[#E60012]">
                    <Save className="w-4 h-4 mr-2" />
                    {editingCompany ? 'Cập Nhật' : 'Thêm Mới'}
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
