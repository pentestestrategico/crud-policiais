import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciaisService, Policial } from '../services/policiais.service';
import { CpfFormatPipe } from '../pipes/cpf-format.pipe';

@Component({
  selector: 'app-lista-policiais',
  standalone: true,
  imports: [CommonModule, CpfFormatPipe],
  templateUrl: './lista-policiais.component.html',
  styleUrls: ['./lista-policiais.component.css']
})
export class ListaPoliciaisComponent {
  private service = inject(PoliciaisService);
  policiais: Policial[] = [];
  error = '';
  // event to notify parent for editing (optional)
  editing: Policial | null = null;

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
    // futuro: abrir modal de edição com formulário. Por enquanto mostramos alerta.
    window.alert('Editar: ' + (p.id ?? 'sem id'));
  }
}
