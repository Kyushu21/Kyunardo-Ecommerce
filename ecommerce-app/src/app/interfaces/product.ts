// src/app/interfaces/product.interface.ts
export interface Product {
    _id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  stock: number;
  rating: {
    rate: number;
    count: number;
  };
}