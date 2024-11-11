import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];