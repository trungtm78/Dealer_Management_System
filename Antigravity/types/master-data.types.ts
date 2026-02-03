// Master Data Types for CR-20260202-003

// Vehicle Configuration
export interface VehicleColor {
  id: string;
  color_code: string;
  color_name: string;
  hex_code: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface VehicleColorCreate {
  color_code?: string;
  color_name: string;
  hex_code: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface VehicleColorUpdate {
  color_code?: string;
  color_name?: string;
  hex_code?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export type VehicleColorFormData = VehicleColorCreate;
export type VehicleEngineFormData = VehicleEngineCreate;
export type PartCategoryFormData = PartCategoryCreate;
export type PartLocationFormData = PartLocationCreate;
export type ServiceTypeFormData = ServiceTypeCreate;
export type WarrantyTypeFormData = WarrantyTypeCreate;

export interface VehicleEngine {
  id: string;
  engine_code: string;
  engine_name: string;
  engine_capacity: string | null;
  fuel_type: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface VehicleEngineCreate {
  engine_code?: string;
  engine_name: string;
  engine_capacity?: string;
  fuel_type?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface VehicleEngineUpdate {
  engine_code?: string;
  engine_name?: string;
  engine_capacity?: string;
  fuel_type?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Parts Configuration
export interface PartCategory {
  id: string;
  category_code: string;
  category_name: string;
  parent_category_id: string | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface PartCategoryCreate {
  category_code?: string;
  category_name: string;
  parent_category_id?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PartCategoryUpdate {
  category_code?: string;
  category_name?: string;
  parent_category_id?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PartLocation {
  id: string;
  location_code: string;
  location_name: string;
  warehouse_id: string | null;
  bay_id: string | null;
  shelf_id: string | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface PartLocationCreate {
  location_code?: string;
  location_name: string;
  warehouse_id?: string | null;
  bay_id?: string | null;
  shelf_id?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PartLocationUpdate {
  location_code?: string;
  location_name?: string;
  warehouse_id?: string | null;
  bay_id?: string | null;
  shelf_id?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Service Configuration
export interface ServiceType {
  id: string;
  service_type_code: string;
  service_type_name: string;
  category: string;
  default_duration_hours: number;
  base_price: number | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ServiceTypeCreate {
  service_type_code?: string;
  service_type_name: string;
  category: string;
  default_duration_hours?: number;
  base_price?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ServiceTypeUpdate {
  service_type_code?: string;
  service_type_name?: string;
  category?: string;
  default_duration_hours?: number;
  base_price?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface WarrantyType {
  id: string;
  warranty_code: string;
  warranty_name: string;
  warranty_type: string;
  duration_months: number;
  max_kilometers: number | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface WarrantyTypeCreate {
  warranty_code?: string;
  warranty_name: string;
  warranty_type: string;
  duration_months: number;
  max_kilometers?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface WarrantyTypeUpdate {
  warranty_code?: string;
  warranty_name?: string;
  warranty_type?: string;
  duration_months?: number;
  max_kilometers?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Insurance Management
export interface InsuranceCompany {
  id: string;
  company_code: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface InsuranceCompanyCreate {
  company_code?: string;
  company_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface InsuranceCompanyUpdate {
  company_code?: string;
  company_name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface InsuranceProduct {
  id: string;
  product_code: string;
  product_name: string;
  insurance_type: string;
  premium_amount: number;
  coverage_amount: number;
  deductible_amount: number | null;
  max_claim_amount: number | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface InsuranceProductCreate {
  product_code?: string;
  product_name: string;
  insurance_type: string;
  premium_amount: number;
  coverage_amount: number;
  deductible_amount?: number;
  max_claim_amount?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface InsuranceProductUpdate {
  product_code?: string;
  product_name?: string;
  insurance_type?: string;
  premium_amount?: number;
  coverage_amount?: number;
  deductible_amount?: number;
  max_claim_amount?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Sales & Finance
export interface PaymentMethod {
  id: string;
  method_code: string;
  method_name: string;
  method_type: string;
  description: string | null;
  processing_fee: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface PaymentMethodCreate {
  method_code?: string;
  method_name: string;
  method_type: string;
  description?: string;
  processing_fee?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PaymentMethodUpdate {
  method_code?: string;
  method_name?: string;
  method_type?: string;
  description?: string;
  processing_fee?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface TaxRate {
  id: string;
  tax_code: string;
  tax_name: string;
  tax_type: string;
  rate_percent: number;
  effective_from: string;
  effective_to: string | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface TaxRateCreate {
  tax_code?: string;
  tax_name: string;
  tax_type: string;
  rate_percent: number;
  effective_from: string;
  effective_to?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface TaxRateUpdate {
  tax_code?: string;
  tax_name?: string;
  tax_type?: string;
  rate_percent?: number;
  effective_from?: string;
  effective_to?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface BankAccount {
  id: string;
  account_code: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  branch_name: string | null;
  account_type: string | null;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface BankAccountCreate {
  account_code?: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  branch_name?: string;
  account_type?: string;
  currency?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface BankAccountUpdate {
  account_code?: string;
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  branch_name?: string;
  account_type?: string;
  currency?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export type BankAccountFormData = BankAccountCreate;

export interface Promotion {
  id: string;
  promotion_code: string;
  promotion_name: string;
  promotion_type: string;
  start_date: Date;
  end_date: Date;
  discount_percent: number | null;
  discount_amount: number | null;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface PromotionCreate {
  promotion_code?: string;
  promotion_name: string;
  promotion_type: string;
  start_date: Date;
  end_date: Date;
  discount_percent?: number;
  discount_amount?: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PromotionUpdate {
  promotion_code?: string;
  promotion_name?: string;
  promotion_type?: string;
  start_date?: Date;
  end_date?: Date;
  discount_percent?: number;
  discount_amount?: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export type PromotionFormData = Omit<PromotionCreate, 'start_date' | 'end_date'> & {
  start_date?: string | Date;
  end_date?: string | Date;
};

export interface CommissionStructure {
  id: string;
  commission_code: string;
  commission_name: string;
  type: string;
  role_id: string | null;
  target: number | null;
  rate_percent: number | null;
  applicable_products: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CommissionStructureCreate {
  commission_code?: string;
  commission_name: string;
  type: string;
  role_id?: string | null;
  target?: number;
  rate_percent?: number;
  applicable_products?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CommissionStructureUpdate {
  commission_code?: string;
  commission_name?: string;
  type?: string;
  role_id?: string | null;
  target?: number;
  rate_percent?: number;
  applicable_products?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface InterestRate {
  id: string;
  rate_code: string;
  rate_name: string;
  rate_type: string;
  rate_percent: number;
  min_amount: number | null;
  max_amount: number | null;
  effective_from: string;
  effective_to: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface InterestRateCreate {
  rate_code?: string;
  rate_name: string;
  rate_type: string;
  rate_percent: number;
  min_amount?: number;
  max_amount?: number;
  effective_from: string;
  effective_to?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface InterestRateUpdate {
  rate_code?: string;
  rate_name?: string;
  rate_type?: string;
  rate_percent?: number;
  min_amount?: number;
  max_amount?: number;
  effective_from?: string;
  effective_to?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Financial Administration
export interface AccountCode {
  id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  parent_code: string | null;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface AccountCodeCreate {
  account_code?: string;
  account_name: string;
  account_type: string;
  parent_code?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface AccountCodeUpdate {
  account_code?: string;
  account_name?: string;
  account_type?: string;
  parent_code?: string | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Geographic
export interface Province {
  id: string;
  province_code: string;
  province_name: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface District {
  id: string;
  district_code: string;
  district_name: string;
  province_code: string;
  distance_from_showroom_km: number | null;
  service_zone: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Ward {
  id: string;
  ward_code: string;
  ward_name: string;
  district_code: string;
  postal_code: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

// System Configuration
export interface Holiday {
  id: string;
  holiday_code: string;
  holiday_name: string;
  holiday_date: string;
  is_recurring: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface HolidayCreate {
  holiday_code?: string;
  holiday_name: string;
  holiday_date: string;
  is_recurring?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface HolidayUpdate {
  holiday_code?: string;
  holiday_name?: string;
  holiday_date?: string;
  is_recurring?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Common API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type InsuranceCompanyFormData = InsuranceCompanyCreate;
export type InsuranceProductFormData = InsuranceProductCreate;
export type PaymentMethodFormData = PaymentMethodCreate;
export type TaxRateFormData = TaxRateCreate;
export type AccountCodeFormData = AccountCodeCreate;
export type CommissionStructureFormData = CommissionStructureCreate;
export type InterestRateFormData = InterestRateCreate;
export type HolidayFormData = HolidayCreate;
