// FRD: SCR-SVC-001
// Refs: components/service/ServiceQuoteList.tsx
// API: GET /api/service/quotations
// ERD: service_quotes, customers, services_catalog, parts
import ServiceQuoteList from '@/components/service/ServiceQuoteList';

export default function ServiceQuotationsPage() {
    return <ServiceQuoteList />;
}

