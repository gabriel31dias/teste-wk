import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Person, Person2 } from '../models/person.model';
import { PersonService } from '../services/person.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})

export class PersonsComponent implements OnInit {
  people: Person2[] = [];
  selectedPerson: any | null = null;
  newPersonForm: FormGroup;
  editPersonForm: FormGroup;
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;
  loading = false;
  submitted = false;
  error = '';

  currentId: string | number | undefined = 0;

  @ViewChild('modalNewRegister') myModal: ElementRef | undefined;

  constructor(
    private personService: PersonService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {

    this.newPersonForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      complemento: [''],
      cidade: ['', Validators.required],
    });

    this.editPersonForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      complemento: [''],
      cidade: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInit();
    if (this.isBrowser()) {
      if (this.authService.isAuthenticated()) {
        this.loadInit();
      } else {
        this.modalAuth();
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  
  getErrorList(errorObject: {}) {
    return Object.keys(errorObject);
  }

  loadInit() {
    this.loadPeople();
  }

  modalAuth() {
    this.openModalStatic('modalAuth');
  }

  loadPeople(page: number = 1): void {
    this.personService.getClientes().subscribe(data => {
      this.people = data;
      console.log(data)
      this.totalRecords = 1;
      this.totalPages = 1;
    });
  
  }

  selectPerson(person: Person2): void {
    this.selectedPerson = { ...person };
    this.editPersonForm.patchValue(this.selectedPerson);
  }

  createPerson(): void {
    if (this.newPersonForm.valid) {
      this.personService.addCliente({
        nome: this.newPersonForm.value.nome,
        cpf: this.newPersonForm.value.cpf,
        cep: this.newPersonForm.value.cep,
        logradouro: this.newPersonForm.value.logradouro,
        numero: this.newPersonForm.value.numero,
        bairro:  this.newPersonForm.value.bairro,
        complemento:  this.newPersonForm.value.complemento,
        cidade:  this.newPersonForm.value.cidade,
        email: this.newPersonForm.value.email,
        dataNascimento:  this.newPersonForm.value.dataNascimento
      }).subscribe(person => {
        this.newPersonForm.reset();
        this.loadPeople(this.currentPage);
        this.openModal('modalNewRegisterSucess');
        this.closeModal('modalNewRegister');
      });
    }
  }

  updatePerson(): void {
    if (this.selectedPerson && this.editPersonForm.valid) {
      this.personService.updatePerson(this.selectedPerson.id, {
        nome: this.editPersonForm.value.nome,
        cpf: this.editPersonForm.value.cpf,
        cep: this.editPersonForm.value.cep,
        logradouro: this.editPersonForm.value.logradouro,
        numero: this.editPersonForm.value.numero,
        bairro:  this.editPersonForm.value.bairro,
        complemento:  this.editPersonForm.value.complemento,
        cidade:  this.editPersonForm.value.cidade,
        email: this.editPersonForm.value.email,
        dataNascimento:  this.editPersonForm.value.dataNascimento
      }).subscribe(() => {
        this.openModal('modalNewRegisterEditS')
        this.closeModal('modalEditRegister');
        this.loadPeople();
      });
    }
  }

  deletePerson(id: string | number | undefined): void {
    if (id) {
      this.personService.deletePerson(id).subscribe(() => {
        this.loadPeople();
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

  get nome() { return this.newPersonForm.get('name'); }
  get email() { return this.newPersonForm.get('email'); }
  get cpf() { return this.newPersonForm.get('email'); }
  get cep() { return this.newPersonForm.get('cep'); }
  get cidade() { return this.newPersonForm.get('cidade'); }
  get logradouro() { return this.newPersonForm.get('logradouro'); }
  get numero() { return this.newPersonForm.get('numero'); }
  get bairro() { return this.newPersonForm.get('bairro'); }
  get complemento() { return this.newPersonForm.get('complemento'); }
  get dataNascimento() { return this.newPersonForm.get('dataNascimento'); }
}
