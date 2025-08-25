import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Policial {
  id?: number;
  rg_civil?: string;
  rg_militar?: string;
  cpf: string;
  data_nascimento?: string;
  matricula?: string;
}

@Injectable({ providedIn: 'root' })
export class PoliciaisService {
  private http = inject(HttpClient);
  // Backend local (ver `backend/.env` PORT=3049). Rotas expostas como /api/policiais
  private base = 'http://localhost:3049/api';

  cadastrarPolicial(dados: Policial): Observable<any> {
  return this.http.post(`${this.base}/policiais`, dados);
  }

  listarPoliciais(): Observable<Policial[]> {
  return this.http.get<Policial[]>(`${this.base}/policiais`);
  }

  updatePolicial(id: number | string, dados: Policial) {
    return this.http.put(`${this.base}/policiais/${id}`, dados);
  }

  deletePolicial(id: number | string) {
    return this.http.delete(`${this.base}/policiais/${id}`);
  }
}
