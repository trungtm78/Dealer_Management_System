"use client"

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { InsuranceCompany, InsuranceCompanyFormData } from '@/types/master-data.types';

export default function InsuranceCompaniesPage() {
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<InsuranceCompany | null>(null);
  const [formData, setFormData] = useState<InsuranceCompanyFormData>({
    company_code: "",
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const columns: Column<InsuranceCompany>[] = [
    { key: "company_code", label: "Mã Công Ty" },
    { key: "company_name", label: "Tên Công Ty" },
    { key: "contact_person", label: "Người Liên Hệ" },
    { key: "phone", label: "Điện Thoại" },
    { key: "email", label: "Email" },
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
      name: "company_name",
      label: "Tên Công Ty",
      type: "text",
      required: true,
      placeholder: "Nhập tên công ty bảo hiểm",
      className: "col-span-2"
    },
    {
      name: "contact_person",
      label: "Người Liên Hệ",
      type: "text",
      placeholder: "Nhập tên người liên hệ"
    },
    {
      name: "phone",
      label: "Điện Thoại",
      type: "tel",
      placeholder: "Nhập số điện thoại"
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Nhập email"
    },
    {
      name: "address",
      label: "Địa Chỉ",
      type: "text",
      placeholder: "Nhập địa chỉ",
      className: "col-span-2"
    },
    {
      name: "status",
      label: "Trạng Thái",
      type: "select",
      required: true,
      options: statuses,
      className: "col-span-2"
    }
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
      company_code: company.company_code,
      company_name: company.company_name,
      contact_person: company.contact_person || "",
      phone: company.phone || "",
      email: company.email || "",
      address: company.address || "",
      status: company.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCompany(null);
    setFormData({
      company_code: "",
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

  return (
    <>
      <GenericMasterDataGrid
        data={filteredCompanies}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Công Ty Bảo Hiểm"
        icon={<Shield className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Công Ty"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingCompany ? 'Chỉnh sửa Công Ty' : 'Thêm Công Ty Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingCompany}
          submitLabel={editingCompany ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
