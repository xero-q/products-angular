import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../data/models/product';
import { ProductsService } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ROUTES } from '../../../shared/routes';

@Component({
  standalone:true,
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    CardModule]
   
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Output() submitSuccess = new EventEmitter<any>();

  productForm: FormGroup;
  productTypes = [
    { label: 'Digital', value: 'digital' },
    { label: 'Physical', value: 'physical' }
  ];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private toastr: ToastrService,
    private router:Router
  ) {
    this.productForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      name: ['', Validators.required],
      price: [0.01, [Validators.required, Validators.min(0.01)]],
      type: ['', Validators.required],
      downloadLink: [''],
      shipmentCost: [0.01]
    });
  }

  ngOnInit(): void {
    this.type?.valueChanges.subscribe((type) => {
      if (type === 'digital') {
        this.downloadLink?.setValidators(Validators.required);
        this.shipmentCost?.clearValidators();
        this.shipmentCost?.setValue(null);
      } else {
        this.shipmentCost?.setValidators([Validators.required, Validators.min(0.01)]);
        this.downloadLink?.clearValidators();
        this.downloadLink?.setValue(null);
      }
      this.downloadLink?.updateValueAndValidity();
      this.shipmentCost?.updateValueAndValidity();
    });

    if (this.product) {
      this.productForm.patchValue(this.product);
      this.type?.setValue(this.product.downloadLink ? 'digital' : 'physical');
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData: Product = this.productForm.value;

    if (this.product) {
      this.productsService.updateProduct(this.type?.value, this.product.id, productData).subscribe({
        next:()=>{
          this.toastr.success('Product updated successfully', 'Success');
          this.submitSuccess.emit();
          this.router.navigate(['/'+ROUTES.PRODUCTS]);
        },
        error:()=>{
          this.toastr.error('Error updating product', 'Error');
        }
      }
      );
    } else {
      this.productsService.createProduct(this.type?.value,productData).subscribe({
        next:()=>{
          this.toastr.success('Product created successfully', 'Success');
          this.submitSuccess.emit();
          this.productForm.reset();
        },
        error:()=>{
          this.toastr.error('Error creating product', 'Error');
        }
      }        
      );
    }
  }

  get code() {
    return this.productForm.get('code');
  }

  get name() {
    return this.productForm.get('name');
  }

  get price() {
    return this.productForm.get('price');
  }

  get type(){
    return this.productForm.get('type');
  }

  get downloadLink(){
    return this.productForm.get('downloadLink');
  }

  get shipmentCost(){
    return this.productForm.get('shipmentCost');
  }


}
