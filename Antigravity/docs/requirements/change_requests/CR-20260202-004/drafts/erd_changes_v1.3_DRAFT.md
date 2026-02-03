# ERD Changes v1.3 [DRAFT CR-20260202-004]

## 1. Table: `sales_quotations` (Alter)

| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `payment_method` | ENUM | NO | 'CASH', 'INSTALLMENT' |
| `bank_id` | VARCHAR(50) | YES | FK to Banks |
| `loan_ratio` | DECIMAL(5,2) | YES | % Loan |
| `loan_term` | INT | YES | Months |
| `interest_rate` | DECIMAL(5,2) | YES | % Year |
| `customer_notes` | TEXT | YES | |
| `internal_notes` | TEXT | YES | |
| `promotions` | JSONB | YES | Array of promotion objects |

## 2. Table: `sales_promotions_master` (New - Optional Reference)
*To standardize promotion types if needed, or stick to JSON for flexibility as per Refs.*
*Decision: Use JSON in `sales_quotations` for now to match Refs dynamic nature.*

## 3. Migration Strategy
- `ALTER TABLE sales_quotations ADD COLUMN ...`
- Default `payment_method` = 'CASH' for existing records.
- `promotions` default '[]'.
