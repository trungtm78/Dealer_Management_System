"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { searchCustomers } from "@/actions/crm/customers";
import { Badge } from "@/components/ui/badge";

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    type?: string;
    rank?: string;
    address?: string;
}

interface CustomerSearchProps {
    onSelect: (customer: Customer) => void;
    placeholder?: string;
    className?: string;
    showPhone?: boolean;
}

export function CustomerSearch({ onSelect, placeholder = "Tìm khách hàng...", className, showPhone = true }: CustomerSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<Customer[]>([]);

    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const data = await searchCustomers(query);
                setResults(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between font-normal", className)}
                >
                    {value
                        ? results.find((item) => item.id === value)?.name || value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Nhập tên, SĐT, Email hoặc MST..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading ? (
                            <div className="py-6 text-center text-sm flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tìm kiếm...
                            </div>
                        ) : results.length === 0 && query.length >= 2 ? (
                            <CommandEmpty className="py-6 text-center text-sm">
                                Không tìm thấy khách hàng nào.
                            </CommandEmpty>
                        ) : (
                            <CommandGroup heading="Kết quả tìm kiếm">
                                {results.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setValue(item.name);
                                            onSelect(item);
                                            setOpen(false);
                                        }}
                                        onPointerDown={() => {
                                            setValue(item.name);
                                            onSelect(item);
                                            setOpen(false);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <CommandItem
                                            value={item.id}
                                            onSelect={(currentValue) => {
                                                setValue(item.name); // Set visual value to Name
                                                onSelect(item);
                                                setOpen(false);
                                            }}
                                            className="!cursor-pointer"
                                        >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item.name ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{item.name}</span>
                                                <div className="flex gap-2">
                                                    {item.type === 'COMPANY' && <Badge variant="secondary" className="text-[10px] h-5">Công ty</Badge>}
                                                    {item.rank && <Badge variant="outline" className="text-[10px] h-5">{item.rank}</Badge>}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {item.phone} {item.email ? `• ${item.email}` : ''}
                                            </span>
                                            {item.address && (
                                                <span className="text-xs text-blue-600 truncate max-w-[300px]">
                                                    {item.address}
                                                </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    </div>
                                ))}
                            </CommandGroup>
                        )}
                        {query.length < 2 && (
                            <div className="py-6 text-center text-sm text-gray-500">
                                Nhập ít nhất 2 ký tự để tìm kiếm
                            </div>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
