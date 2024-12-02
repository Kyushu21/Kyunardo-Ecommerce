// src/app/interfaces/product.interface.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string; // Asegúrate de que esta propiedad exista
  created_at: string;
  updated_at: string;
  rating?: { // Añade esta propiedad si es necesaria
    rate: number;
    count: number;
  };
}