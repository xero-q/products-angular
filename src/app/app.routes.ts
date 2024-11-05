import { Routes } from '@angular/router';
import { ProductsComponent } from './modules/products/products.component';
import { ROUTES } from './shared/routes';
import { ProductComponent } from './modules/product/product.component';

export const routes: Routes = [
    { path: ROUTES.PRODUCTS, component: ProductsComponent },  
    { path: ROUTES.PRODUCTS+'/:id', component: ProductComponent },  

];
