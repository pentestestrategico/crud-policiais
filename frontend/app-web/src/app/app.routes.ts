import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'lista' },
	{
		path: 'cadastro',
		loadComponent: () => import('./shared/cadpoliciais/cadpoliciais.component').then(m => m.CadpoliciaisComponent)
	},
	{
		path: 'lista',
		loadComponent: () => import('./shared/lista-policiais/lista-policiais.component').then(m => m.ListaPoliciaisComponent)
	}
];
