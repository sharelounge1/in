export interface CartItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseImage?: string;
  price: number;
  quantity: number;
  options?: CartItemOption[];
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  additionalPrice?: number;
}
