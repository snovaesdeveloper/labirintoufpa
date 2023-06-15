import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabirintoPageRoutingModule } from './labirinto-routing.module';

import { LabirintoPage } from './labirinto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabirintoPageRoutingModule
  ],
  declarations: [LabirintoPage]
})
export class LabirintoPageModule {}
