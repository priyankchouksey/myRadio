import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';
import { GroupbyPipe } from './groupby.pipe';

export * from './search.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SearchPipe, GroupbyPipe],
  exports: [SearchPipe, GroupbyPipe]
})
export class PipesModule { }
