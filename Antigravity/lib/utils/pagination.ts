export interface PaginationParams {
    search?: string;
    page?: number;
    limit?: number;
    [key: string]: any;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export function parsePaginationParams(
    searchParams: URLSearchParams,
    defaultLimit: number = 5
): PaginationParams & { limit: number; page: number } {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    let limit = parseInt(searchParams.get("limit") || String(defaultLimit));
    
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;

    const search = searchParams.get("search") || undefined;

    return {
        page,
        limit,
        search,
    };
}

export function buildPaginationMeta(
    total: number,
    page: number,
    limit: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
    };
}

export function buildSearchWhereClause(
    search: string | undefined,
    searchFields: string[] = ["name", "code"]
): { OR?: Array<Record<string, any>> } | {} {
    if (!search || searchFields.length === 0) {
        return {};
    }

    return {
        OR: searchFields.map((field) => ({
            [field]: {
                contains: search,
            },
        })),
    };
}

export function calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
}
