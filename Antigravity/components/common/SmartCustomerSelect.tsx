"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
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
import { useSmartCustomerSearch } from "@/hooks/use-smart-customer-search";
import { SearchContext, SearchFilter, SelectItem } from "@/types/smart-select";
import { useInView } from "react-intersection-observer";

interface SmartCustomerSelectProps {
    value?: string | number;
    onChange: (value: SelectItem | null) => void;
    context?: SearchContext;
    filter?: SearchFilter;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SmartCustomerSelect({
    value,
    onChange,
    context = {},
    filter = {},
    placeholder = "Chọn khách hàng...",
    className,
    disabled = false
}: SmartCustomerSelectProps) {
    const [open, setOpen] = React.useState(false);

    // We need to keep a visible label for the selected value
    const [selectedLabel, setSelectedLabel] = React.useState<string>("");

    // Hook logic
    const {
        query,
        setQuery,
        items,
        loading,
        hasMore,
        loadMore,
        handleCreate
    } = useSmartCustomerSearch(context, filter);

    // Infinite scroll trigger
    const { ref: loadMoreRef, inView } = useInView();

    React.useEffect(() => {
        if (inView && hasMore) {
            loadMore();
        }
    }, [inView, hasMore, loadMore]);

    // Sync selected label when value changes or items update
    React.useEffect(() => {
        if (!value) {
            setSelectedLabel("");
            return;
        }
        // Try to find in current items
        const found = items.find(i => i.id === value);
        if (found) {
            setSelectedLabel(found.label);
        } else {
            // If not found in items (e.g. initial load), we might want to fetch it individually 
            // OR rely on the parent to pass the initial object. 
            // For now, if we have a value but no label, we might show the ID or nothing?
            // Usually simpler: Check if parent passed an initial object?
            // But the props here only take `value` (ID).
            // Ideal pattern: Component accepts `defaultValue` object OR fetches single.
            // Let's assume for this "Smart" select, if the item isn't in the default list, 
            // the label might be missing initially. 
            // A common fix is to allow `value` to be SelectItem OR let consumer handle label.
            // But sticking to the requested contract.
        }
    }, [value, items]);

    // Special case: If we just created an item, the hook might return it, 
    // but the hook returns it from handleCreate. We should use that.

    const onSelect = (item: SelectItem) => {
        onChange(item);
        setSelectedLabel(item.label);
        setOpen(false);
    };

    const onCreateClick = async () => {
        const newItem = await handleCreate(query);
        if (newItem) {
            onSelect(newItem);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between font-normal text-left", !value && "text-muted-foreground", className)}
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Tìm kiếm..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading && items.length === 0 && (
                            <div className="py-6 text-center text-sm flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tải...
                            </div>
                        )}

                        {!loading && items.length === 0 && (
                            <CommandEmpty className="py-2 text-center text-sm">
                                {context.createEnabled && query.length >= 2 ? (
                                    <div className="p-2">
                                        <p className="text-muted-foreground mb-2">Không tìm thấy "{query}"</p>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                            onClick={onCreateClick}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Tạo mới "{query}"
                                        </Button>
                                    </div>
                                ) : (
                                    "Không có dữ liệu."
                                )}
                            </CommandEmpty>
                        )}

                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={String(item.id)} // Value for internal Command management
                                    onSelect={() => onSelect(item)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="truncate font-medium">{item.label}</span>
                                        {item.subtitle && (
                                            <span className="truncate text-xs text-muted-foreground">
                                                {item.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}

                            {/* Infinite scroll trigger element */}
                            {hasMore && (
                                <div ref={loadMoreRef} className="py-2 flex justify-center">
                                    {loading && <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
