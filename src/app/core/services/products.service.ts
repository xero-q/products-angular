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

  getProducts(page:number,pageSize:number): Observable<any> {  
    return this.http.get<any>(`${this.productsUrl}/all?page=${page}&pageSize=${pageSize}`);    
  }  

  deleteProduct(productId: number):Observable<any>{
    return this.http.delete<any>(`${this.productsUrl}/${productId}`);   
  }
}
