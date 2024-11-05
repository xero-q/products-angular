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
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      downloadLink: [''],
      shipmentCost: [0]
    });
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.patchValue(this.product);
      this.productForm.get('type')?.setValue(this.product.downloadLink ? 'digital' : 'physical');
    }

    this.productForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === 'digital') {
        this.productForm.get('downloadLink')?.setValidators(Validators.required);
        this.productForm.get('shipmentCost')?.clearValidators();
        this.productForm.get('shipmentCost')?.setValue(null);
      } else {
        this.productForm.get('shipmentCost')?.setValidators([Validators.required, Validators.min(0)]);
        this.productForm.get('downloadLink')?.clearValidators();
        this.productForm.get('downloadLink')?.setValue(null);
      }
      this.productForm.get('downloadLink')?.updateValueAndValidity();
      this.productForm.get('shipmentCost')?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData: Product = this.productForm.value;

    if (this.product) {
      // Update Product
      // this.productsService.updateProduct(this.product.id, productData).subscribe(() => this.showMessage('success', 'Product updated successfully'),
      //   () => this.showMessage('error', 'Error updating product')
      // );
    } else {
      // Create Product
      this.productsService.createProduct(this.type?.value,productData).subscribe({
        next:()=>{
          this.toastr.success('Product created successfully', 'Success');
          this.submitSuccess.emit();
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
}
