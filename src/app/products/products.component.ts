import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Person } from '../models/person.model';

import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Sale } from '../models/sale.model';

declare var bootstrap: any;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  people: any[] = [];
  selectedPerson: any | null = null;
  newProductForm: FormGroup;
  editProductForm: FormGroup;
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;
  loading = false;
  submitted = false;
  valor2: string = '';

  error = '';

  currentId: string | number = 0;

  @ViewChild('modalNewRegister') myModal: ElementRef | undefined;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.newProductForm = this.fb.group({
      nome: ['', Validators.required],
      valor: ['', [Validators.required]]
    });

    this.editProductForm = this.fb.group({
      nome: ['', Validators.required],
      valor: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProducts()
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  loadInit() {
    this.loadProducts();
  }

  modalAuth() {
    this.openModalStatic('modalAuth');
  }

  loadProducts(page: number = 1): void {
    let sub = this.productService.getProducts().subscribe((data: any) => {
      this.people = data;
    });
     
  }

  onInputMaskMoney(event: any): void {
    let value = event.target.value;
  
    value = value.replace(/\D/g, '');
    value =  (parseInt(value) / 100).toFixed(2);
    
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    event.target.value = '' + value.replace('.', ','); 
    
  }

  selectProduct(person: Person): void {
    this.selectedPerson = { ...person };
    this.editProductForm.patchValue(this.selectedPerson);
  }

  createProduct(): void {
    if (this.newProductForm.valid) {
      this.productService.addProduct({
        nome: this.newProductForm.value.nome,
        valor: parseInt(this.valor2)
      }).subscribe(person => {
        this.people.push(person);
        this.newProductForm.reset();
        this.loadProducts(this.currentPage);
        this.openModal('modalNewRegisterSucess');
        this.closeModal('modalNewRegister');
      });
    }
  }

  updatePerson(): void {
    if (this.selectedPerson && this.editProductForm.valid) {
      this.productService.updateProduct(this.selectedPerson.id, {
        nome: this.editProductForm.value.nome,
        valor: this.editProductForm.value.valor
      }).subscribe(person => {
        this.people.push(person);
        this.newProductForm.reset();
        this.loadProducts(this.currentPage);
        this.openModal('modalNewRegisterEditS');
        this.closeModal('modalEditRegister');
        this.closeModal('modalNewRegister');
      });
    }
  }

  formatarMoeda(event: any) {
    let valorDigitado = event.target.value;
    valorDigitado = valorDigitado.replace(/\D/g, '');

    let valorFormatado = (Number(valorDigitado) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,  
      maximumFractionDigits: 2   
    });

    valorFormatado = valorFormatado.replace(/,/g, '.')
    this.valor2 = valorFormatado;
  }

  deleteProduct(id: string | number): void {
    if (id) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  closeModal(id: string) {
    const modalElement = this.document.getElementById(id);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  openModal(id: string) {
    if (this.isBrowser()) {
      const modalElement = this.document.getElementById(id);
      if (modalElement && (window as any).bootstrap) {
        const bootstrap = (window as any).bootstrap;
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
      }
    }
  }

  openModalStatic(id: string): void {
    if (this.isBrowser()) {
      const modalElement = this.document.getElementById(id);
      if (modalElement && (window as any).bootstrap) {
        const bootstrap = (window as any).bootstrap;
        const modalInstance = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        modalInstance.show();
      }
    }
  }

  get nome() { return this.newProductForm.get('nome'); }
  get valor() { return this.newProductForm.get('valor'); }
}
