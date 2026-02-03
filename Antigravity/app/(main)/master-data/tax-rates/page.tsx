"use client"

import { useState, useEffect } from 'react';
import { Percent } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { TaxRate, TaxRateFormData } from '@/types/master-data.types';

export default function TaxRatesPage() {
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);
  const [formData, setFormData] = useState<TaxRateFormData>({
    tax_code: "",
    tax_name: "",
    tax_type: "",
    rate_percent: 0,
    effective_from: "",
    effective_to: null,
    description: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const taxTypes: FilterOption[] = [
    { value: "VAT", label: "VAT" },
    { value: "REGISTRATION", label: "Lệ Đăng Kiểm" },
    { value: "EXCISE", label: "Thuế Thu Nhập Khẩu" },
    { value: "SPECIAL_CONSUMPTION", label: "Thuế Đặc Biệt" },
    { value: "IMPORT_DUTY", label: "Thuế Nhập Khẩu" }
  ];

  const columns: Column<TaxRate>[] = [
    { key: "tax_code", label: "Mã Thuế" },
    { key: "tax_name", label: "Tên Thuế" },
    {
      key: "tax_type",
      label: "Loại Thuế",
      render: (value) => {
        const typeColors: Record<string, string> = {
          VAT: "bg-blue-100 text-blue-800",
          REGISTRATION: "bg-purple-100 text-purple-800",
          EXCISE: "bg-green-100 text-green-800",
          SPECIAL_CONSUMPTION: "bg-orange-100 text-orange-800",
          IMPORT_DUTY: "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: "rate_percent",
      "label": "Tỷ Lệ (%)",
      render: (value) => `${value}%`
    },
    {
      key: "effective_from",
      label: "Hiệu Lực Từ",
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'
    },
    {
      key: "effective_to",
      label: "Hiệu Lực Đến",
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : 'Vĩnh Viễn'
    },
    {
      key: "status",
      label: "Trạng Thái",
      render: (value) => {
        const statusColor = value === "ACTIVE" 
          ? "bg-green-100 text-green-800" 
          : "bg-gray-100 text-gray-800";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {value === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
          </span>
        );
      }
    }
  ];

  const formFields: FormField[] = [
    {
      name: "tax_name",
      label: "Tên Thuế",
      type: "text",
      required: true,
      placeholder: "Nhập tên thuế",
      className: "col-span-2"
    },
    {
      name: "tax_code",
      label: "Mã Thuế",
      type: "text",
      required: true,
      placeholder: "Nhập mã thuế"
    },
    {
      name: "tax_type",
      label: "Loại Thuế",
      type: "select",
      required: true,
      options: taxTypes
    },
    {
      name: "rate_percent",
      label: "Tỷ Lệ (%)",
      type: "number",
      required: true,
      placeholder: "10",
      min: 0,
      max: 100
    },
    {
      name: "effective_from",
      label: "Hiệu Lực Từ",
      type: "date",
      required: true
    },
    {
      name: "effective_to",
      label: "Hiệu Lực Đến",
      type: "date"
    },
    {
      name: "description",
      label: "Mô Tả",
      type: "textarea",
      placeholder: "Nhập mô tả",
      className: "col-span-2"
    },
    {
      name: "status",
      label: "Trạng Thái",
      type: "select",
      required: true,
      options: statuses
    }
  ];

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/tax-rates?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRates(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching tax rates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingRate ? `/api/master/tax-rates/${editingRate.id}` : "/api/master/tax-rates";
      const method = editingRate ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchRates();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu thuế");
    }
  };

  const handleDelete = async (rate: TaxRate) => {
    if (!confirm(`Bạn có chắc muốn xóa ${rate.tax_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/tax-rates/${rate.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchRates();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa thuế");
    }
  };

  const handleEdit = (rate: TaxRate) => {
    setEditingRate(rate);
    setFormData({
      tax_code: rate.tax_code,
      tax_name: rate.tax_name,
      tax_type: rate.tax_type,
      rate_percent: rate.rate_percent,
      effective_from: rate.effective_from,
      effective_to: rate.effective_to || null,
      description: rate.description || "",
      status: rate.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingRate(null);
    setFormData({
      tax_code: "",
      tax_name: "",
      tax_type: "VAT",
      rate_percent: 10,
      effective_from: "",
      effective_to: null,
      description: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredRates = rates.filter(rate => {
    const searchMatch = searchTerm === "" ||
      rate.tax_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.tax_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || rate.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredRates}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Thuế Suất"
        icon={<Percent className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Thuế"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingRate ? 'Chỉnh sửa Thuế' : 'Thêm Thuế Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingRate}
          submitLabel={editingRate ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
