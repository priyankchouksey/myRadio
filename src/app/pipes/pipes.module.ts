import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';

export * from './search.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SearchPipe],
  exports: [SearchPipe]
})
export class PipesModule { }
