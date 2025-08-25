import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PoliciaisService, Policial } from '../services/policiais.service';
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
    rg_civil: ['', [Validators.required]],
    rg_militar: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    data_nascimento: ['', [Validators.required]],
    matricula: ['', [Validators.required]]
  });

  message = '';
  error = '';

  submit() {
    this.message = '';
    this.error = '';
    const cpf = (this.form.get('cpf')!.value || '') as string;
    if (!validateCPF(cpf)) {
      this.error = 'CPF inválido';
      return;
    }

    const payload: Policial = {
      rg_civil: String(this.form.get('rg_civil')!.value || '').trim(),
      rg_militar: String(this.form.get('rg_militar')!.value || '').trim(),
      cpf: String(this.form.get('cpf')!.value || '').replace(/\D/g, ''),
      data_nascimento: String(this.form.get('data_nascimento')!.value || '').trim(),
      matricula: String(this.form.get('matricula')!.value || '').trim()
    };

    this.service.cadastrarPolicial(payload).subscribe({
      next: () => {
        this.message = 'Policial cadastrado com sucesso';
        this.form.reset();
      },
      error: (err) => (this.error = err?.error?.message || 'Erro ao cadastrar')
    });
  }
}
