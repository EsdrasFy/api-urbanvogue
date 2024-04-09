export interface VerifyCouponRes {
  data: {
    status: number;
    msg: string;
    discount?: number;
    discount_percentage?: number;
    code?: string;
    category?: string | null;
    brand?: string | null;
    description?: string;
    withoutDiscount?: number;
    withDiscount?: number;
  };
}

interface Size {
  size: string;
}

interface Color {
  name_color: string;
}

export interface ProductCartI {
  id: number;
  quantity: number;
  price: string;
  title: string;
  image: string;
  size?: string;
  color?: string;
  colors?: Color[];
  sizes?: Size[];
}

export interface VerifyCouponProps {
  code: string;
  ids: number[];
  cart_products: ProductCartI[];
}
