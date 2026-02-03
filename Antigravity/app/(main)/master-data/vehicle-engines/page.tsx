"use client"

import { useState, useEffect } from 'react';
import { Cog } from 'lucide-react';
import { GenericMasterDataGrid, Column, FilterOption } from '@/components/master/GenericMasterDataGrid';
import { GenericMasterDataForm, FormField } from '@/components/master/GenericMasterDataForm';
import { VehicleEngine, VehicleEngineFormData } from '@/types/master-data.types';

export default function VehicleEnginesPage() {
  const [engines, setEngines] = useState<VehicleEngine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEngine, setEditingEngine] = useState<VehicleEngine | null>(null);
  const [formData, setFormData] = useState<VehicleEngineFormData>({
    engine_code: "",
    engine_name: "",
    engine_capacity: "",
    fuel_type: "PETROL",
    status: "ACTIVE"
  });

  const statuses: FilterOption[] = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" }
  ];

  const fuelTypes: FilterOption[] = [
    { value: "PETROL", label: "Xăng" },
    { value: "DIESEL", label: "Dầu" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "ELECTRIC", label: "Điện" }
  ];

  const columns: Column<VehicleEngine>[] = [
    { key: "engine_code", label: "Mã Động Cơ" },
    { key: "engine_name", label: "Tên Động Cơ" },
    { 
      key: "engine_capacity",
      label: "Dung Tích (cc)",
      render: (value) => value ? `${value} cc` : '-'
    },
    {
      key: "fuel_type",
      label: "Nhiên Liệu",
      render: (value) => {
        const fuelColors: Record<string, string> = {
          PETROL: "bg-green-100 text-green-800",
          DIESEL: "bg-blue-100 text-blue-800",
          HYBRID: "bg-purple-100 text-purple-800",
          ELECTRIC: "bg-yellow-100 text-yellow-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${fuelColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
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
      name: "engine_name",
      label: "Tên Động Cơ",
      type: "text",
      required: true,
      placeholder: "Nhập tên động cơ",
      className: "col-span-2"
    },
    {
      name: "engine_code",
      label: "Mã Động Cơ",
      type: "text",
      required: true,
      placeholder: "Nhập mã động cơ"
    },
    {
      name: "engine_capacity",
      label: "Dung Tích (cc)",
      type: "text",
      placeholder: "1500"
    },
    {
      name: "fuel_type",
      label: "Nhiên Liệu",
      type: "select",
      required: true,
      options: fuelTypes
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
    fetchEngines();
  }, []);

  const fetchEngines = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("name", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/master/vehicle-engines?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEngines(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vehicle engines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingEngine ? `/api/master/vehicle-engines/${editingEngine.id}` : "/api/master/vehicle-engines";
      const method = editingEngine ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchEngines();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi khi lưu động cơ");
    }
  };

  const handleDelete = async (engine: VehicleEngine) => {
    if (!confirm(`Bạn có chắc muốn xóa ${engine.engine_name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/master/vehicle-engines/${engine.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchEngines();
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      alert("Lỗi khi xóa động cơ");
    }
  };

  const handleEdit = (engine: VehicleEngine) => {
    setEditingEngine(engine);
    setFormData({
      engine_code: engine.engine_code,
      engine_name: engine.engine_name,
      engine_capacity: engine.engine_capacity || "",
      fuel_type: engine.fuel_type || "PETROL",
      status: engine.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingEngine(null);
    setFormData({
      engine_code: "",
      engine_name: "",
      engine_capacity: "",
      fuel_type: "PETROL",
      status: "ACTIVE"
    });
    setIsModalOpen(false);
  };

  const filteredEngines = engines.filter(engine => {
    const searchMatch = searchTerm === "" ||
      engine.engine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.engine_code.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = selectedStatus === "" || engine.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <GenericMasterDataGrid
        data={filteredEngines}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={{ status: selectedStatus }}
        onFilterChange={(key, value) => setSelectedStatus(value)}
        filterOptions={{ status: statuses }}
        title="Động Cơ Xe"
        icon={<Cog className="w-8 h-8 text-[#E60012]" />}
        addButtonLabel="Thêm Động Cơ"
        onAdd={() => setIsModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(item) => item.id}
      />

      {isModalOpen && (
        <GenericMasterDataForm
          title={editingEngine ? 'Chỉnh sửa Động Cơ' : 'Thêm Động Cơ Mới'}
          fields={formFields}
          formData={formData}
          onChange={(name, value) => setFormData({ ...formData, [name]: value })}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingEngine}
          submitLabel={editingEngine ? 'Cập Nhật' : 'Thêm Mới'}
        />
      )}
    </>
  );
}
