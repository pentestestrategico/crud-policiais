import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciaisService, Policial } from '../services/policiais.service';

@Component({
  selector: 'app-lista-policiais',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-policiais.component.html',
  styleUrl: './lista-policiais.component.css'
})
export class ListaPoliciaisComponent {
  private service = inject(PoliciaisService);
  policiais: Policial[] = [];
  error = '';

  constructor() {
    this.load();
  }

  load() {
    this.error = '';
    this.service.listarPoliciais().subscribe({
      next: (res) => (this.policiais = res || []),
      error: (err) => (this.error = err?.message || 'Erro ao listar')
    });
  }
}
