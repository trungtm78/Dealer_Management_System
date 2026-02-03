"use client"

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { PaymentMethod, PaymentMethodFormData } from '@/types/master-data.types';

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    method_code: "",
    method_name: "",
    method_type: "CASH",
    description: "",
    processing_fee: 0,
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const methodTypes: FilterOption[] = [
    { value: "CASH", label: "Tiền mặt" },
    { value: "CARD", label: "Thẻ" },
    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
    { value: "EWALLET", label: "Ví điện tử" }
  ];

  const columns: Column<PaymentMethod>[] = [
    { key: "method_code", label: "Mã Phương Thức" },
    { key: "method_name", label: "Tên Phương Thức" },
    { 
      key: "method_type",
      label: "Loại",
      render: (value) => {
        const typeMap: Record<string, string> = {
          "CASH": "Tiền mặt",
          "CARD": "Thẻ",
          "BANK_TRANSFER": "Chuyển khoản",
          "EWALLET": "Ví điện tử"
        };
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {typeMap[value] || value}
        </span>;
      }
    },
    { 
      key: "processing_fee",
      label: "Phí Xử Lý (%)",
      render: (value) => `${value}%`
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
      name: "method_name",
      label: "Tên Phương Thức",
      type: "text",
      required: true,
      placeholder: "Nhập tên phương thức thanh toán",
      className: "col-span-2"
    },
    {
      name: "method_type",
      label: "Loại Phương Thức",
      type: "select",
      required: true,
      options: methodTypes
    },
    {
      name: "description",
      label: "Mô Tả",
      type: "textarea",
      placeholder: "Nhập mô tả",
      className: "col-span-2"
    },
    {
      name: "processing_fee",
      label: "Phí Xử Lý (%)",
      type: "number",
      placeholder: "0.00",
      step: "0.01"
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
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/payment-methods?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMethods(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingMethod ? `/api/master/payment-methods/${editingMethod.id}` : "/api/master/payment-methods";
      const method = editingMethod ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMethods();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu phương thức thanh toán");
    }
  };

  const handleDelete = async (method: PaymentMethod) => {
    if (!confirm(`Bạn có chắc muốn xóa ${method.method_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/payment-methods/${method.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchMethods();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa phương thức thanh toán");
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      method_code: method.method_code,
      method_name: method.method_name,
      method_type: method.method_type,
      description: method.description || "",
      processing_fee: method.processing_fee,
      status: method.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingMethod(null);
    setFormData({
      method_code: "",
      method_name: "",
      method_type: "CASH",
      description: "",
      processing_fee: 0,
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredMethods = methods.filter(method => {
    const searchMatch = searchTerm === "" ||
      method.method_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.method_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || method.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredMethods}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Phương Thức Thanh Toán"
        icon={<CreditCard className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Phương Thức"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingMethod ? 'Chỉnh sửa Phương Thức' : 'Thêm Phương Thức Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingMethod}
          submitLabel={editingMethod ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
