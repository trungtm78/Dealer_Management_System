# ERD Changes v1.3
**Date**: 2026-02-02
**CR**: CR-20260202-004

## 1. Table: `sales_quotations`
- ADD `payment_method` ENUM('CASH', 'INSTALLMENT') DEFAULT 'CASH'
- ADD `bank_id` VARCHAR(50) NULL
- ADD `loan_ratio` DECIMAL(5,2) NULL
- ADD `loan_term` INT NULL
- ADD `interest_rate` DECIMAL(5,2) NULL
- ADD `promotions` JSONB DEFAULT '[]'
- ADD `customer_notes` TEXT NULL
- ADD `internal_notes` TEXT NULL
