// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart_items';
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCart());

  constructor() {
    // Load cart from localStorage on service initialization
    this.cartItems.subscribe(items => {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(items));
      }
    });
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private loadCart(): CartItem[] {
    if (this.isLocalStorageAvailable()) {
      const savedCart = localStorage.getItem(this.CART_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: Partial<CartItem>) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([
        ...currentItems, 
        { 
          ...product as CartItem, 
          quantity: 1 
        }
      ]);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...currentItems[itemIndex],
        quantity: quantity
      };
      this.cartItems.next(updatedItems);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    this.cartItems.next(currentItems.filter(item => item.id !== productId));
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const total = items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }

  getCartCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const count = items.reduce((sum, item) => 
          sum + item.quantity, 0);
        observer.next(count);
      });
    });
  }
}