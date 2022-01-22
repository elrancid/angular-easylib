import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../button/button.module';
// import { MaterialModule } from 'src/app/shared/material/material.module';
import { TableComponent } from './table.component';
import { TableModule as PrimeTableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

export interface TableColumn {
  /**
   * Field name in data array object to use in column.
   */
  field?: string,
  /**
   * 
   */
  foreign?: {
    data: Record<string, any>[],
    field: string,
    idField?: string,
  },
  /**
   * Name to display in header column.
   */
  header?: string,
  /**
   * Sortable column (default false).
   */
  sortable?: boolean,
  /**
   * Activate column filtering (default false).
   */
  filter?: boolean,
  /**
   * Column type for filtering. Values are: text (default) | numeric | boolean | date.
   */
  type?: 'text' | 'numeric' | 'boolean' | 'date',
  /**
   * Column width. Example: '200px', '15%'.
   */
  width?: string,
  /**
   * Custom style and automatic width from `width` (if `scrollable` uses flex layout).
   */
  style?: string,
  /**
   * Show `button-icon` and set icon name.
   */
  buttonIcon?: string,
  /**
   * Function to invoke on button click. Params sent: `data`, `column`, `$event`.
   */
  onButtonClick?: Function,
  /**
   * Function to invoke on cell click. Params sent: `data`, `column`, `$event`.
   */
  onClick?: Function,
}
export type TableColumns = TableColumn[];

@NgModule({
  declarations: [
    TableComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    PrimeTableModule,
    InputTextModule,
  ],
  exports: [
    TableComponent,
  ]
})
export class TableModule { }
