export interface CouponI {
  coupons_id: number;
  code: string;
  description: string;
  valid_category: string | null;
  valid_brand: string | null;
  discount_percentage: number;
  start_date: Date;
  end_date: Date;
  createdAt: Date;
  updatedAt: Date;
}
