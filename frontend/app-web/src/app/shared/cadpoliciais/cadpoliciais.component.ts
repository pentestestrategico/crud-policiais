import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PoliciaisService } from '../services/policiais.service';
import { validateCPF } from '../utils/validate-cpf';

@Component({
  selector: 'app-cadpoliciais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadpoliciais.component.html',
  styleUrls: ['./cadpoliciais.component.css']
})
export class CadpoliciaisComponent {
  private fb = inject(FormBuilder);
  private service = inject(PoliciaisService);

  form = this.fb.group({
    rg_civil: [''],
    rg_militar: [''],
    cpf: [''],
    data_nascimento: [''],
    matricula: ['']
  });

  message = '';
  error = '';

  submit() {
    this.message = '';
    this.error = '';
    const cpf = this.form.value.cpf as string;
    if (!validateCPF(cpf)) {
      this.error = 'CPF inválido';
      return;
    }

    const payload = {
      rg_civil: this.form.value.rg_civil || '',
      rg_militar: this.form.value.rg_militar || '',
      cpf: this.form.value.cpf || '',
      data_nascimento: this.form.value.data_nascimento || '',
      matricula: this.form.value.matricula || ''
    };

    this.service.cadastrarPolicial(payload).subscribe({
      next: () => (this.message = 'Policial cadastrado com sucesso'),
      error: (err) => (this.error = err?.error?.message || 'Erro ao cadastrar')
    });
  }
}
