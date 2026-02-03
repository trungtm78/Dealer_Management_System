"use client"

import { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { BankAccount, BankAccountFormData } from '@/types/master-data.types';

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState<BankAccountFormData>({
    account_code: "",
    account_name: "",
    bank_name: "",
    account_number: "",
    branch_name: "",
    account_type: "",
    currency: "VND",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const columns: Column<BankAccount>[] = [
    { key: "account_code", label: "Mã Tài Khoản" },
    { key: "account_name", label: "Tên Tài Khoản" },
    { key: "bank_name", label: "Ngân Hàng" },
    { key: "account_number", label: "Số Tài Khoản" },
    { 
      key: "account_type",
      label: "Loại Tài Khoản",
      render: (value) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{value}</span>
    },
    {
      key: "currency",
      label: "Loại Tiền Tệ",
      render: (value) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{value}</span>
    },
    {
      key: "branch_name",
      label: "Chi Nhánh"
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
      name: "account_name",
      label: "Tên Tài Khoản",
      type: "text",
      required: true,
      placeholder: "Nhập tên tài khoản",
      className: "col-span-2"
    },
    {
      name: "bank_name",
      label: "Ngân Hàng",
      type: "text",
      required: true,
      placeholder: "Nhập tên ngân hàng"
    },
    {
      name: "account_number",
      label: "Số Tài Khoản",
      type: "text",
      required: true,
      placeholder: "Nhập số tài khoản"
    },
    {
      name: "branch_name",
      label: "Chi Nhánh",
      type: "text",
      placeholder: "Nhập tên chi nhánh"
    },
    {
      name: "account_type",
      label: "Loại Tài Khoản",
      type: "text",
      placeholder: "Tiền gửi, Tiền nhận, Chuyển khoản"
    },
    {
      name: "currency",
      label: "Loại Tiền Tệ",
      type: "text",
      defaultValue: "VND"
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
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/bank-accounts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAccount ? `/api/master/bank-accounts/${editingAccount.id}` : "/api/master/bank-accounts";
      const method = editingAccount ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAccounts();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu tài khoản");
    }
  };

  const handleDelete = async (account: BankAccount) => {
    if (!confirm(`Bạn có chắc muốn xóa ${account.account_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/bank-accounts/${account.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchAccounts();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa tài khoản");
    }
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      account_code: account.account_code,
      account_name: account.account_name,
      bank_name: account.bank_name,
      account_number: account.account_number,
      branch_name: account.branch_name || "",
      account_type: account.account_type || "",
      currency: account.currency || "VND",
      status: account.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      account_code: "",
      account_name: "",
      bank_name: "",
      account_number: "",
      branch_name: "",
      account_type: "",
      currency: "VND",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredAccounts = accounts.filter(account => {
    const searchMatch = searchTerm === "" ||
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank_name.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || account.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredAccounts}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Tài Khoản Ngân Hàng"
        icon={<Building className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Tài Khoản"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingAccount ? 'Chỉnh sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingAccount}
          submitLabel={editingAccount ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
