import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciaisService, Policial } from '../services/policiais.service';
import { CpfFormatPipe } from '../pipes/cpf-format.pipe';
import { CadpoliciaisComponent } from '../cadpoliciais/cadpoliciais.component';

@Component({
  selector: 'app-lista-policiais',
  standalone: true,
  imports: [CommonModule, CpfFormatPipe, CadpoliciaisComponent],
  templateUrl: './lista-policiais.component.html',
  styleUrls: ['./lista-policiais.component.css']
})
export class ListaPoliciaisComponent {
  private service = inject(PoliciaisService);
  policiais: Policial[] = [];
  error = '';
  // event to notify parent for editing (optional)
  editing: Policial | null = null;
  showModal = false;

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

  excluir(id: number | undefined) {
    if (!id) return;
    if (!confirm('Confirma exclusão do policial?')) return;
    this.service.deletePolicial(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.error = err?.message || 'Erro ao excluir')
    });
  }

  editar(p: Policial) {
    this.editing = p;
    this.showModal = true;
  }

  onSaved(p: Policial) {
    this.showModal = false;
    this.editing = null;
    this.load();
  }

  onCancel() {
    this.showModal = false;
    this.editing = null;
  }
}
