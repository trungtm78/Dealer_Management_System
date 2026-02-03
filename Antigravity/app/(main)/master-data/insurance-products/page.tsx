"use client"

import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { InsuranceProduct, InsuranceProductFormData } from '@/types/master-data.types';

export default function InsuranceProductsPage() {
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InsuranceProduct | null>(null);
  const [formData, setFormData] = useState<InsuranceProductFormData>({
    product_code: "",
    product_name: "",
    insurance_type: "",
    premium_amount: 0,
    coverage_amount: 0,
    deductible_amount: 0,
    max_claim_amount: 0,
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const insuranceTypes: FilterOption[] = [
    { value: "TNDS", label: "Trách Nghĩa Bắt Buộc" },
    { value: "MATERIAL", label: "Vật Chất" },
    { value: "PERSON", label: "Người" }
  ];

  const columns: Column<InsuranceProduct>[] = [
    { key: "product_code", label: "Mã Sản Phẩm" },
    { key: "product_name", label: "Tên Sản Phẩm" },
    {
      key: "insurance_type",
      label: "Loại Bảo Hiểm",
      render: (value) => {
        const typeColors: Record<string, string> = {
          TNDS: "bg-blue-100 text-blue-800",
          MATERIAL: "bg-green-100 text-green-800",
          PERSON: "bg-purple-100 text-purple-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: "premium_amount",
      label: "Phí Bảo Hiểm",
      render: (value) => `${Number(value).toLocaleString('vi-VN')} VND`
    },
    {
      key: "coverage_amount",
      label: "Mức Độ Bảo Hiểm",
      render: (value) => `${Number(value).toLocaleString('vi-VN')} VND`
    },
    {
      key: "deductible_amount",
      "label": "Mức Tự Trách (VND)",
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
      name: "product_name",
      label: "Tên Sản Phẩm",
      type: "text",
      required: true,
      placeholder: "Nhập tên sản phẩm bảo hiểm",
      className: "col-span-2"
    },
    {
      name: "product_code",
      label: "Mã Sản Phẩm",
      type: "text",
      required: true,
      placeholder: "Nhập mã sản phẩm"
    },
    {
      name: "insurance_type",
      label: "Loại Bảo Hiểm",
      type: "select",
      required: true,
      options: insuranceTypes
    },
    {
      name: "premium_amount",
      label: "Phí Bảo Hiểm",
      type: "number",
      required: true,
      placeholder: "0.00",
      step: "1000"
    },
    {
      name: "coverage_amount",
      label: "Mức Độ Bảo Hiểm",
      type: "number",
      required: true,
      placeholder: "0.00",
      step: "1000"
    },
    {
      name: "deductible_amount",
      label: "Mức Tự Trách (VND)",
      type: "number",
      placeholder: "0.00",
      step: "1000"
    },
    {
      name: "max_claim_amount",
      label: "Mức Đền Tối Đa",
      type: "number",
      placeholder: "0.00",
      step: "1000"
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/insurance-products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching insurance products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct ? `/api/master/insurance-products/${editingProduct.id}` : "/api/master/insurance-products";
      const method = editingProduct ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu sản phẩm bảo hiểm");
    }
  };

  const handleDelete = async (product: InsuranceProduct) => {
    if (!confirm(`Bạn có chắc muốn xóa ${product.product_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/insurance-products/${product.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchProducts();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm bảo hiểm");
    }
  };

  const handleEdit = (product: InsuranceProduct) => {
    setEditingProduct(product);
    setFormData({
      product_code: product.product_code,
      product_name: product.product_name,
      insurance_type: product.insurance_type,
      premium_amount: product.premium_amount,
      coverage_amount: product.coverage_amount,
      deductible_amount: product.deductible_amount || 0,
      max_claim_amount: product.max_claim_amount || 0,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      product_code: "",
      product_name: "",
      insurance_type: "TNDS",
      premium_amount: 0,
      coverage_amount: 0,
      deductible_amount: 0,
      max_claim_amount: 0,
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(product => {
    const searchMatch = searchTerm === "" ||
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || product.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredProducts}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Sản Phẩm Bảo Hiểm"
        icon={<ShieldAlert className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Sản Phẩm"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingProduct ? 'Chỉnh sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingProduct}
          submitLabel={editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
