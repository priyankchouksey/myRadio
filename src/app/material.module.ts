import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material';

@NgModule({
  imports: [MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatListModule,
    MatDialogModule,
    MatSidenavModule
  ],
  exports: [MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatListModule,
    MatDialogModule,
    MatSidenavModule
  ]
})
export class MaterialModule {}
