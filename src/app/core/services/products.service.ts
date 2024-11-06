import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../data/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsUrl = `${environment.API_URL}/product`; 

  constructor(private http: HttpClient) {}

  getProducts(page:number,pageSize:number, search: string = ''): Observable<any> {  
    return this.http.get<any>(`${this.productsUrl}/all?page=${page}&pageSize=${pageSize}&search=${search}`);    
  }  

  deleteProduct(productId: number):Observable<any>{
    return this.http.delete<any>(`${this.productsUrl}/${productId}`);   
  }

  createProduct(type: 'digital' | 'physical',productData: Product): Observable<Product> {
    const productDataValidated = {
      ...productData,
      price: Number(productData.price)      
    }

    if (type === 'physical'){
      productDataValidated.shipmentCost = Number(productDataValidated.shipmentCost);
    }
    return this.http.post<Product>(`${this.productsUrl}/${type}`,productDataValidated);
  }

  getSingleProduct(id:number): Observable<Product> {  
    return this.http.get<Product>(`${this.productsUrl}/${id}`);    
  } 
  
  updateProduct(type: 'digital' | 'physical', id: number, productData: Product): Observable<Product>{
    const productDataValidated = {
      ...productData,
      price: Number(productData.price)      
    }

    if (type === 'physical'){
      productDataValidated.shipmentCost = Number(productDataValidated.shipmentCost);
    }

    return this.http.put<Product>(`${this.productsUrl}/${type}/${id}`,productDataValidated);
  }
}
