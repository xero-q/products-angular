import { Routes } from '@angular/router';
import { ProductsComponent } from './modules/products/products.component';
import { ROUTES } from './shared/routes';

export const routes: Routes = [
    { path: ROUTES.PRODUCTS, component: ProductsComponent },  

];
