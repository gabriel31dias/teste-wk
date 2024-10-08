import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Person } from '../models/person.model';

import { SalesService } from '../services/sales.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PersonService } from '../services/person.service';
import { ProductService } from '../services/product.service';
import {  Person2 } from '../models/person.model';
import { DropdownModule } from 'primeng/dropdown';
import { Sale } from '../models/sale.model';

declare var bootstrap: any;

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [SalesService, AuthService]
})

export class SalesComponent implements OnInit {

  people: any[] = [];
  selectedPerson: any | null = null;
  newSaleForm: FormGroup;
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;
  loading = false;
  submitted = false;
  optionsPersons = [];
  optionsProducts = [];
  tempProduct:any = [];
  productSelected = []
  products :any = [];
  error = '';
  total = 0;

  currentId: string | number = 0;

  @ViewChild('modalNewRegister') myModal: ElementRef | undefined;

  constructor(
    private salesService: SalesService,
    private personService: PersonService,
    private productService: ProductService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.newSaleForm = this.fb.group({
      cliente: new FormControl(this.optionsPersons), // Create a new instance of Client
      produtos: new FormControl(this.optionsProducts),
      valor: 0
    });
  }

  ngOnInit(): void {
    this.loadSales()
    this.getSelectProducts()
    this.getSelectPersons()
  }

 
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  loadInit() {
    this.loadSales();
  }

  modalAuth() {
    this.openModalStatic('modalAuth');
  }

  calcularTotal() {
    this.total = 0;    
    this.products.forEach((produto: { valor: string; }) => {
        this.total += parseInt(produto.valor); 
    });
  }

  loadSales(page: number = 1): void {
    let sub = this.salesService.getSales().subscribe((data: any) => {
      this.people = data;
    });

    this.people.forEach(person => {
      person.people = this.parseProdutos(person.produtos);
    });
     
  }

  selectPerson(person: Person): void {
    this.selectedPerson = { ...person };
  }

  createSale(): void {
    if (this.newSaleForm.valid) {
      this.salesService.addSale({
        cliente:   this.newSaleForm.value.cliente, 
        produtos: this.products,
        total: this.total
      }).subscribe(person => {
        this.people.push(person);
        this.newSaleForm.reset();
        this.loadSales(this.currentPage);
        this.openModal('modalNewRegisterSucess');
        this.closeModal('modalNewRegister');
      });
    }
  }

  deletePerson(id: string | number): void {
    if (id) {
      this.salesService.deleteSale(id).subscribe(() => {
        this.loadSales();
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

  getSelectPersons() {
    this.personService.getClientes().subscribe((data: any) => {
      this.optionsPersons = data;
    });
  }


  getSelectProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.optionsProducts = data;
    });
  }

  parseProdutos(products: any) {     
     return JSON.parse(products);
  }

  addProduct() {
    this.products.push(this.newSaleForm.value.produtos)
    this.calcularTotal()
  }

  get nome() { return this.newSaleForm.get('nome'); }
  get produtos() { return this.newSaleForm.get('produtos'); }
  get cliente() { return this.newSaleForm.get('cliente'); }
  get valor() { return this.newSaleForm.get('valor'); }
}
