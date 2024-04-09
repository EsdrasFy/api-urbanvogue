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