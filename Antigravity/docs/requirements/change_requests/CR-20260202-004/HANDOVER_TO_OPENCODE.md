# Handover to OpenCode: Quotation Module Upgrade (Enhanced)

**CR ID**: CR-20260202-004
**Date**: 2026-02-02
**Status**: READY_FOR_IMPLEMENTATION

## 1. Updated Main Documents (The ONLY Source of Truth)
OpenCode developers MUST read ONLY the following files (latest versions):

- **FRD**: `docs/requirements/FRD/frd_sales_v1.1.md` (Enhanced with detailed formulas)
- **API Spec**: `docs/design/api/api_spec_sales_v1.1.md` (Enhanced with calculation endpoints)
- **UI Spec**: `docs/design/ui/ui_spec_v1.6.md`
- **ERD Changes**: `docs/design/database/erd/erd_changes_v1.3.md`

❌ **DO NOT READ**: Draft files in `CR-20260202-004/drafts/` (Obsolete).

## 2. Implementation Scope (Detailed)

### 2.1 Database (Migration)
```sql
ALTER TABLE sales_quotations ADD COLUMN payment_method ENUM('CASH', 'INSTALLMENT') DEFAULT 'CASH';
ALTER TABLE sales_quotations ADD COLUMN bank_id VARCHAR(50) NULL;
ALTER TABLE sales_quotations ADD COLUMN prepayment_ratio DECIMAL(5,2) NULL;
ALTER TABLE sales_quotations ADD COLUMN loan_term INT NULL;
ALTER TABLE sales_quotations ADD COLUMN interest_rate DECIMAL(5,2) NULL;
ALTER TABLE sales_quotations ADD COLUMN promotions JSONB DEFAULT '[]';
ALTER TABLE sales_quotations ADD COLUMN customer_notes TEXT NULL;
ALTER TABLE sales_quotations ADD COLUMN internal_notes TEXT NULL;
ALTER TABLE sales_quotations ADD COLUMN discount DECIMAL(15,2) DEFAULT 0;
```

### 2.2 API (Backend) - Key Formulas

**OTR Calculation**:
```typescript
const otrTotal = basePrice + accessoriesTotal + servicesTotal + 
                 insurance + registrationTax + registration + otherFees;
```

**Final Total**:
```typescript
const finalTotal = otrTotal + promotionValue - discountAmount;
// Note: promotionValue is NEGATIVE (e.g., -15000000)
```

**PMT Calculation** (Installment):
```typescript
const loanAmount = finalTotal * (1 - prepaymentRatio);
const monthlyRate = (interestRate / 12) / 100;
const numPayments = loanTerm;

const monthlyPayment = loanAmount * 
  (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
  (Math.pow(1 + monthlyRate, numPayments) - 1);
```

**Profit Analysis**:
```typescript
// Cost Breakdown
const manufacturerCost = 1150000000; // Fixed for CR-V
const accessoryCost = accessoriesTotal * 0.7;
const serviceCost = servicesTotal * 0.5;
const promotionCost = Math.abs(promotionValue);
const discountCost = discountAmount;
const operatingCost = 25000000;
const marketingCost = 15000000;
const actualCommissionAmount = parseFloat(actualCommission) || 40000000;

const totalCost = manufacturerCost + accessoryCost + serviceCost + 
                  insurance + registrationTax + registration + otherFees +
                  operatingCost + marketingCost + promotionCost + 
                  discountCost + actualCommissionAmount;

const grossProfit = totalRevenue - totalCost;
const profitMargin = (grossProfit / totalRevenue) * 100;
```

**Margin Status**:
- `profitMargin >= 15%` → "GOOD" (Green)
- `10% <= profitMargin < 15%` → "MEDIUM" (Orange)
- `5% <= profitMargin < 10%` → "LOW" (Yellow)
- `profitMargin < 5%` → "CRITICAL" (Red)
- `profitMargin < 0%` → "LOSS" (Red)

### 2.3 Frontend (React/Next.js) - ⭐ MAXIMIZE REFS CODE REUSE ⭐

**CRITICAL INSTRUCTION**: Tận dụng tối đa source code từ Refs để tiết kiệm thời gian và đảm bảo chất lượng.

#### 2.3.1 Code Reuse Strategy

**Step 1: Copy Refs Components**
```bash
# Copy QuotationForm.tsx từ Refs
cp C:/Honda/Antigravity/Refs/src/app/components/QuotationForm.tsx \
   C:/Honda/Antigravity/components/sales/QuotationForm.tsx

# Copy QuotationList.tsx từ Refs
cp C:/Honda/Antigravity/Refs/src/app/components/QuotationList.tsx \
   C:/Honda/Antigravity/components/sales/QuotationList.tsx
```

**Step 2: Adapt Import Paths**
Sau khi copy, chỉ cần sửa các import paths:

```typescript
// BEFORE (Refs)
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';

// AFTER (Current)
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
```

**Step 3: Integrate with Current Services**
Thay thế mock data bằng API calls:

```typescript
// BEFORE (Refs - Mock Data)
const basePrice = 1319000000;
const accessories = [...]; // Static array

// AFTER (Current - API Integration)
const { data: vehicleData } = await fetch('/api/vehicles/' + modelId);
const basePrice = vehicleData.basePrice;

const { data: accessories } = await fetch('/api/accessories');
```

