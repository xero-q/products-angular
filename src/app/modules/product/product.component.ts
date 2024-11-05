import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../data/models/product';
import { ProductFormComponent } from "../../core/components/product-form/product-form.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-product',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  id : string | null = null;
  loading = false;
  notFound = false;
  product : Product | null = null;

  constructor (private productsService: ProductsService, private route: ActivatedRoute){}

  ngOnInit(): void {   
    
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');

      if (this.id) {
        this.loading = true;
        this.productsService.getSingleProduct(Number(this.id)).subscribe({
          next: (response: Product) => {
            this.loading = false;
            if (!response) {
              this.notFound = true;
            } else {
              this.product = response;
            }
          },
          error: (err: any) => {
            this.loading = false;
          },
        });
      }
    });
  }
}
