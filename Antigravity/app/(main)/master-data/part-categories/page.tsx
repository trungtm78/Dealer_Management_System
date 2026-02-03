"use client"

import { useState, useEffect } from 'react';
import { FolderTree } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { PartCategory, PartCategoryFormData } from '@/types/master-data.types';

export default function PartCategoriesPage() {
  const [categories, setCategories] = useState<PartCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PartCategory | null>(null);
  const [formData, setFormData] = useState<PartCategoryFormData>({
    category_code: "",
    category_name: "",
    parent_category_id: null,
    description: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const columns: Column<PartCategory>[] = [
    { key: "category_code", label: "Mã Danh Mục" },
    { key: "category_name", label: "Tên Danh Mục" },
    { key: "description", label: "Mô Tả" },
    {
      key: "parent_category_id",
      label: "Danh Mục Cha",
      render: (value) => value ? `ID: ${value}` : "Danh mục gốc"
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
      name: "category_name",
      label: "Tên Danh Mục",
      type: "text",
      required: true,
      placeholder: "Nhập tên danh mục",
      className: "col-span-2"
    },
    {
      name: "category_code",
      label: "Mã Danh Mục",
      type: "text",
      required: true,
      placeholder: "Nhập mã danh mục"
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/part-categories?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching part categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory ? `/api/master/part-categories/${editingCategory.id}` : "/api/master/part-categories";
      const method = editingCategory ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCategories();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu danh mục");
    }
  };

  const handleDelete = async (category: PartCategory) => {
    if (!confirm(`Bạn có chắc muốn xóa ${category.category_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/part-categories/${category.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchCategories();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa danh mục");
    }
  };

  const handleEdit = (category: PartCategory) => {
    setEditingCategory(category);
    setFormData({
      category_code: category.category_code,
      category_name: category.category_name,
      parent_category_id: category.parent_category_id || null,
      description: category.description || "",
      status: category.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      category_code: "",
      category_name: "",
      parent_category_id: null,
      description: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredCategories = categories.filter(category => {
    const searchMatch = searchTerm === "" ||
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.category_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || category.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredCategories}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Danh Mục Phụ Tùng"
        icon={<FolderTree className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Danh Mục"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingCategory ? 'Chỉnh sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingCategory}
          submitLabel={editingCategory ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
