# UI Spec Changes v1.2 (CR-003)

**Document**: UI Specification  
**Version**: v1.1 → v1.2  
**Change Type**: MINOR (Adding new screen + 6 components)  
**CR-ID**: CR-003  
**Date**: 2026-01-29

---

## CHANGE SUMMARY

**Added**: BayUtilization screen + 6 new components

**Reference**: `C:\Honda\Antigravity\Refs\src\app\components\BayUtilization.tsx`

---

## NEW SCREEN: BayUtilization

**Route**: `/service/bays`  
**File**: `app/(main)/service/bays/page.tsx`  
**Access**: Service Advisor, Service Manager, Admin

### Layout Structure

```
BayUtilizationDashboard
├── Header (breadcrumb + title + timestamp)
├── BayKPICards (5 KPI cards)
├── DelayedAlert (conditional)
├── BayGrid (4 columns)
│   └── BayCard (x8)
└── BayUtilizationChart
```

---

## NEW COMPONENTS

### 1. BayUtilizationDashboard

**File**: `app/(main)/service/bays/page.tsx`

**Purpose**: Main container for bay utilization screen

**Props**: None (fetches data internally)

**State**:
```typescript
interface BayUtilizationState {
  bays: Bay[];
  loading: boolean;
  error: string | null;
}
```

**Data Fetching**:
- API: GET `/api/service/bays/utilization`
- Refresh: Every 30 seconds (real-time)
- Loading state: Skeleton UI

**Styling**:
- Background: `#F6F7F9`
- Min height: `100vh`
- Padding: `24px`

---

### 2. BayKPICards

**File**: `components/service/BayKPICards.tsx`

**Purpose**: Display 5 KPI metrics

**Props**:
```typescript
interface BayKPICardsProps {
  totalBays: number;
  idleBays: number;
  workingBays: number;
  delayedBays: number;
  utilizationRate: number;
}
```

**Layout**: Grid 5 columns (responsive: 2 cols on tablet, 1 col on mobile)

**Card Styles**:
| KPI | Border | Background | Text Color |
|-----|--------|------------|------------|
| Tổng Bay | Gray | White | Gray-900 |
| Rảnh | Gray-500 left | Gray-50 | Gray-700 |
| Đang làm | Blue-500 left | Blue-50 | Blue-700 |
| Trễ hạn | Red-500 left | Red-50 | Red-700 |
| Tỷ lệ sử dụng | Green-500 left | Green-50 | Green-700 |

**Typography**:
- Label: `text-sm text-gray-600`
- Value: `text-3xl font-bold`

---

### 3. BayCard

**File**: `components/service/BayCard.tsx`

**Purpose**: Display individual bay status

**Props**:
```typescript
interface BayCardProps {
  bay: {
    id: string;
    name: string;
    status: 'idle' | 'working' | 'delayed' | 'completed';
    workOrder?: string;
    vehicle?: string;
    technician?: string;
    startTime?: string;
    estimatedEnd?: string;
    progressPercent?: number;
    delayMinutes?: number;
  };
  onAssignWork?: (bayId: string) => void;
  onViewDetails?: (bayId: string) => void;
}
```

**Layout**:
- Header: Status icon + Bay name + Status badge
- Content: Work info (if not idle) or Empty state (if idle)
- Footer: Action button

**Status Colors**:
```typescript
const statusColors = {
  idle: 'border-gray-300 bg-gray-100',
  working: 'border-blue-300 bg-blue-100',
  delayed: 'border-red-500 bg-red-100 animate-pulse',
  completed: 'border-green-300 bg-green-100',
};
```

**Idle State**:
- Icon: Clock (gray)
- Text: "Bay đang rảnh"
- Button: "Phân công công việc" (red)

**Working State**:
- Work Order ID
- Vehicle name
- Technician name
- Time: Start / Estimated End
- Progress bar (0-100%)
- Delay warning (if delayed)
- Button: "Xem chi tiết" (outline)

---

### 4. BayAssignmentDialog

**File**: `components/service/BayAssignmentDialog.tsx`

