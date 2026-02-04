"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { searchCustomersAdvanced, createCustomer } from "@/actions/crm/customers";
import { SearchContext, SearchFilter, SelectItem, SearchRequest } from "@/types/smart-select";
import { toast } from "sonner";

export function useSmartCustomerSearch(
    context: SearchContext = {},
    filter: SearchFilter = {}
) {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300); // 300ms debounce

    const [items, setItems] = useState<SelectItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);

    // Anti-race condition
    const currentRequestId = useRef<string>("");

    const search = useCallback(async (
        q: string,
        reset: boolean = false,
        customContext?: SearchContext
    ) => {
        const requestId = Math.random().toString(36).substring(7);
        currentRequestId.current = requestId;

        setLoading(true);

        try {
            const req: SearchRequest = {
                q,
                context: { ...context, ...customContext },
                filter,
                limit: 10,
                cursor: reset ? null : cursor
            };

            // If reset, we pass cursor: null. If loading more, we use current cursor state.
            // Wait, logic issue: if reset is true, we should ignore current cursor state inside the function call,
            // but we rely on state `cursor` which might be stale if we don't pass it carefully.
            // Better: 'cursor' arg in searchCustomersAdvanced.

            if (reset) {
                req.cursor = null;
            }

            const res = await searchCustomersAdvanced(req);

            // Check race condition
            if (currentRequestId.current !== requestId) {
                return;
            }

            if (reset) {
                setItems(res.items);
            } else {
                setItems(prev => [...prev, ...res.items]);
            }

            setCursor(res.nextCursor || null);
            setHasMore(!!res.nextCursor);

        } catch (error) {
            console.error("Search error", error);
            // Optional: Toast error
        } finally {
            if (currentRequestId.current === requestId) {
                setLoading(false);
            }
        }
    }, [context, filter, cursor]); // Dependency on cursor is tricky for infinite load. 
    // Usually we don't depend on cursor for the function definition, but for the 'loadMore' call.

    // Effect for Query change
    useEffect(() => {
        search(debouncedQuery, true);
    }, [debouncedQuery]); // Intentionally minimal deps

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            search(debouncedQuery, false);
        }
    }, [loading, hasMore, debouncedQuery, search]);

    const handleCreate = async (name: string) => {
        if (!context.createEnabled) return null;

        try {
            setLoading(true);
            const payload = {
                name,
                ...context.defaultCreatePayload
            };


            const res = await createCustomer(payload);
            if (res.success && res.data) {
                const newItem: SelectItem = {
                    id: res.data.id,
                    label: res.data.name,
                    subtitle: [res.data.phone, res.data.email].filter(Boolean).join(" • "),
                    meta: res.data
                };

                // Add to list and select logic should be handled by consumer, 
                // but here we can at least return it
                return newItem;
            } else {
                toast.error(res.error || "Tạo mới thất bại");
                return null;
            }
        } catch (e) {
            console.error(e);
            toast.error("Lỗi hệ thống khi tạo mới");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        query,
        setQuery,
        items,
        loading,
        hasMore,
        loadMore,
        handleCreate
    };
}
