"use client"

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { Promotion } from '@/types/master-data.types';
import { PromotionFormData } from '@/types/master-data.promotions-formData';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<PromotionFormData>({
    promotion_code: "",
    promotion_name: "",
    promotion_type: "PERCENT",
    start_date: "",
    end_date: "",
    discount_percent: null,
    discount_amount: null,
    min_purchase_amount: null,
    max_discount_amount: null,
    description: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const promotionTypes: FilterOption[] = [
    { value: "PERCENT", label: "Phần Trăm (%)" },
    { value: "AMOUNT", label: "Số Tiền" }
  ];

  const columns: Column<Promotion>[] = [
    { key: "promotion_code", label: "Mã Khuyến Mãi" },
    { key: "promotion_name", label: "Tên Khuyến Mãi" },
    {
      key: "promotion_type",
      label: "Loại",
      render: (value) => {
        const typeColors: Record<string, string> = {
          PERCENT: "bg-orange-100 text-orange-800",
          AMOUNT: "bg-blue-100 text-blue-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    { key: "start_date", label: "Ngày Bắt Đầu", render: (value) => new Date(value).toLocaleDateString('vi-VN') },
    { key: "end_date", label: "Ngày Kết Thúc", render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-' },
    {
      key: "discount_percent",
      label: "Khuyến Mãi Phần Trăm (%)",
      render: (value) => value ? `${value}%` : '-'
    },
    {
      key: "discount_amount",
      label: "Khuyến Mãi Số Tiền",
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
      name: "promotion_name",
      label: "Tên Khuyến Mãi",
      type: "text",
      required: true,
      placeholder: "Nhập tên chương trình khuyến mãi",
      className: "col-span-2"
    },
    {
      name: "promotion_code",
      label: "Mã Khuyến Mãi",
      type: "text",
      required: true,
      placeholder: "KM001",
      className: "col-span-2"
    },
    {
      name: "promotion_type",
      label: "Loại Khuyến Mãi",
      type: "select",
      required: true,
      options: promotionTypes
    },
    {
      name: "start_date",
      label: "Ngày Bắt Đầu",
      type: "date",
      required: true
    },
    {
      name: "end_date",
      label: "Ngày Kết Thúc",
      type: "date",
      required: true
    },
    {
      name: "discount_percent",
      label: "Khuyến Mãi Phần Trăm (%)",
      type: "number",
      placeholder: "0",
      step: "1",
      min: 0,
      max: 100
    },
    {
      name: "discount_amount",
      label: "Khuyến Mãi Số Tiền",
      type: "number",
      placeholder: "0",
      step: "1000",
      min: 0
    },
    {
      name: "min_purchase_amount",
      label: "Giá Trị Tối Thiểu",
      type: "number",
      placeholder: "0.00",
      step: "0.01",
      min: 0
    },
    {
      name: "max_discount_amount",
      label: "Giá Trị Tối Thiểu",
      type: "number",
      placeholder: "0.00",
      step: "1000",
      min: 0
    },
    {
      name: "description",
      label: "Mô Tả",
      type: "textarea",
      placeholder: "Nhập mô tả chương trình",
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
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/promotions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPromotion ? `/api/master/promotions/${editingPromotion.id}` : "/api/master/promotions";
      const method = editingPromotion ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPromotions();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu khuyến mãi");
    }
  };

  const handleDelete = async (promotion: Promotion) => {
    if (!confirm(`Bạn có chắc muốn xóa ${promotion.promotion_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/promotions/${promotion.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchPromotions();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa khuyến mãi");
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      promotion_code: promotion.promotion_code,
      promotion_name: promotion.promotion_name,
      promotion_type: promotion.promotion_type,
      start_date: promotion.start_date?.toISOString() || "",
      end_date: promotion.end_date?.toISOString() || "",
      discount_percent: promotion.discount_percent || 0,
      discount_amount: promotion.discount_amount || 0,
      min_purchase_amount: promotion.min_purchase_amount || 0,
      max_discount_amount: promotion.max_discount_amount || 0,
      description: promotion.description || "",
      status: promotion.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPromotion(null);
    setFormData({
      promotion_code: "",
      promotion_name: "",
      promotion_type: "PERCENT",
      start_date: "",
      end_date: "",
      discount_percent: null,
      discount_amount: null,
      min_purchase_amount: null,
      max_discount_amount: null,
      description: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredPromotions = promotions.filter(promotion => {
    const searchMatch = searchTerm === "" ||
      promotion.promotion_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.promotion_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || promotion.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredPromotions}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Khuyến Mãi"
        icon={<Tag className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Khuyến Mãi"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingPromotion ? 'Chỉnh sửa Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingPromotion}
          submitLabel={editingPromotion ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
