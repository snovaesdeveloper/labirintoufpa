import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabirintoPage } from './labirinto.page';

const routes: Routes = [
  {
    path: '',
    component: LabirintoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabirintoPageRoutingModule {}
