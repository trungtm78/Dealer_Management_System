# UAT Quick Fix Guide v2.1

**Date**: 2026-01-29
**Purpose**: Quick reference for developers to fix UAT failures

---

## 🚨 CRITICAL FIXES (Required Before Production Release)

### Fix #1: Prisma Schema Mismatch - customerType → customer_type

**Files to Search**:
```bash
grep -r "customerType" --include="*.ts" --include="*.tsx" src/ actions/
```

**Expected Results** (find and replace ALL occurrences):

#### 1. `actions/crm/leads.ts` - Line 47

```typescript
// ❌ WRONG (Current)
data: {
    name: "Test User",
    phone: "0923456789",
    email: "test@example.com",
    source: "WEBSITE",
    customerType: "individual",  // ❌ WRONG
    ...
}

// ✅ CORRECT (Required)
data: {
    name: "Test User",
    phone: "0923456789",
    email: "test@example.com",
    source: "WEBSITE",
    customer_type: "individual",  // ✅ CORRECT
    ...
}
```

#### 2. `actions/crm/customers.ts` - Check all locations

Search for:
```typescript
customerType
```

Replace with:
```typescript
customer_type
```

**Verification Command**:
```bash
# Confirm no customerType remains
grep -r "customerType" src/ actions/ || echo "✅ No more customerType found"

# Verify customer_type exists (snake_case)
grep -r "customer_type" src/ actions/ | head -10
```

**Estimated Time**: 30-60 minutes to search/replace all

---

### Fix #2: Loyalty Program - Null Safety Check

**File**: `actions/crm/loyalty.ts`
**Line**: ~31-38

#### Current Code (BROKEN):
```typescript
const customerTransactions = customers.map(customer => ({
    ...customer,
    pointsEarned: customer.loyalty_transactions
        .filter(t => t.type === 'EARN')
        .reduce((sum, t) => sum + t.points, 0),
    pointsRedeemed: customer.loyalty_transactions
        .filter(t => t.type === 'REDEEM')
        .reduce((sum, t) => sum + t.points, 0),
}));
```

#### Required Fix:
```typescript
const customerTransactions = customers
    .filter(customer => customer != null)  // Add filter for null customers
    .map(customer => ({
        ...customer,
        pointsEarned: customer.loyalty_transactions
            ?.filter(t => t?.type === 'EARN')
            ?.reduce((sum, t) => sum + (t?.points || 0), 0) || 0,
        pointsRedeemed: customer.loyalty_transactions
            ?.filter(t => t?.type === 'REDEEM')
            ?.reduce((sum, t) => sum + (t?.points || 0), 0) || 0,
    }));
```

**Changes Required**:
1. Add `.filter()` for null customers
2. Add optional chaining `?.` before `.map()`
3. Add null checks for transaction objects `t?.`
4. Add default values `|| 0` for aggregation

**Test After Fix**:
```bash
npm run test:run tests/integration/loyalty.test.ts
```

**Estimated Time**: 15-30 minutes

---

### Fix #3: Customer Registration - Extra Fields Handling

**File**: `actions/crm/customers.ts`
**Line**: ~69 (createCustomer function)

#### Current Code:
```typescript
export async function createCustomer(data: CreateCustomerDto) {
    // ... validation code here
    return await prisma.customer.create({ data });
}
```

#### ⚠️ BUSINESS DECISION REQUIRED

Read both options, then choose ONE to implement:

---

### Option A: REJECT Extra Fields (Strict Validation)

**When to choose**: When data quality is more important than integration flexibility

```typescript
export async function createCustomer(data: CreateCustomerDto) {
    // Define allowed fields
    const allowedFields = [
        'name', 'type', 'phone', 'mobile', 'email',
        'street', 'ward', 'district', 'city', 'vat',
        'tier', 'points', 'total_points', 'tags', 'notes',
        'customer_id'  // for lead conversion
    ];

    // Check for extra fields
    const extraFields = Object.keys(data).filter(
        key => !allowedFields.includes(key)
    );

    if (extraFields.length > 0) {
        throw new Error(
            `Invalid fields: ${extraFields.join(', ')}. ` +
            `Only allowed fields: ${allowedFields.join(', ')}`
        );
    }

    // Proceed with validation and creation
    return await prisma.customer.create({
        data: pick(data, allowedFields)
    });
}
```

---

### Option B: IGNORE Extra Fields (Lenient Validation)

**When to choose**: When external integrations common and flexibility needed

