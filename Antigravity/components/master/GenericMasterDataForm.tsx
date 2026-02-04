"use client"

import React from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartSelect } from '@/components/SmartSelect';
import type { SelectDataSource } from '@/types/smart-select';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'email' | 'tel' | 'autocomplete';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: (value: any) => string | null;
  readOnly?: boolean;
  className?: string;
  step?: string;
  min?: number;
  max?: number;
  resource?: string;
  filters?: Record<string, any>;
}

export interface GenericFormProps {
  title: string;
  fields: FormField[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  submitLabel?: string;
  isLoading?: boolean;
  customFields?: React.ReactNode;
}

export function GenericMasterDataForm({
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  submitLabel,
  isLoading = false,
  customFields
}: GenericFormProps) {
  const renderField = (field: FormField) => {
    const error = field.validation ? field.validation(formData[field.name]) : null;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.readOnly}
              required={field.required}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
              rows={3}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <select
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.readOnly}
              required={field.required}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="number"
              step={field.step || "0.01"}
              min={field.min}
              max={field.max}
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, parseFloat(e.target.value) || 0)}
              disabled={field.readOnly}
              required={field.required}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="date"
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.readOnly}
              required={field.required}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="email"
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.readOnly}
              required={field.required}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'tel':
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="tel"
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.readOnly}
              required={field.required}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'autocomplete':
        // Note: This requires dataSource to be passed via custom field rendering
        // Generic form doesn't have built-in datasource - caller must provide SmartSelect directly
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <p className="text-sm text-gray-500">Autocomplete field - implement via customFields</p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      default: // text
        return (
          <div key={field.name} className={field.className || ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.readOnly}
              required={field.required}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#E60012] ${field.readOnly ? 'bg-gray-100' : ''}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
    }
  };

  const hasErrors = fields.some(field => field.validation && field.validation(formData[field.name]));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {fields.map(field => renderField(field))}
            </div>

            {customFields}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-[#E60012]"
                disabled={isLoading || hasErrors}
              >
                <Save className="w-4 h-4 mr-2" />
                {submitLabel || (isEditing ? 'Cập Nhật' : 'Thêm Mới')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
