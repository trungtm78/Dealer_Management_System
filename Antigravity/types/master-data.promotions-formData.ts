export type PromotionFormData = {
  promotion_code?: string;
  promotion_name: string;
  promotion_type: string;
  start_date?: string | Date;
  end_date?: string | Date;
  discount_percent?: number | null;
  discount_amount?: number | null;
  min_purchase_amount?: number | null;
  max_discount_amount?: number | null;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
};