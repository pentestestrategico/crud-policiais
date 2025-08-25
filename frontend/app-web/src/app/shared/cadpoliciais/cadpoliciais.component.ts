import { Component, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() initial?: Policial | null;
  @Output() saved = new EventEmitter<Policial>();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initial'] && this.initial) {
      this.form.patchValue({
        rg_civil: this.initial.rg_civil || '',
        rg_militar: this.initial.rg_militar || '',
        cpf: this.initial.cpf || '',
        data_nascimento: this.initial.data_nascimento ? String(this.initial.data_nascimento).slice(0,10) : '',
        matricula: this.initial.matricula || ''
      });
    }
  }

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

    // Se temos initial.id, atualizamos; caso contrário, cadastramos
    if (this.initial && this.initial.id) {
      this.service.updatePolicial(this.initial.id, payload).subscribe({
        next: () => {
          this.message = 'Policial atualizado com sucesso';
          this.saved.emit({ ...payload, id: this.initial!.id });
        },
        error: (err) => (this.error = err?.error?.message || 'Erro ao atualizar')
      });
    } else {
      this.service.cadastrarPolicial(payload).subscribe({
        next: () => {
          this.message = 'Policial cadastrado com sucesso';
          this.form.reset();
          this.saved.emit(payload);
        },
        error: (err) => (this.error = err?.error?.message || 'Erro ao cadastrar')
      });
    }
  }
}
