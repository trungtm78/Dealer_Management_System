"use client"

import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { VehicleColor, VehicleColorFormData } from '@/types/master-data.types';

export default function VehicleColorsPage() {
  const [colors, setColors] = useState<VehicleColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<VehicleColor | null>(null);
  const [formData, setFormData] = useState<VehicleColorFormData>({
    color_name: "",
    hex_code: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const columns: Column<VehicleColor>[] = [
    { key: "color_code", label: "Mã Màu" },
    { key: "color_name", label: "Tên Màu" },
    { 
      key: "hex_code", 
      label: "Mã Hex",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded border" 
            style={{ backgroundColor: value as string }}
          />
          <span className="font-mono text-sm">{value}</span>
        </div>
      )
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
      name: "color_name",
      label: "Tên Màu Xe",
      type: "text",
      required: true,
      placeholder: "Nhập tên màu xe"
    },
    {
      name: "hex_code",
      label: "Mã Màu (Hex)",
      type: "text",
      required: true,
      placeholder: "#000000",
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
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/vehicle-colors?${params}`);
      if (response.ok) {
        const data = await response.json();
        setColors(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vehicle colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingColor ? `/api/master/vehicle-colors/${editingColor.id}` : "/api/master/vehicle-colors";
      const method = editingColor ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchColors();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu màu xe");
    }
  };

  const handleDelete = async (color: VehicleColor) => {
    if (!confirm(`Bạn có chắc muốn xóa ${color.color_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/vehicle-colors/${color.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchColors();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa màu xe");
    }
  };

  const handleEdit = (color: VehicleColor) => {
    setEditingColor(color);
    setFormData({
      color_name: color.color_name,
      hex_code: color.hex_code,
      status: color.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingColor(null);
    setFormData({
      color_name: "",
      hex_code: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredColors = colors.filter(color => {
    const searchMatch = searchTerm === "" ||
      color.color_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.color_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || color.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredColors}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Màu Xe"
        icon={<Palette className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Màu"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingColor ? 'Chỉnh sửa Màu Xe' : 'Thêm Màu Xe Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingColor}
          submitLabel={editingColor ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
