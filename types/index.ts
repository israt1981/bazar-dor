export interface Product {
  id: string | number;
  name: string;
  category: string;
  unit: string;
  price: number;
  change: number; // e.g. 2.1 for +2.1%, -2.9 for -2.9%
  emoji: string;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}