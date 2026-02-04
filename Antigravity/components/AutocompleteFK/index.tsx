"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ResourceItem {
    id: number;
    name: string;
    code?: string;
    [key: string]: any;
}

export interface AutocompleteFKProps {
    resource: string;
    value: number | null;
    onChange: (id: number | null, item: ResourceItem | null) => void;
    label: string;
    placeholder?: string;
    displayField?: string;
    searchFields?: string[];
    required?: boolean;
    disabled?: boolean;
    pageSize?: number;
    debounceMs?: number;
    canCreate?: boolean;
    createRoute?: string;
    createPermission?: string;
    filters?: Record<string, any>;
    className?: string;
    error?: string;
    "data-testid"?: string;
}

export function AutocompleteFK({
    resource,
    value,
    onChange,
    label,
    placeholder = `Chọn ${label.toLowerCase()}...`,
    displayField = "name",
    searchFields = ["name", "code"],
    required = false,
    disabled = false,
    pageSize = 5,
    debounceMs = 300,
    canCreate = false,
    createRoute,
    createPermission,
    filters = {},
    className,
    error,
    "data-testid": dataTestId,
}: AutocompleteFKProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState<ResourceItem | null>(null);

    React.useEffect(() => {
        if (value === null) {
            setSelectedItem(null);
        }
    }, [value]);

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            queryKey: ["autocomplete-fk", resource, searchQuery, filters],
            queryFn: async ({ pageParam }: { pageParam: number }) => {
                const params = new URLSearchParams({
                    page: pageParam.toString(),
                    limit: pageSize.toString(),
                    ...Object.fromEntries(
                        Object.entries(filters).map(([k, v]) => [k, String(v)])
                    ),
                });

                if (searchQuery) {
                    params.append("search", searchQuery);
                }

                const response = await fetch(`/api/${resource}?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${resource}`);
                }
                return response.json();
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage: any) => {
                if (lastPage.meta?.has_next) {
                    return lastPage.meta.page + 1;
                }
                return undefined;
            },
            staleTime: 5 * 60 * 1000,
        });

    const allItems = React.useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data]);

    const debouncedSearchQuery = React.useMemo(() => {
        return searchQuery;
    }, [searchQuery, debounceMs]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(debouncedSearchQuery);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [debouncedSearchQuery, debounceMs]);

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement;
            const isNearBottom = target.scrollHeight - target.scrollTop <= target.clientHeight * 1.1;

            if (isNearBottom && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    const handleSelect = (item: ResourceItem) => {
        setSelectedItem(item);
        onChange(item.id, item);
        setOpen(false);
    };

    const handleQuickCreate = () => {
        const formId = `autocomplete-fk-${resource}-${Date.now()}`;

        try {
            localStorage.setItem(
                `form_draft_${formId}`,
                JSON.stringify({
                    resource,
                    returnField: displayField,
                    timestamp: Date.now(),
                })
            );

            const route = createRoute || `/master/${resource}/new`;
            window.open(route, "_blank");
        } catch (error) {
            console.error("Failed to save draft:", error);
            toast.error("Không thể lưu form draft");
        }
    };

    React.useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === `new_item_created_${resource}`) {
                try {
                    const newItem = JSON.parse(e.newValue || "{}");
                    if (newItem.id && newItem.name) {
                        handleSelect(newItem);
                        toast.success(`Đã tạo ${label} mới và chọn tự động`);
                        localStorage.removeItem(`new_item_created_${resource}`);
                    }
                } catch (error) {
                    console.error("Failed to parse new item:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [resource, label, displayField]);

    const displayValue = selectedItem?.[displayField] || value ? selectedItem?.[displayField] : "";

    return (
        <div className={cn("w-full", className)} data-testid={dataTestId}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between font-normal",
                            error && "border-red-500",
                            !displayValue && "text-muted-foreground"
                        )}
                    >
                        {displayValue || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Tìm kiếm..."
                            value={debouncedSearchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList
                            className={cn(
                                "max-h-[300px]",
                                isLoading && "opacity-50"
                            )}
                            onScroll={handleScroll}
                        >
                            {isLoading && allItems.length === 0 ? (
                                <div className="py-6 text-center text-sm flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang tải...
                                </div>
                            ) : allItems.length === 0 ? (
                                <CommandEmpty className="py-6 text-center text-sm">
                                    Không tìm thấy kết quả.
                                </CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {allItems.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={String(item.id)}
                                            onSelect={() => handleSelect(item)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === item.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col flex-1">
                                                <span className="font-medium">{item[displayField]}</span>
                                                {item.code && (
                                                    <span className="text-xs text-gray-500">
                                                        {item.code}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            {isFetchingNextPage && (
                                <div className="py-2 text-center text-xs flex items-center justify-center gap-2 text-gray-500">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Đang tải thêm...
                                </div>
                            )}
                            {canCreate && !isFetching && allItems.length === 0 && debouncedSearchQuery && (
                                <CommandItem
                                    value="create-new"
                                    onSelect={handleQuickCreate}
                                    className="text-blue-600"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium">Tạo mới</span>
                                        <span className="text-xs text-gray-500">
                                            "{debouncedSearchQuery}"
                                        </span>
                                    </div>
                                </CommandItem>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
