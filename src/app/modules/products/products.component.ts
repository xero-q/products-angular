import { Component, signal, WritableSignal,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Product } from '../../data/models/product';
import { ProductsService } from '../../core/services/products.service';
import { NgStyle, NgIf, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';
import { ProductFormComponent } from '../../core/components/product-form/product-form.component';
import { ROUTES } from '../../shared/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [TableModule, PaginatorModule, TagModule,ButtonModule, NgStyle, NgIf,CommonModule, ProductFormComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productsList: WritableSignal<Product[]> = signal([]);
  isLoading = false;
  total = 0;
  page = 1;
  pageSize = 20;
  addProductVisible = false;
  routes = ROUTES;
  search = '';

  constructor (private productsService: ProductsService,private toastr: ToastrService, private router: Router){}

  ngOnInit(){
    this.isLoading = true;
    this.loadProducts();
  }

  public loadProducts(){
    this.productsService
    .getProducts(this.page, this.pageSize, this.search)
    .subscribe({
      next:(response: any)=>{
        console.log({response});  
        this.isLoading = false;
        this.total = response.total;
        this.productsList.set([...response.results as Product[]]);      
      },
      error:()=>{
        this.isLoading = false;  
        this.toastr.error('Error while fetching the products','Error');
      }
    })       
  }

  onPageChange(event: any){
    this.page = event.page + 1;
    this.loadProducts();
  }

  deleteProduct(product: Product){
    if (confirm(`Are you sure you want to delete the product '${product.name}'`)){
     this.productsService.deleteProduct(product.id).subscribe({
      next:()=>{
        this.toastr.success('Product deleted successfully','Success');
        this.loadProducts();
      },
      error:()=>{
        this.toastr.error('Error while deleting the product','Error');
      }
     })
    }
  }

  editProduct(product: Product){
      this.router.navigateByUrl(`${ROUTES.PRODUCTS}/${product.id}`)
  }

  searchProducts(event:any){
    this.search = event.target.value;    
    this.loadProducts();      
  }
}
