export interface Product {
  id?: string;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  affiliateLink: string;
  clicks: number;
  createdAt: any;
  lastShownDate?: any;
  lastClickedAt?: any;
}

export type Category = 
  | "Electronics"
  | "Fashion"
  | "Mobiles"
  | "Laptops"
  | "Home & Kitchen"
  | "Beauty"
  | "Accessories";

export const CATEGORIES: Category[] = [
  "Electronics",
  "Fashion",
  "Mobiles",
  "Laptops",
  "Home & Kitchen",
  "Beauty",
  "Accessories"
];
