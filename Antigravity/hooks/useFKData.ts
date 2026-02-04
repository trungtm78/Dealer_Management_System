import { useState, useEffect } from 'react';

interface UseFKDataOptions {
    entityName: string;
    status?: string;
    enabled?: boolean;
    cacheTTL?: number; // milliseconds
}

interface UseFKDataReturn<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

interface CacheEntry<T> {
    data: T[];
    timestamp: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>();

/**
 * Reusable hook for fetching Foreign Key dropdown data
 * with built-in caching and error handling
 */
export function useFKData<T extends { id: string; name: string }>(
    options: UseFKDataOptions
): UseFKDataReturn<T> {
    const {
        entityName,
        status = 'ACTIVE',
        enabled = true,
        cacheTTL = 300000 // 5 minutes default
    } = options;

    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchFn = async () => {
        if (!enabled) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const cacheKey = `${entityName}_${status}`;
            const cached = cache.get(cacheKey);

            // Check cache
            if (cached && Date.now() - cached.timestamp < cacheTTL) {
                setData(cached.data);
                setLoading(false);
                return;
            }

            // Fetch from API
            const params = new URLSearchParams({
                for_dropdown: 'true',
                status
            });

            const response = await fetch(`/api/${entityName}?${params}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${entityName}`);
            }

            const result = await response.json();

            // Cache the result
            cache.set(cacheKey, {
                data: result.data || [],
                timestamp: Date.now()
            });

            setData(result.data || []);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFn();
    }, [entityName, status, enabled]);

    return { data, loading, error, refetch: fetchFn };
}
