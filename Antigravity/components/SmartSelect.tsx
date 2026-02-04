"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Check, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import type {
    SelectItem,
    SearchContext,
    SearchFilter,
    SearchRequest,
    SearchResponse,
    SelectDataSource
} from "@/types/smart-select";

interface SmartSelectProps {
    dataSource: SelectDataSource;
    value?: string | number | null;
    onChange: (id: string | number | null, item?: SelectItem | null) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    context?: SearchContext;
    filter?: SearchFilter;
    limit?: number;
    minLength?: number;
}

export function SmartSelect({
    dataSource,
    value,
    onChange,
    label,
    placeholder,
    required,
    disabled,
    className,
    context = {},
    filter = {},
    limit = 20,
    minLength = 2
}: SmartSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setDebouncedQuery(value);
    }, 200);
    const [items, setItems] = useState<SelectItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<SelectItem | null>(null);

    const requestIdRef = useRef(0);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const { createEnabled, companyId, onlyActive } = context;

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const performSearch = useCallback(async (reset: boolean = true) => {
        const currentRequestId = ++requestIdRef.current;

        setLoading(true);

        try {
            const searchRequest: SearchRequest = {
                q: debouncedQuery,
                context: {
                    ...context,
                    companyId,
                    onlyActive: onlyActive ?? true
                },
                filter,
                limit,
                cursor: reset ? null : nextCursor
            };

            const response = await dataSource.search(searchRequest);

            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            setItems(prev => reset ? response.items : [...prev, ...response.items]);
            setNextCursor(response.nextCursor ?? null);
        } catch (error) {
            console.error("SmartSelect search error:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, dataSource, context, filter, limit, nextCursor]);

    useEffect(() => {
        if (open) {
            performSearch(true);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            performSearch(true);
        }
    }, [debouncedQuery, open]);

    useEffect(() => {
        if (value) {
            const found = items.find(item => item.id === value);
            if (found) {
                setSelectedItem(found);
            }
        } else {
            setSelectedItem(null);
        }
    }, [value, items]);

    const handleSelect = useCallback(async (selectedId: string | number) => {
        const item = items.find(i => i.id === selectedId);
        onChange(selectedId, item || null);
        setSelectedItem(item || null);
        setOpen(false);
        setSearchQuery("");
    }, [items, onChange]);

    const handleCreate = useCallback(async () => {
        if (!dataSource.create || !createEnabled || debouncedQuery.length < minLength) {
            return;
        }

        try {
            const newItem = await dataSource.create(
                { name: debouncedQuery, ...context.defaultCreatePayload },
                context
            );
            onChange(newItem.id, newItem);
            setSelectedItem(newItem);
            setOpen(false);
            setSearchQuery("");
        } catch (error) {
            console.error("SmartSelect create error:", error);
        }
    }, [dataSource, createEnabled, debouncedQuery, minLength, context, onChange]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        if (scrollPercentage >= 0.9 && nextCursor && !loading) {
            performSearch(false);
        }
    }, [nextCursor, loading, performSearch]);

    const handleClear = useCallback(() => {
        onChange(null, null);
        setSelectedItem(null);
        setSearchQuery("");
    }, [onChange]);

    const showCreateOption = createEnabled &&
        debouncedQuery.length >= minLength &&
        !loading &&
        items.length === 0;

    const exactMatch = items.some(item =>
        item.label.toLowerCase() === debouncedQuery.toLowerCase() ||
        item.subtitle?.toLowerCase() === debouncedQuery.toLowerCase()
    );

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label className={cn(required && "after:content-['*'] after:ml-1 after:text-red-500")}>
                    {label}
                </Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            !selectedItem && "text-muted-foreground"
                        )}
                    >
                        {selectedItem ? (
                            <div className="flex flex-col items-start">
                                <span>{selectedItem.label}</span>
                                {selectedItem.subtitle && (
                                    <span className="text-xs text-muted-foreground">
                                        {selectedItem.subtitle}
                                    </span>
                                )}
                            </div>
                        ) : (
                            placeholder || "Chọn..."
                        )}
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
                        <ScrollArea
                            ref={scrollAreaRef}
                            className="h-[300px]"
                            onScroll={handleScroll}
                        >
                            <CommandList>
                                {loading && items.length === 0 ? (
                                    <div className="py-4 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : items.length === 0 ? (
                                    showCreateOption && !exactMatch ? (
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={handleCreate}
                                                className="cursor-pointer"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tạo "{debouncedQuery}"
                                            </CommandItem>
                                        </CommandGroup>
                                    ) : (
                                        <CommandEmpty>
                                            {debouncedQuery.length < minLength
                                                ? `Nhập ít nhất ${minLength} ký tự`
                                                : "Không tìm thấy kết quả"}
                                        </CommandEmpty>
                                    )
                                ) : (
                                    <CommandGroup>
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={String(item.id)}
                                                onSelect={() => handleSelect(item.id)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === item.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span>{item.label}</span>
                                                    {item.subtitle && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {item.subtitle}
                                                        </span>
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                        {showCreateOption && !exactMatch && (
                                            <CommandItem
                                                onSelect={handleCreate}
                                                className="cursor-pointer mt-2"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tạo "{debouncedQuery}"
                                            </CommandItem>
                                        )}
                                        {loading && nextCursor && (
                                            <div className="py-2 flex items-center justify-center">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            </div>
                                        )}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </ScrollArea>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedItem && !disabled && (
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