```typescript
import { pick } from 'lodash';  // or use native utility

export async function createCustomer(data: CreateCustomerDto) {
    // Define allowed fields
    const allowedFields = [
        'name', 'type', 'phone', 'mobile', 'email',
        'street', 'ward', 'district', 'city', 'vat',
        'tier', 'points', 'total_points', 'tags', 'notes',
        'customer_id'  // for lead conversion
    ];

    // Pick only allowed fields, ignore extras silently
    const cleanedData = allowedFields.includes('data')
        ? pick(data, allowedFields)
        : data;

    // Proceed with validation and creation
    return await prisma.customer.create({
        data: cleanedData
    });

    // OR manually extract if no pick utility available:
    const {
        name, type, phone, mobile, email,
        street, ward, district, city, vat,
        tier, points, total_points, tags, notes,
        customer_id
    } = data;

    return await prisma.customer.create({
        data: {
            name, type, phone, mobile, email,
            street, ward, district, city, vat,
            tier, points, total_points, tags, notes,
            customer_id
        }
    });
}
```

---

### How to Choose:

| Factor | Option A (Reject) | Option B (Ignore) |
|--------|-------------------|-------------------|
| **Data Quality** | ✅ High - no unknown fields | ⚠️ Medium - possible pollution |
| **Integration** | ❌ Fail on external data | ✅ Flexible for integrations |
| **Security** | ✅ Secure - reject unknown | ⚠️ Lower risk |
| **Maintenance** | ✅ Clear error messages | ❌ Silent failures possible |
| **Use Case** | Strict internal apps | External-facing APIs |

**Recommendation**: For Honda DMS (dealership with external systems):

```
Choose: Option B (IGNORE Extra Fields)
Reason: External integrations common (CRM systems, OEM APIs)
Risk: Acceptable with proper logging
Add: Console.warn for ignored fields
```

---

### Fix #4: Cache Revalidation Error

**File**: `actions/crm/customers.ts`
**Line**: ~69

#### Current Code:
```typescript
export async function createCustomer(data: CreateCustomerDto) {
    // ... create customer code
    revalidatePath('/crm/customers');  // ❌ Fails in test env
    return customer;
}
```

#### Required Fix:
```typescript
export async function createCustomer(data: CreateCustomerDto) {
    // ... create customer code

    // Only revalidate in production/staging, skip in test
    if (process.env.NODE_ENV !== 'test') {
        revalidatePath('/crm/customers');
        revalidateTag('customers');
    }

    return customer;
}
```

**Alternative**: Mock in test setup (`tests/setup.ts`):
```typescript
// Add to test setup
import { vi } from 'vitest';

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
}));
```

**Estimated Time**: 15-30 minutes

---

## 📝 CHECKLIST FOR DEVELOPERS

### Pre-Fix Checklist

- [ ] Backup current code branch
- [ ] Create feature branch for fixes: `git checkout -b fix/uat-p0-critical-fixes`
- [ ] Install dependencies: `npm install`
- [ ] Run current tests to confirm failures: `npm run test:run`

### Fix Execution Order

