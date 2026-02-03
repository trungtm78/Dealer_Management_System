-- Migration: CR-20260202-004 - Quotation Module Upgrade
-- Date: 2026-02-02
-- Description: Add payment info, promotions, and notes fields to sales_quotations table

-- Add payment-related columns
ALTER TABLE sales_quotations ADD COLUMN payment_method VARCHAR(20) DEFAULT 'CASH';
ALTER TABLE sales_quotations ADD COLUMN bank_id VARCHAR(50);
ALTER TABLE sales_quotations ADD COLUMN prepayment_ratio DECIMAL(5,2);
ALTER TABLE sales_quotations ADD COLUMN loan_term INTEGER;
ALTER TABLE sales_quotations ADD COLUMN interest_rate DECIMAL(5,2);

-- Add promotions column (JSON string)
ALTER TABLE sales_quotations ADD COLUMN promotions TEXT;

-- Add notes columns
ALTER TABLE sales_quotations ADD COLUMN customer_notes TEXT;
ALTER TABLE sales_quotations ADD COLUMN internal_notes TEXT;

-- Add discount column
ALTER TABLE sales_quotations ADD COLUMN discount DECIMAL(15,2) DEFAULT 0;

-- Add indexes for performance
CREATE INDEX idx_quotations_payment_method ON sales_quotations(payment_method);
CREATE INDEX idx_quotations_bank_id ON sales_quotations(bank_id);
