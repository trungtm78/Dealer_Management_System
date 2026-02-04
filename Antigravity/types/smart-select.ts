export type TermID = string | number;

export interface SelectItem {
    id: TermID;
    label: string;
    subtitle?: string; // code • phone • email
    meta?: any; // raw customer object
}

export interface SearchContext {
    companyId?: TermID;
    onlyActive?: boolean;
    preferredIds?: TermID[]; // IDs to show at top or prioritize
    recentIds?: TermID[]; // Previously selected IDs
    createEnabled?: boolean;
    defaultCreatePayload?: Record<string, any>; // Preset data when creating
}

export interface SearchFilter extends Record<string, any> {
    categoryId?: TermID;
    excludedIds?: TermID[];
}

export interface SearchRequest {
    q: string;
    context?: SearchContext;
    filter?: SearchFilter;
    limit: number;
    cursor?: string | null;
}

export interface SearchResponse {
    items: SelectItem[];
    nextCursor?: string | null;
}

export interface SelectDataSource {
    search(req: SearchRequest): Promise<SearchResponse>;
    create?(payload: any, ctx?: SearchContext): Promise<SelectItem>;
}
