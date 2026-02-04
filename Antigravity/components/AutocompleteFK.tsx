"use client";

import { useState } from "react";
import { ChevronDown, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFKData } from "@/hooks/useFKData";

interface AutocompleteFKProps {
    resource: string;
    value?: string | number | null;
    onChange: (id: string | number | null, item?: any) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    filters?: Record<string, any>;
}

export function AutocompleteFK({
    resource,
    value,
    onChange,
    label,
    placeholder,
    required,
    disabled,
    className,
    filters = {}
}: AutocompleteFKProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const status = filters.status || "ACTIVE";

    const { data, loading, error, refetch } = useFKData<{ id: string; name: string; status: string }>({
        entityName: resource,
        status,
        enabled: open
    });

    console.log('[AutocompleteFK] resource:', resource, 'data:', data, 'loading:', loading, 'error:', error, 'searchQuery:', searchQuery);

    const selectedValue = value ? data.find(item => item.id === String(value)) : null;

    const handleSelect = (selectedId: string) => {
        console.log('[AutocompleteFK] handleSelect called with id:', selectedId);
        const selectedItem = data.find(item => item.id === selectedId);
        console.log('[AutocompleteFK] selectedItem:', selectedItem);
        onChange(selectedId, selectedItem);
        setOpen(false);
        setSearchQuery("");
    };

    const handleClear = () => {
        onChange(null);
        setSearchQuery("");
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label className={cn(required && "after:content-['*'] after:ml-1 after:text-red-500")}>
                    {label}
                </Label>
            )}
            <Popover open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) {
                    refetch();
                }
            }}>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            !selectedValue && "text-muted-foreground"
                        )}
                    >
                        {selectedValue ? selectedValue.name : placeholder || "Chọn..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            {loading ? (
                                <div className="py-4 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : error ? (
                                <CommandEmpty>
                                    <div className="py-4 text-center text-sm text-red-500">
                                        Có lỗi xảy ra khi tải dữ liệu
                                    </div>
                                </CommandEmpty>
                            ) : data.length === 0 ? (
                                <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {data.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.id}
                                            onSelect={handleSelect}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === item.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {item.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedValue && !disabled && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                    <X className="h-3 w-3 mr-1" />
                    Xóa chọn
                </Button>
            )}
        </div>
    );
}
