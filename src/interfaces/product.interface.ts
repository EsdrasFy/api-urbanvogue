import { Model } from "sequelize";

export interface ProductI extends Model<any, any> {
  id: number;
  title: string;
  summary: string;
  quantidy: number;
  sold?: number;
  price: number;
  state: boolean;
  category: string;
  brand: string;
  guarantee?: string;
  variation?: string;
  assessment: number;
  parcelable: boolean;
  max_installments?: number;
  interest_rate?: number;
  updated_at: Date;
  created_at: Date;
  images: ProductImageI[];
  flags: ProductFlagI[];
  sizes: ProductSizeI[];
  details: ProductDetailI[];
  colors: ProductColorI[];
}
export interface ProductImageI extends Model<any, any> {
  image_id: number;
  product_id?: number;
  url: string;
}
export interface ProductFlagI extends Model<any, any> {
  flags_id: number;
  product_id?: number;
  flag: string;
}
export interface ProductColorI extends Model<any, any> {
  color_id: number;
  product_id?: number;
  name_color: string;
}
export interface ProductSizeI extends Model<any, any> {
  size_id: number;
  product_id?: number;
  size: string;
}
export interface ProductDetailI extends Model<any, any> {
  size_id: number;
  product_id?: number;
  size: string;
}
