/**
 * Entity-Specific Validation Middleware
 * Applies validations to specific entities based on UAT bugs
 */

import { ValidationRules, CommonValidators, ValidationError } from './validators';

export const EntityValidators = {
  /**
   * Inventory/Parts Validation
   * BUG-021: Parts required fields, positive quantities, valid prices
   */
  parts: (data: any) => {
    if (!data.name || !data.name.trim()) {
      throw new ValidationError('Tên phụ tùng là bắt buộc');
    }
    if (!data.sku_code || !data.sku_code.trim()) {
      throw new ValidationError('Mã SKU là bắt buộc');
    }
    if (data.unit_price !== undefined) {
      ValidationRules.positiveDecimal(parseFloat(data.unit_price), 'Đơn giá');
    }
    if (data.quantity !== undefined) {
      if (isNaN(data.quantity) || data.quantity < 0) {
        throw new ValidationError('Số lượng không thể là số âm');
      }
    }
    if (data.min_stock_level !== undefined) {
      if (data.min_stock_level < 0) {
        throw new ValidationError('Mức tồn kho tối thiểu không thể là số âm');
      }
    }
  },

  /**
   * Vehicle Models Validation
   * BUG-022: Model required fields, valid prices
   */
  vehicleModels: (data: any) => {
    if (!data.name || !data.name.trim()) {
      throw new ValidationError('Tên dòng xe là bắt buộc');
    }
    if (!data.year || data.year < 2000 || data.year > new Date().getFullYear() + 1) {
      throw new ValidationError('Năm sản xuất không hợp lệ');
    }
    if (data.base_price !== undefined) {
      ValidationRules.positiveDecimal(parseFloat(data.base_price), 'Giá cơ bản');
    }
  },

  /**
   * Suppliers Validation
   * BUG-023: Supplier required fields, valid contact info
   */
  suppliers: (data: any) => {
    if (!data.name || !data.name.trim()) {
      throw new ValidationError('Tên nhà cung cấp là bắt buộc');
    }
    if (!data.contact_person || !data.contact_person.trim()) {
      throw new ValidationError('Người liên hệ là bắt buộc');
    }
    if (data.contact_phone) {
      ValidationRules.phone(data.contact_phone);
    }
    if (data.contact_email) {
      ValidationRules.email(data.contact_email);
    }
  },

  /**
   * Vehicle Engines Validation
   * BUG-030: Engine required fields, valid values
   */
  vehicleEngines: (data: any) => {
    if (!data.engine_name || !data.engine_name.trim()) {
      throw new ValidationError('Tên động cơ là bắt buộc');
    }
    if (!data.engine_code || !data.engine_code.trim()) {
      throw new ValidationError('Mã động cơ là bắt buộc');
    }
    if (data.fuel_type && !['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].includes(data.fuel_type)) {
      throw new ValidationError('Loại nhiên liệu không hợp lệ. Các giá trị hợp lệ: PETROL, DIESEL, ELECTRIC, HYBRID');
    }
    if (data.engine_capacity && data.engine_capacity <= 0) {
      throw new ValidationError('Công suất động cơ phải lớn hơn 0');
    }
  },

  /**
   * Vehicle Colors Validation
   * BUG-031: Color required fields
   */
  vehicleColors: (data: any) => {
    if (!data.color_name || !data.color_name.trim()) {
      throw new ValidationError('Tên màu là bắt buộc');
    }
    if (!data.color_code || !data.color_code.trim()) {
      throw new ValidationError('Mã màu là bắt buộc');
    }
  },

  /**
   * Promotions Validation
   * BUG-024: Promotion date validation, valid discount rates
   */
  promotions: (data: any) => {
    if (!data.name || !data.name.trim()) {
      throw new ValidationError('Tên khuyến mãi là bắt buộc');
    }
    if (data.start_date && data.end_date) {
      CommonValidators.validateDateRange(new Date(data.start_date), new Date(data.end_date), 'Khuyến mãi');
    }
    if (data.discount_type && !['PERCENTAGE', 'FIXED_AMOUNT'].includes(data.discount_type)) {
      throw new ValidationError('Loại giảm giá không hợp lệ');
    }
    if (data.discount_value !== undefined) {
      const discount = parseFloat(data.discount_value);
      if (isNaN(discount) || discount <= 0) {
        throw new ValidationError('Giá trị giảm giá phải là số dương');
      }
      if (data.discount_type === 'PERCENTAGE' && discount > 100) {
        throw new ValidationError('Giảm giá theo phần trăm không thể vượt quá 100%');
      }
    }
  },

  /**
   * Insurance Contracts Validation
   * BUG-025: Contract required fields, valid dates, valid amounts
   */
  insuranceContracts: (data: any) => {
    if (!data.policy_number || !data.policy_number.trim()) {
      throw new ValidationError('Số hợp đồng bảo hiểm là bắt buộc');
    }
    if (!data.premium_amount || parseFloat(data.premium_amount) <= 0) {
      throw new ValidationError('Số tiền phí bảo hiểm phải lớn hơn 0');
    }
    if (data.sum_insured && parseFloat(data.sum_insured) <= 0) {
      throw new ValidationError('Số tiền bảo hiểm phải lớn hơn 0');
    }
    if (data.start_date && data.end_date) {
      CommonValidators.validateDateRange(new Date(data.start_date), new Date(data.end_date), 'Hợp đồng bảo hiểm');
    }
  },

  /**
   * Warehouse Validation
   * BUG-026: Warehouse required fields, valid capacity
   */
  warehouses: (data: any) => {
    if (!data.warehouse_name || !data.warehouse_name.trim()) {
      throw new ValidationError('Tên kho là bắt buộc');
    }
    if (!data.location_address || !data.location_address.trim()) {
      throw new ValidationError('Địa chỉ kho là bắt buộc');
    }
    if (data.contact_person && !data.contact_person.trim()) {
      throw new ValidationError('Người liên hệ kho là bắt buộc');
    }
    if (data.contact_phone && !/^\d{10}$/.test(data.contact_phone)) {
      throw new ValidationError('Số điện thoại liên hệ phải có 10 chữ số');
    }
    if (data.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
      throw new ValidationError('Email liên hệ không đúng định dạng');
    }
  },

  /**
   * Shipping/Order Validation
   * BUG-027: Order required fields, valid shipping dates
   */
  orders: (data: any) => {
    if (!data.customer_id) {
      throw new ValidationError('Khách hàng là bắt buộc');
    }
    if (data.total_amount && parseFloat(data.total_amount) <= 0) {
      throw new ValidationError('Tổng số tiền đơn hàng phải lớn hơn 0');
    }
    if (data.shipping_date) {
      ValidationRules.futureDateOnly(new Date(data.shipping_date), 'Ngày giao hàng');
    }
  },

  /**
   * Returns Validation
   * BUG-028: Return reason required, valid return dates
   */
  returns: (data: any) => {
    if (!data.reason || !data.reason.trim()) {
      throw new ValidationError('Lý do trả hàng là bắt buộc');
    }
    if (!data.return_date) {
      throw new ValidationError('Ngày trả hàng là bắt buộc');
    }
    if (data.returned_quantity && data.returned_quantity <= 0) {
      throw new ValidationError('Số lượng trả hàng phải lớn hơn 0');
    }
  },

  /**
   * Warranty Claims Validation
   * BUG-029: Warranty valid dates, required documentation
   */
  warrantyClaims: (data: any) => {
    if (!data.claim_date) {
      throw new ValidationError('Ngày khiếu nại là bắt buộc');
    }
    if (!data.description || !data.description.trim()) {
      throw new ValidationError('Mô tả khiếu nại là bắt buộc');
    }
    if (data.claimed_amount && parseFloat(data.claimed_amount) <= 0) {
      throw new ValidationError('Số tiền khiếu nại phải lớn hơn 0');
    }
  },

  /**
   * Low Priority Validations (BUG-030 to BUG-057)
   * Optional field validation, soft constraints
   */
  lowPriority: {
    notes: (data: any) => {
      if (data.notes && data.notes.length > 1000) {
        throw new ValidationError('Ghi chú không thể vượt quá 1000 ký tự');
      }
    },
    comments: (data: any) => {
      if (data.comments && data.comments.length > 500) {
        throw new ValidationError('Bình luận không thể vượt quá 500 ký tự');
      }
    },
    description: (data: any) => {
      if (data.description && data.description.length > 2000) {
        throw new ValidationError('Mô tả không thể vượt quá 2000 ký tự');
      }
    },
    address: (data: any) => {
      if (data.address && data.address.length > 500) {
        throw new ValidationError('Địa chỉ không thể vượt quá 500 ký tự');
      }
    }
  }
};

export default EntityValidators;
