import { Component, signal, WritableSignal } from '@angular/core';
import { Product } from '../../data/models/product';
import { ProductsService } from '../../core/services/products.service';
import { NgStyle, NgIf, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

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

  constructor (private productsService: ProductsService){}

  ngOnInit(){
    this.loadProducts();
  }

  public loadProducts(){
    this.productsList.set([]);
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
        // this.toastr.error('Error while fetching the files','Error');
      }
    })       
  }

  onPageChange(event: any){
    this.page = event.page + 1;
    this.loadProducts();
  }
}