**Step 4: Connect to Backend APIs**
```typescript
// Save Quotation
const handleSave = async () => {
  const payload = {
    customer_id: customerId,
    model: selectedModel,
    version: selectedVersion,
    price_components: { basePrice, insurance, ... },
    accessories: selectedAccessories,
    services: selectedServices,
    promotions: selectedPromotions.map(id => {
      const promo = promotions.find(p => p.id === id);
      return { type: promo.type, value: promo.value, description: promo.desc };
    }),
    payment_info: {
      method: paymentMethod,
      bank_id: selectedBank,
      prepayment_ratio: prepaymentRatio,
      loan_term: loanTerm,
      interest_rate: interestRate
    },
    notes: {
      customer: customerNotes,
      internal: internalNotes
    }
  };

  await fetch('/api/sales/quotations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
```

#### 2.3.2 Files to Copy from Refs (Complete List)

| Refs File | Target Location | Adaptation Required |
|-----------|----------------|---------------------|
| `Refs/src/app/components/QuotationForm.tsx` | `components/sales/QuotationForm.tsx` | ✅ Import paths, API integration |
| `Refs/src/app/components/QuotationList.tsx` | `components/sales/QuotationList.tsx` | ✅ Import paths, API integration |
| `Refs/src/app/components/VoIPModal.tsx` (if exists) | `components/sales/VoIPModal.tsx` | ✅ Import paths only |

#### 2.3.3 What to Keep AS-IS from Refs

**✅ KEEP 100% (No Changes Needed)**:
- All calculation logic (lines 50-160 in QuotationForm.tsx)
- All UI components structure (Tabs, Cards, Dialogs)
- All state management (useState hooks)
- All formatting functions (`formatPrice`)
- All color-coding logic (Margin warnings)
- All Collapsible sections
- All Commission scenarios buttons

**✅ KEEP with Minor Tweaks**:
- Mock data arrays (accessories, services, promotions) → Replace with API fetch
- Static constants (basePrice, manufacturerCost) → Fetch from backend or config

**❌ REMOVE**:
- Any Refs-specific routing (if different from Next.js)
- Translation context (if not used in current app)

#### 2.3.4 Detailed Adaptation Checklist

**QuotationForm.tsx**:
- [ ] Copy file from Refs
- [ ] Update all `import './ui/*'` to `import '@/components/ui/*'`
- [ ] Replace mock accessories array with `const { data: accessories } = useSWR('/api/accessories')`
- [ ] Replace mock services array with `const { data: services } = useSWR('/api/services')`
- [ ] Replace mock promotions array with `const { data: promotions } = useSWR('/api/promotions')`
- [ ] Implement `handleSave()` to call `POST /api/sales/quotations`
- [ ] Implement `handlePrint()` to call `GET /api/sales/quotations/{id}/pdf`
- [ ] Keep ALL calculation logic unchanged (lines 130-146)
- [ ] Keep ALL UI structure unchanged (Tabs, Payment, Analysis, Notes)

**QuotationList.tsx**:
- [ ] Copy file from Refs
- [ ] Update import paths
- [ ] Replace mock quotations array with `const { data: quotations } = useSWR('/api/sales/quotations')`
- [ ] Implement VOIP call handler (or remove if not needed)
- [ ] Implement Email handler to call backend
- [ ] Implement PDF export handler
- [ ] Keep ALL dashboard stats calculation logic
- [ ] Keep ALL table structure and action icons

#### 2.3.5 Testing After Adaptation

**Unit Tests** (Keep from Refs if available):
- Calculation logic tests (OTR, PMT, Profit)
- Margin warning logic tests

**Integration Tests**:
- Test API calls work correctly
- Test data saves to database
- Test PDF generation works

**UI Tests**:
- Test all 5 tabs render correctly
- Test Commission scenarios update profit
- Test Collapsible sections expand/collapse
- Test Promotion add/remove works

---

**SUMMARY**: Copy Refs files → Update imports → Connect APIs → Test. Estimated time: **2-3 hours** instead of 2-3 days from scratch.

## 3. Verification Focus
- ✅ Payment Tab: PMT calculation matches formula
- ✅ Promotions: Dynamic add/remove, correct total calculation
- ✅ Analysis Tab: Profit margin color-coding works
- ✅ Commission Scenarios: Quick buttons update profit correctly
- ✅ Notes: Customer/Internal notes save separately
- ✅ List Dashboard: Stats cards show correct aggregations

## 4. Reference Implementation
**Golden Source**: `C:/Honda/Antigravity/Refs/src/app/components/QuotationForm.tsx`
- Lines 50-160: Calculation constants and formulas
- Lines 943-1088: Payment Tab UI
- Lines 1090-1400: Analysis Tab UI with Collapsible sections

**Key Constants** (from Refs):
- `manufacturerCost = 1,150,000,000`
- `standardCommission = 40,000,000`
- `operatingCost = 25,000,000`
- `marketingCost = 15,000,000`
- `accessoryCostRate = 0.7`
- `serviceCostRate = 0.5`
