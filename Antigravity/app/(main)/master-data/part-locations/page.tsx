"use client"

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { PartLocation, PartLocationFormData } from '@/types/master-data.types';

export default function PartLocationsPage() {
  const [locations, setLocations] = useState<PartLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PartLocation | null>(null);
  const [formData, setFormData] = useState<PartLocationFormData>({
    location_code: "",
    location_name: "",
    warehouse_id: null,
    bay_id: null,
    shelf_id: null,
    description: "",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const columns: Column<PartLocation>[] = [
    { key: "location_code", label: "Mã Vị Trí" },
    { key: "location_name", label: "Tên Vị Trí" },
    { 
      key: "warehouse_id",
      label: "Kho Hàng",
      render: (value) => value ? `ID: ${value}` : '-'
    },
    {
      key: "bay_id",
      label: "Bay",
      render: (value) => value ? `ID: ${value}` : '-'
    },
    {
      key: "shelf_id",
      label: "Kệ",
      render: (value) => value ? `ID: ${value}` : '-'
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
      name: "location_name",
      label: "Tên Vị Trí",
      type: "text",
      required: true,
      placeholder: "Nhập tên vị trí",
      className: "col-span-2"
    },
    {
      name: "location_code",
      label: "Mã Vị Trí",
      type: "text",
      required: true,
      placeholder: "Nhập mã vị trí"
    },
    {
      name: "warehouse_id",
      label: "Kho Hàng",
      type: "text",
      placeholder: "ID kho hàng"
    },
    {
      name: "bay_id",
      label: "Bay",
      type: "text",
      placeholder: "ID bay"
    },
    {
      name: "shelf_id",
      label: "Kệ",
      type: "text",
      placeholder: "ID kệ"
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
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/part-locations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLocations(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching part locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingLocation ? `/api/master/part-locations/${editingLocation.id}` : "/api/master/part-locations";
      const method = editingLocation ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchLocations();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu vị trí");
    }
  };

  const handleDelete = async (location: PartLocation) => {
    if (!confirm(`Bạn có chắc muốn xóa ${location.location_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/part-locations/${location.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchLocations();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa vị trí");
    }
  };

  const handleEdit = (location: PartLocation) => {
    setEditingLocation(location);
    setFormData({
      location_code: location.location_code,
      location_name: location.location_name,
      warehouse_id: location.warehouse_id || null,
      bay_id: location.bay_id || null,
      shelf_id: location.shelf_id || null,
      description: location.description || "",
      status: location.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingLocation(null);
    setFormData({
      location_code: "",
      location_name: "",
      warehouse_id: null,
      bay_id: null,
      shelf_id: null,
      description: "",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredLocations = locations.filter(location => {
    const searchMatch = searchTerm === "" ||
      location.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.location_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || location.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredLocations}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Vị Trí Lưu Trữ"
        icon={<MapPin className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Vị Trí"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingLocation ? 'Chỉnh sửa Vị Trí' : 'Thêm Vị Trí Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingLocation}
          submitLabel={editingLocation ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
