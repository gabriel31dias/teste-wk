import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meu-projetox';
  

  constructor(private router: Router) {}

  goCustomers() {
    this.router.navigate(['/customers']);
  }

  goProducts () {
    this.router.navigate(['/products']);
  }

  goSales () {
    this.router.navigate(['/sales']);
  }
}
