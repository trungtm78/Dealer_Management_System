"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploaderProps {
  accept?: string;
  allowedTypes?: string[];
  maxFileSize?: number; // bytes
  maxFiles?: number;
  onValidationError?: (errors: { file: string; message: string }[]) => void;
  onUpload?: (files: File[]) => void;
}

export default function DocumentUploader({
  accept = ".jpg,.jpeg,.png,.pdf",
  allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
  maxFileSize = 10485760, // 10 MB
  maxFiles = 10,
  onValidationError,
  onUpload
}: DocumentUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; error?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]) => {
    const errors: { file: string; message: string }[] = [];
    const validated: { file: File; error?: string }[] = [];

    if (selectedFiles.length + files.length > maxFiles) {
      const msg = `Tối đa ${maxFiles} tập tin được phép`;
      errors.push({ file: "Nhiều tập tin", message: msg });
      toast.error(msg);
      return;
    }

    files.forEach(file => {
      let error = undefined;

      if (!allowedTypes.includes(file.type)) {
        error = `Định dạng không hợp lệ. Chỉ cho phép JPG, PNG, PDF`;
      } else if (file.size > maxFileSize) {
        error = `Dung lượng vượt quá ${maxFileSize / 1024 / 1024} MB`;
      }

      if (error) {
        errors.push({ file: file.name, message: error });
      }
      validated.push({ file, error });
    });

    if (errors.length > 0 && onValidationError) {
      onValidationError(errors);
    }

    setSelectedFiles(prev => [...prev, ...validated]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const hasErrors = selectedFiles.some(f => f.error);

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept={accept} 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4 flex flex-col text-sm text-gray-600">
          <p className="font-semibold text-blue-600">Click để chọn tập tin</p>
          <p>hoặc kéo và thả vào đây</p>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG hoặc PDF (Tối đa {maxFileSize / 1024 / 1024}MB mỗi file)
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((f, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between p-3 rounded-md border ${f.error ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`h-5 w-5 ${f.error ? 'text-red-500' : 'text-blue-500'}`} />
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${f.error ? 'text-red-700' : 'text-gray-700'}`}>
                    {f.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(f.file.size / 1024).toFixed(1)} KB
                  </span>
                  {f.error && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {f.error}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                onClick={() => removeFile(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button 
        className="w-full bg-[#E60012] hover:bg-[#c50010]" 
        disabled={selectedFiles.length === 0 || hasErrors}
        onClick={() => onUpload?.(selectedFiles.map(f => f.file))}
      >
        Tải Lên {selectedFiles.length > 0 && `(${selectedFiles.length})`} Tập Tin
      </Button>
    </div>
  );
}
