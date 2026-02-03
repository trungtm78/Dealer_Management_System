"use client"

import { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { ServiceType, ServiceTypeFormData } from '@/types/master-data.types';

export default function ServiceTypesPage() {
  const [types, setTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState<ServiceTypeFormData>({
    service_type_code: "",
    service_type_name: "",
    category: "",
    default_duration_hours: 1.0,
    base_price: 0,
    description: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const categories: FilterOption[] = [
    { value: "MAINTENANCE", label: "Bảo Dưỡng" },
    { value: "WARRANTY", label: "Bảo Hành" },
    { value: "RECALL", label: "Thu Hồi" },
    { value: "REPAIR", label: "Sửa Chữa" },
    { value: "INSPECTION", label: "Kiểm Tra" },
    { value: "INSTALLATION", label: "Lắp Đặt" }
  ];

  const columns: Column<ServiceType>[] = [
    { key: "service_type_code", label: "Mã Loại Dịch Vụ" },
    { key: "service_type_name", label: "Tên Loại Dịch Vụ" },
    { 
      key: "category",
      label: "Danh Mục",
      render: (value) => {
        const categoryColors: Record<string, string> = {
          MAINTENANCE: "bg-blue-100 text-blue-800",
          WARRANTY: "bg-purple-100 text-purple-800",
          RECALL: "bg-orange-100 text-orange-800",
          REPAIR: "bg-red-100 text-red-800",
          INSPECTION: "bg-green-100 text-green-800",
          INSTALLATION: "bg-cyan-100 text-cyan-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: "default_duration_hours",
      label: "Thời Gian (giờ)",
      render: (value) => `${value}h`
    },
    {
      key: "base_price",
      label: "Giá Căn Bản",
      render: (value) => value ? `${Number(value).toLocaleString('vi-VN')} VND` : '-'
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
      name: "service_type_name",
      label: "Tên Loại Dịch Vụ",
      type: "text",
      required: true,
      placeholder: "Nhập tên loại dịch vụ",
      className: "col-span-2"
    },
    {
      name: "service_type_code",
      label: "Mã Loại Dịch Vụ",
      type: "text",
      required: true,
      placeholder: "Nhập mã loại dịch vụ"
    },
    {
      name: "category",
      label: "Danh Mục",
      type: "select",
      required: true,
      options: categories
    },
    {
      name: "default_duration_hours",
      label: "Thời Gian Mặc Định (giờ)",
      type: "number",
      placeholder: "1.0",
      step: "0.5"
    },
    {
      name: "base_price",
      label: "Giá Căn Bản",
      type: "number",
      placeholder: "0.00",
      step: "1000"
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
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/service-types?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTypes(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingType ? `/api/master/service-types/${editingType.id}` : "/api/master/service-types";
      const method = editingType ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchTypes();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu loại dịch vụ");
    }
  };

  const handleDelete = async (type: ServiceType) => {
    if (!confirm(`Bạn có chắc muốn xóa ${type.service_type_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/service-types/${type.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchTypes();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa loại dịch vụ");
    }
  };

  const handleEdit = (type: ServiceType) => {
    setEditingType(type);
    setFormData({
      service_type_code: type.service_type_code,
      service_type_name: type.service_type_name,
      category: type.category,
      default_duration_hours: type.default_duration_hours,
      base_price: type.base_price || 0,
      description: type.description || "",
      status: type.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingType(null);
     setFormData({
      service_type_code: "",
      service_type_name: "",
      category: "MAINTENANCE",
      default_duration_hours: 1.0,
      base_price: 0,
      description: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredTypes = types.filter(type => {
    const searchMatch = searchTerm === "" ||
      type.service_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.service_type_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || type.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredTypes}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Loại Dịch Vụ"
        icon={<Wrench className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Loại Dịch Vụ"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingType ? 'Chỉnh sửa Loại Dịch Vụ' : 'Thêm Loại Dịch Vụ Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingType}
          submitLabel={editingType ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