1. [ ] **Fix customerType → customer_type** (Fix #1)
    - Run: `grep -r "customerType" src/ actions/`
    - Replace all occurrences
    - Run: `grep -r "customerType" src/ actions/ || echo "✅ Done"`
    - Commit: `git commit -am "fix: Replaced customerType with customer_type"`

2. [ ] **Fix loyalty null safety** (Fix #2)
    - Edit: `actions/crm/loyalty.ts`
    - Add null checks as shown
    - Run: `npm run test:run tests/integration/loyalty.test.ts`
    - Commit: `git commit -am "fix: Add null safety to loyalty transactions"`

3. [ ] **Decide and implement customer registration** (Fix #3)
    - Choose Option A or B
    - Edit: `actions/crm/customers.ts`
    - Run: `npm run test:run tests/integration/customer_registration.test.ts`
    - Commit: `git commit -am "fix: Implement customer extra fields handling"`

4. [ ] **Fix cache revalidation** (Fix #4)
    - Edit: `actions/crm/customers.ts` (createCustomer function)
    - OR add mock to `tests/setup.ts`
    - Run: `npm run test:run tests/integration/api_customers.test.ts`
    - Commit: `git commit -am "fix: Add test environment check for cache revalidation"`

### Post-Fix Checklist

- [ ] Run full test suite: `npm run test:run`
- [ ] Verify pass rate improved from 63.8% to 85%+
- [ ] Check no test regressions
- [ ] Document any new issues
- [ ] Create pull request for review
- [ ] Get code review approval
- [ ] Merge to main branch

---

## 🧪 VERIFICATION COMMANDS

### After All P0 Fixes

```bash
# 1. Re-run full UAT test suite
npm run test:run

# 2. Check specific module results
npm run test:run tests/integration/customer_conversion.test.ts
npm run test:run tests/integration/loyalty.test.ts
npm run test:run tests/integration/api_customers.test.ts

# 3. Verify no customerType remains
grep -r "customerType" src/ actions/ || echo "✅ Schema mismatch fixed"

# 4. Verify loyalty null safety
npm run test:run tests/integration/loyalty.test.ts

# 5. Check overall pass rate
# Expected: 85-90% (up from 63.8%)
```

---

## 📊 EXPECTED RESULTS AFTER P0 FIXES

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Tests | 94 | 94 | - |
| Passed | 60 (63.8%) | 80-85 (85-90%) | +20-25 tests |
| Failed | 25 | 9-14 | -11 to -16 tests |
| CRM Pass Rate | 40% | 85%+ | +45% |
| Overall Pass Rate | 63.8% | 85%+ | +22% |

**Critical Path (CREATE)**: 58.3% → 85%+ ✅

---

## 🚨 RISK MITIGATION

### Before Applying Fixes

1. **Create Test Branch**
   ```bash
   git checkout -b fix/uat-p0-critical-fixes
   git push origin fix/uat-p0-critical-fixes
   ```

2. **Document All Changes**
   - Keep commit messages descriptive
   - Track what was changed and why

3. **Test Incrementally**
   - Fix one issue at a time
   - Run tests after each fix
   - Don't batch all changes

### After Applying Fixes

1. **Run Full Test Suite**
   - Confirm no regressions
   - Verify all P0 issues resolved

2. **Code Review Required**
   - Get senior dev approval
   - Check for edge cases

3. **UAT Re-Execution**
   - Re-run full UAT after fixes
   - Document remaining issues
   - Update UAT reports

---

## 📞 TROUBLESHOOTING

### Issue: customerType still found after replacement

**Solution**: Check for variations:
```bash
grep -i "customertype" src/ actions/
grep -r "customer_type" . --include="*.prisma"  # Check schema
```

### Issue: Loyalty test still failing after null safety

**Solution**: Check all loyalty transaction accesses:
```bash
grep -n "loyalty_transactions" actions/crm/loyalty.ts
# Add null checks to ALL of them
```

### Issue: Cache revalidation still failing in tests

**Solution A**: Add test environment check (as shown)
**Solution B**: Add mock to `tests/setup.ts` (as shown)
**Solution C**: Disable cache revalidation in test env entirely

---

## 📦 FILES TO MODIFIED SUMMARY

### Files to Search and Modify

1. **`actions/crm/leads.ts`**
   - Replace: `customerType` → `customer_type`
   - Check all lead creation/update operations

2. **`actions/crm/customers.ts`**
   - Replace: `customerType` → `customer_type`
   - Add: Extra fields handling (Option A or B)
   - Add: Test environment check for cache

3. **`actions/crm/loyalty.ts`**
   - Add: Null safety checks for loyalty_transactions

4. **`tests/setup.ts`** (Optional)
   - Add: Next.js cache mock

### Files to Read/Review

1. `tests/integration/customer_conversion.test.ts` - Understand test expectations
2. `tests/integration/loyalty.test.ts` - Understand loyalty requirements
3. `tests/integration/customer_registration.test.ts` - Understand validation
4. `prisma/schema.prisma` - Verify field names (snake_case)

---

## 🎯 SUCCESS CRITERIA

### All P0 Fixes Applied

- [ ] No `customerType` remains in codebase
- [ ] Loyalty tests pass (2/2)
- [ ] Customer registration tests pass
- [ ] Customer API tests pass
- [ ] Cache revalidation handled in tests

### UAT Re-Execution Results

- [ ] Overall pass rate: 85%+ (up from 63.8%)
- [ ] CRM pass rate: 85%+ (up from 40%)
- [ ] Critical Path (CREATE): 85%+ (up from 58.3%)
- [ ] Quality Gates: PASS

### Production Approval Criteria

- [ ] All P0 fixes committed and reviewed
- [ ] UAT re-executed with 85%+ pass rate
- [ ] No critical blockers remain
- [ ] Documented remaining non-critical issues

---

## 📌 NOTES

- **Time Estimate**: 3-5 days for P0 fixes (6-8 hours dev time + review)
- **Risk Level**: Medium (schema changes affect multiple files)
- **Dependencies**: None (fixes are independent)
- **Testing Required**: Full UAT re-run after all P0 fixes

---

**End of Quick Fix Guide**