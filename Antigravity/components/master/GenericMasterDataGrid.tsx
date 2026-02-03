"use client"

import React from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface GenericGridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters?: { [key: string]: string };
  onFilterChange?: (key: string, value: string) => void;
  filterOptions?: { [key: string]: FilterOption[] };
  title: string;
  icon: React.ReactNode;
  addButtonLabel?: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getRowKey: (item: T) => string;
  getStatusColor?: (status: string) => string;
  getStatusLabel?: (status: string) => string;
  statusField?: keyof T;
}

export function GenericMasterDataGrid<T>({
  data,
  columns,
  loading,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions,
  title,
  icon,
  addButtonLabel = "Thêm Mới",
  onAdd,
  onEdit,
  onDelete,
  getRowKey,
  getStatusColor,
  getStatusLabel,
  statusField
}: GenericGridProps<T>) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
            {title}
          </h1>
        </div>
        {onAdd && (
          <Button 
            onClick={onAdd}
            className="bg-[#E60012]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
            />
          </div>
          {filterOptions && onFilterChange && filters && (Object.keys(filterOptions) as string[]).map((key) => (
            <select
              key={key}
              value={filters[key] || ''}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012]"
            >
              <option value="">Tất cả</option>
              {Array.isArray(filterOptions?.[key]) && (filterOptions[key] as FilterOption[]).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={String(column.key)} 
                    className={`text-left py-3 px-4 font-semibold text-gray-900 ${column.className || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Thao Tác</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8 text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={getRowKey(item)} className="border-t border-gray-100 hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={String(column.key)} className={`py-3 px-4 ${column.className || ''}`}>
                        {column.render ? (
                          column.render(item[column.key], item)
                        ) : (
                          String(item[column.key] || '')
                        )}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDelete(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
