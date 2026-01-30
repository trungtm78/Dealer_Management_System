import {
    LayoutDashboard,
    Users,
    Calendar,
    Wrench,
    Package,
    Shield,
    DollarSign,
    Settings,
    Bell,
    User,
    Award,
    FileText,
    Target,
    BarChart3,
    Car,
    Archive,
    ClipboardList,
    CheckSquare,
    Activity,
    Package2,
    Truck,
    Clock,
    ArrowDownUp,
    ShoppingCart,
    Tag,
    RotateCcw,
    AlertCircle,
    Receipt,
    TrendingUp,
    Scale,
    Wallet,
    CreditCard,
    FileCheck,
    PieChart,
    Building2,
    TrendingDown,
    MessageSquare,
    Smile,
    Phone,
    UserCog,
    Monitor,
    Gift,
    FilePlus,
    Tags,
    ClipboardCheck,
    LineChart,
    ArrowDownLeft, // Receivables
    ArrowUpRight, // Payables
    BadgeDollarSign,
    BarChart4,
    Building,
    Calculator,
    FileBarChart,
    Megaphone,
} from "lucide-react";

export interface MenuItem {
    id: string;
    label: string;
    icon: any;
    href: string; // Added href for Next.js routing
}

export interface MenuGroup {
    title: string;
    icon: any;
    items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
    {
        title: "Tổng Quan",
        icon: LayoutDashboard,
        items: [
            {
                id: "dashboard",
                label: "Dashboard Điều Hành",
                icon: LayoutDashboard,
                href: "/dashboard"
            },
        ],
    },
    {
        title: "CRM",
        icon: Award,
        items: [
            { id: "leads", label: "Quản Lý Leads", icon: Users, href: "/crm/leads" },
            { id: "customers", label: "Khách Hàng", icon: User, href: "/crm/customers" },
            {
                id: "lead-scoring",
                label: "Chấm Điểm Lead",
                icon: Target,
                href: "/crm/scoring"
            },
            {
                id: "lead-source",
                label: "Hiệu Quả Nguồn Lead",
                icon: BarChart3,
                href: "/crm/sources"
            },
            {
                id: "lead-activities",
                label: "Lịch Sử & Hoạt Động",
                icon: Activity,
                href: "/crm/activities"
            },
            {
                id: "maintenance-reminder",
                label: "Nhắc Bảo Dưỡng",
                icon: Bell,
                href: "/crm/reminders"
            },
            {
                id: "loyalty-program",
                label: "Chương Trình Loyal",
                icon: Smile,
                href: "/crm/loyalty"
            },
            {
                id: "post-sales-care",
                label: "Chăm Sóc Sau Bán",
                icon: Phone,
                href: "/crm/care"
            },
            {
                id: "complaint-management",
                label: "Quản Lý Khiếu Nại",
                icon: AlertCircle,
                href: "/crm/complaints"
            },
            {
                id: "marketing",
                label: "Chiến Dịch Marketing",
                icon: Megaphone,
                href: "/crm/marketing"
            },
        ],
    },
    {
        title: "Bán Hàng",
        icon: Users,
        items: [
            {
                id: "quotation",
                label: "Tạo Báo Giá",
                icon: FilePlus, // Changed from FileText
                href: "/sales/quotation"
            },
            {
                id: "quotation-list",
                label: "Danh Sách Báo Giá",
                icon: FileText,
                href: "/sales/quotations"
            },
            {
                id: "test-drive",
                label: "Lịch Lái Thử",
                icon: Calendar,
                href: "/sales/test-drive"
            },
            {
                id: "test-drive-detail",
                label: "Chi Tiết Lái Thử",
                icon: Car,
                href: "/sales/test-drives"
            },
            {
                id: "vin-allocation",
                label: "Phân Bổ VIN",
                icon: Tags, // Changed from Car to avoid duplicate
                href: "/sales/vin-allocation"
            },
            {
                id: "vin-availability",
                label: "Tồn Kho VIN",
                icon: Archive,
                href: "/sales/vin-inventory"
            },
            {
                id: "deposit-management",
                label: "Quản Lý Đặt Cọc",
                icon: CreditCard, // Changed from Gift
                href: "/sales/deposits"
            },
            {
                id: "pds-delivery",
                label: "Giao Hàng PDS",
                icon: ClipboardCheck, // Changed from Bell
                href: "/sales/pds"
            },
        ],
    },
    {
        title: "Dịch Vụ",
        icon: Wrench,
        items: [
            {
                id: "service-quotations",
                label: "Báo Giá Dịch Vụ",
                icon: FilePlus,
                href: "/service/quotations"
            },
            {
                id: "appointments",
                label: "Lịch Hẹn",
                icon: Calendar,
                href: "/service/appointments"
            },
            {
                id: "reception",
                label: "Tiếp Nhận",
                icon: ClipboardList,
                href: "/service/reception"
            },
            {
                id: "work-orders",
                label: "Lệnh Sửa Chữa (RO)",
                icon: Wrench,
                href: "/service/orders"
            },
            {
                id: "technician",
                label: "Giao Diện KTV",
                icon: Wrench,
                href: "/service/technician"
            },
            {
                id: "bay-utilization",
                label: "Sử Dụng Khoang",
                icon: Activity,
                href: "/service/bays"
            },
            {
                id: "qc-inspection",
                label: "Kiểm Tra Chất Lượng (QC)",
                icon: CheckSquare,
                href: "/service/qc"
            },
            {
                id: "settlement",
                label: "Thanh Toán",
                icon: DollarSign,
                href: "/service/settlement"
            },
        ],
    },
    {
        title: "Phụ Tùng",
        icon: Package,
        items: [
            {
                id: "inventory",
                label: "Tổng Quan Tồn Kho",
                icon: Package,
                href: "/parts/inventory"
            },
            { id: "parts", label: "Hàng Backorder", icon: Truck, href: "/parts/backorder" },
            {
                id: "stock-movement",
                label: "Nhập Xuất Kho",
                icon: ArrowDownUp,
                href: "/parts/movements"
            },
            {
                id: "purchase-requisition",
                label: "Yêu Cầu Mua Hàng",
                icon: ShoppingCart,
                href: "/parts/purchases"
            },
            {
                id: "aging-analysis",
                label: "Phân Tích Tuổi Tồn",
                icon: Clock,
                href: "/parts/aging"
            },
            {
                id: "stock-take",
                label: "Kiểm Kê Kho",
                icon: ClipboardCheck,
                href: "/parts/stock-take"
            },
            {
                id: "picking-packing",
                label: "Lấy & Đóng Gói",
                icon: Package2,
                href: "/parts/picking"
            },
            {
                id: "parts-kpi",
                label: "KPI Phụ Tùng",
                icon: BarChart4,
                href: "/parts/kpi"
            },
            {
                id: "parts-pricing",
                label: "Định Giá PT",
                icon: Tag,
                href: "/parts/pricing"
            },
            {
                id: "return-supplier",
                label: "Trả Hàng NCC",
                icon: RotateCcw,
                href: "/parts/return"
            },
        ],
    },
    {
        title: "Bảo Hiểm",
        icon: Shield,
        items: [
            {
                id: "insurance-dashboard",
                label: "Tổng Quan Bảo Hiểm",
                icon: LayoutDashboard,
                href: "/insurance/dashboard"
            },
            {
                id: "insurance-contracts",
                label: "Danh Sách Hợp Đồng",
                icon: FileText,
                href: "/insurance/contracts"
            },
            {
                id: "insurance-contract-detail",
                label: "Chi Tiết Hợp Đồng",
                icon: FileText,
                href: "/insurance/contract-detail"
            },
            {
                id: "insurance-claims",
                label: "Danh Sách Bồi Thường",
                icon: DollarSign,
                href: "/insurance/claims"
            },
            {
                id: "insurance-claim-detail",
                label: "Chi Tiết Bồi Thường",
                icon: ClipboardList,
                href: "/insurance/claim-detail"
            },
        ],
    },
    {
        title: "Kế Toán",
        icon: DollarSign,
        items: [
            {
                id: "accounting-dashboard",
                label: "Dashboard Tài Chính",
                icon: LayoutDashboard,
                href: "/accounting/dashboard"
            },
            {
                id: "pnl-report",
                label: "Báo Cáo Lãi Lỗ",
                icon: TrendingUp,
                href: "/accounting/pnl"
            },
            {
                id: "balance-sheet",
                label: "Bảng Cân Đối KT",
                icon: Scale,
                href: "/accounting/balance-sheet"
            },
            {
                id: "cashflow",
                label: "Lưu Chuyển Tiền Tệ",
                icon: Wallet,
                href: "/accounting/cashflow"
            },
            {
                id: "receivables",
                label: "Công Nợ Phải Thu",
                icon: ArrowDownLeft,
                href: "/accounting/receivables"
            },
            {
                id: "payables",
                label: "Công Nợ Phải Trả",
                icon: ArrowUpRight,
                href: "/accounting/payables"
            },
            {
                id: "tax-report",
                label: "Báo Cáo Thuế",
                icon: FileCheck,
                href: "/accounting/tax"
            },
            {
                id: "management-report",
                label: "Báo Cáo Quản Lý",
                icon: PieChart,
                href: "/accounting/management"
            },
            {
                id: "fixed-assets",
                label: "Quản Lý Tài Sản Cố Định",
                icon: Building2,
                href: "/accounting/assets"
            },
            {
                id: "depreciation",
                label: "Quản Lý Khấu Hao",
                icon: TrendingDown,
                href: "/accounting/depreciation"
            },
            {
                id: "profit-analysis",
                label: "Phân Tích Chi Phí & Lợi Nhuận",
                icon: MessageSquare,
                href: "/accounting/analysis"
            },
        ],
    },
    {
        title: "Quản Trị",
        icon: Settings,
        items: [
            {
                id: "user-management",
                label: "Quản Lý Người Dùng",
                icon: UserCog,
                href: "/admin/users"
            },
            {
                id: "system-monitoring",
                label: "Giám Sát Hệ Thống",
                icon: Monitor,
                href: "/admin/monitoring"
            },
            {
                id: "api-configuration",
                label: "Cấu Hình API",
                icon: Settings,
                href: "/admin/api"
            },
        ],
    },
];
