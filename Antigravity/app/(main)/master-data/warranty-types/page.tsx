"use client"

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { WarrantyType, WarrantyTypeFormData } from '@/types/master-data.types';

export default function WarrantyTypesPage() {
  const [warranties, setWarranties] = useState<WarrantyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<WarrantyType | null>(null);
  const [formData, setFormData] = useState<WarrantyTypeFormData>({
    warranty_code: "",
    warranty_name: "",
    warranty_type: "BASIC",
    duration_months: 12,
    max_kilometers: 0,
    description: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const warrantyTypes: FilterOption[] = [
    { value: "BASIC", label: "Cơ Bản" },
    { value: "COMPREHENSIVE", label: "Đầy Đủ" },
    { value: "EXTENDED", label: "Mở Rộng" },
    { value: "POWERTRAIN", label: "Hệ Thống Truyền Động" }
  ];

  const columns: Column<WarrantyType>[] = [
    { key: "warranty_code", label: "Mã Bảo Hành" },
    { key: "warranty_name", label: "Tên Bảo Hành" },
    { 
      key: "warranty_type",
      label: "Loại Bảo Hành",
      render: (value) => {
        const typeColors: Record<string, string> = {
          BASIC: "bg-blue-100 text-blue-800",
          COMPREHENSIVE: "bg-purple-100 text-purple-800",
          EXTENDED: "bg-green-100 text-green-800",
          POWERTRAIN: "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full ${typeColors[value]}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: "duration_months",
      label: "Thời Gian (tháng)"
    },
    {
      key: "max_kilometers",
      label: "Số Km Tối Đa"
    },
    {
      key: "description",
      label: "Mô Tả"
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
      name: "warranty_code",
      label: "Mã Bảo Hành",
      type: "text",
      required: true,
      placeholder: "Nhập mã bảo hành"
    },
    {
      name: "warranty_name",
      label: "Tên Bảo Hành",
      type: "text",
      required: true,
      placeholder: "Nhập tên bảo hành"
    },
    {
      name: "warranty_type",
      label: "Loại Bảo Hành",
      type: "select",
      required: true,
      options: warrantyTypes
    },
    {
      name: "duration_months",
      label: "Thời Gian (tháng)",
      type: "number",
      required: true,
      min: 0,
      step: "1"
    },
    {
      name: "max_kilometers",
      label: "Số Km Tối Đa",
      type: "number",
      required: true,
      min: 0,
      step: "1000"
    },
    {
      name: "description",
      label: "Mô Tả",
      type: "textarea",
      placeholder: "Nhập mô tả bảo hành",
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
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/warranty-types?${params}`);
      if (response.ok) {
        const data = await response.json();
        setWarranties(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching warranties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingWarranty ? `/api/master/warranty-types/${editingWarranty.id}` : "/api/master/warranty-types";
      const method = editingWarranty ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchWarranties();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu bảo hành");
    }
  };

  const handleEdit = (warranty: WarrantyType) => {
    setEditingWarranty(warranty);
    setFormData({
      warranty_code: warranty.warranty_code,
      warranty_name: warranty.warranty_name,
      warranty_type: warranty.warranty_type,
      duration_months: warranty.duration_months,
      max_kilometers: warranty.max_kilometers || 0,
      description: warranty.description || "",
      status: warranty.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingWarranty(null);
    setFormData({
      warranty_code: "",
      warranty_name: "",
      warranty_type: "BASIC",
      duration_months: 12,
      max_kilometers: 0,
      description: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const handleDelete = async (warranty: WarrantyType) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${warranty.warranty_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/warranty-types/${warranty.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchWarranties();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa bảo hành");
    }
  };

  return (
    <>
      <GenericMasterDataGrid
        data={warranties}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Loại Bảo Hành"
        icon={<ShieldCheck className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Mới"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingWarranty ? "Chỉnh Sửa Loại Bảo Hành" : "Thêm Loại Bảo Hành"}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingWarranty}
          submitLabel={editingWarranty ? "Lưu" : "Thêm Mới"}
        />
      )}
    </>
  );
}