**Purpose**: Dialog to assign work order to bay

**Props**:
```typescript
interface BayAssignmentDialogProps {
  open: boolean;
  bayId: string;
  bayName: string;
  onClose: () => void;
  onConfirm: (data: AssignmentData) => Promise<void>;
}

interface AssignmentData {
  repairOrderId: string;
  estimatedEnd: string;
  notes?: string;
}
```

**Form Fields**:
1. Work Order (select dropdown)
   - Options: Pending repair orders
   - Display: WO-ID + Vehicle + Customer
2. Estimated End Time (datetime picker)
   - Min: Current time
   - Default: Current time + 2 hours
3. Notes (textarea, optional)

**Validation**:
- Work Order: Required
- Estimated End: Required, must be future time
- Notes: Max 500 characters

**Actions**:
- Cancel button (gray)
- Confirm button (red, disabled if invalid)

---

### 5. BayProgressDialog

**File**: `components/service/BayProgressDialog.tsx`

**Purpose**: Dialog to update work progress

**Props**:
```typescript
interface BayProgressDialogProps {
  open: boolean;
  assignment: {
    id: string;
    bayName: string;
    workOrder: string;
    vehicle: string;
    currentProgress: number;
  };
  onClose: () => void;
  onUpdate: (data: ProgressData) => Promise<void>;
}

interface ProgressData {
  progressPercent: number;
  notes?: string;
}
```

**Form Fields**:
1. Progress (slider 0-100%)
   - Current value displayed
   - Min: Current progress (cannot decrease)
   - Max: 100
2. Notes (textarea, optional)

**Display**:
- Bay name + Work Order
- Vehicle info
- Current progress → New progress
- Visual progress bar

**Actions**:
- Cancel button
- Update button (disabled if progress < current)

---

### 6. BayUtilizationChart

**File**: `components/service/BayUtilizationChart.tsx`

**Purpose**: Horizontal bar chart showing bay utilization

**Props**:
```typescript
interface BayUtilizationChartProps {
  totalBays: number;
  idleBays: number;
  workingBays: number;
  delayedBays: number;
  completedBays: number;
}
```

**Chart Bars** (4 bars):
| Status | Color | Label |
|--------|-------|-------|
| Rảnh | Gray-500 | "Rảnh" |
| Đang làm việc | Blue-500 | "Đang làm việc" |
| Trễ hạn | Red-500 | "Trễ hạn" |
| Hoàn thành | Green-500 | "Hoàn thành" |

**Bar Display**:
- Label + Count/Total (left)
- Horizontal bar (width = percentage)
- Height: 24px
- Border radius: Full

---

## STYLING GUIDELINES

### Colors (Tailwind)
```typescript
const colors = {
  idle: {
    border: 'border-gray-300',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: 'text-gray-500',
  },
  working: {
    border: 'border-blue-300',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: 'text-blue-500',
  },
  delayed: {
    border: 'border-red-500',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: 'text-red-500',
  },
  completed: {
    border: 'border-green-300',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: 'text-green-500',
  },
};
```

### Animations
- Delayed bay card: `animate-pulse`
- Progress bar: `transition-all duration-300`

### Responsive Grid
```css
/* Desktop */
.bay-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Tablet */
@media (max-width: 1024px) {
  .bay-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .bay-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## ICONS (lucide-react)

| Component | Icon | Size |
|-----------|------|------|
| Idle bay | Clock | 12x12 (card), 5x5 (header) |
| Working bay | Wrench | 5x5 |
| Delayed bay | AlertCircle | 5x5 (header), 6x6 (alert) |
| Completed bay | CheckCircle | 5x5 |

---

## CHANGE LOG

| Date | Version | CR-ID | Changes | Author |
|------|---------|-------|---------|--------|
| 2026-01-29 | v1.2 | CR-003 | Added BayUtilization screen + 6 components | Antigravity |

---

**Document Owner**: UI/UX Designer  
**Last Updated**: 2026-01-29  
**Status**: ✅ APPROVED

---

**End of UI Spec Changes v1.2 (CR-003)**
