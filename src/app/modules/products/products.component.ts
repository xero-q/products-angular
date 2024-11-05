import { Component, signal, WritableSignal } from '@angular/core';
import { Product } from '../../data/models/product';
import { ProductsService } from '../../core/services/products.service';
import { NgStyle, NgIf, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TableModule, PaginatorModule, TagModule,ButtonModule, NgStyle, NgIf,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productsList: WritableSignal<Product[]> = signal([]);
  isLoading = false;
  total = 0;
  page = 1;
  pageSize = 20;

  constructor (private productsService: ProductsService,private toastr: ToastrService){}

  ngOnInit(){
    this.loadProducts();
  }

  public loadProducts(){
    this.isLoading = true;
    this.productsService
    .getProducts(this.page, this.pageSize)
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
}
