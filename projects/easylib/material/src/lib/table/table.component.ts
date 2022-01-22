import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { TableColumns, TableColumn } from './table.module';
import * as moment from 'moment';
// import { PrimeNGConfig } from 'primeng/api';

/**
 * <easy-table
 * [columns]="columns" // An array of objects to represent dynamic columns.
 * [data]="data" // An array of objects to display.
 * dataKey="id" // A property to uniquely identify a record in data.
 * [scrollable]="true" // When specifies, enables horizontal and/or vertical scrolling.
 * scrollHeight="flex" // Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
 * [stackResponsive]="false" // When scrollable is false, enable columns displayed as stacked after a certain breakpoint (stack responsive layout). |
 * stackBreakpoint="960px" // The breakpoint to define the maximum width boundary when using stack responsive layout. |
 * // pagination:
 * [paginator]="false" // When specified as true, enables the pagination.
 * [paginateRows]="100" // Number of rows to display per page. Default 100.
 * [(paginateFirst)]="0" // Two way binding. Index of the first row to be displayed.
 * [rowsPerPageOptions]="[10, 50, 100, {showAll:'All'}]" // array default null. Array of integer/object values to display inside rows per page dropdown. A object that have 'showAll' key can be added to it to show all data. Exp; [10,20,30,{showAll:'All'}]
 * [alwaysShowPaginator]="true" // Whether to show it even there is only one page.
 * paginatorPosition="bottom" // Position of the paginator, options are "top","bottom" or "both".
 * [showPageLinks]="false" // Whether to show page links.
 * [pageLinks]="null" // Number of page links to display in paginator.
 * [showJumpToPageDropdown]="true" // Whether to display a dropdown to navigate to any page.
 * [showCurrentPageReport]="false" // Whether to display current page report.
 * currentPageReportTemplate="{currentPage} of {totalPages}" // Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
 * [showJumpToPageInput]="false" // Whether to display a input to navigate to any page.
 * [showFirstLastIcon]="true" // When enabled, icons are displayed on paginator to go first and last page.
 * [selectRows]="false" // Whether to display a first column with rows checkbox selection.
 * [(selectedRows)]="selectedRows" // Two way binding. Selected row in single mode or an array of values in multiple mode.
 * caption="Caption" // Caption content of the table.
 * [globalFilterFields]="[]" // An array of fields as string to use in global filtering.
 * [resizableColumns]="false" // When enabled, columns can be resized using drag and drop.
 * [reorderableColumns]="false" // When enabled, columns can be reordered using drag and drop.
 * [loading]="false" // Displays a loader to indicate data load is in progress.
 * [reorderableRows]="false" // When enabled, rows can be reordered using drag and drop.
 * [rowHover]="true" // Adds hover effect to rows without the need for selectionMode.
 * ></easy-table>
 */
@Component({
  selector: 'easy-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  @ViewChild('dt') dt?: any;

  /**
   * An array of objects to represent dynamic columns.
   * columns = [
   *   {
   *     field?: string, // Field name in data array object to use in column.
   *     header?: string, // Name to display in header column.
   *     sortable?: boolean, // Sortable column (default false).
   *     type?: 'text' | 'numeric' | 'boolean' | 'date', // text (default) | numeric | boolean | date.
   *     filter?: boolean, // Activate column filtering (default false).
   *     width?: string, // Column width. Example: '200px', '15%'.
   *     style?: string, // Custom style and automatic width from `width` (if `scrollable` uses flex layout).
   *     buttonIcon?: string, // Show `button-icon` and set icon name.
   *     onButtonClick?: Function, // Function to invoke on button click. Params sent: `data`, `column`, `$event`.
   *   },
   *   {...},
   * ]
   */
  @Input() columns!: TableColumns;

  /**
   * An array of objects to display.
   * data = [
   *   { [field1]: [value1], ... },
   *   {...}
   * ]
   */
  public _data: Record<string, any>[] = [];
  @Input() set data(data: Record<string, any>[]) {
    if (data) {
      this._data = [ ...data ];
    }
  }
  public get data(): Record<string, any>[] {
    return this._data;
  }
  /**
   * A property to uniquely identify a record in data.
   */
  @Input() dataKey: string = 'id'; // A property to uniquely identify a record in data.

  /**
   * When specifies, enables horizontal and/or vertical scrolling.
   */
  @Input() scrollable: boolean = true;
  /**
   * Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
   */
  @Input() scrollHeight: string = 'flex';

  /**
   * When scrollable is false, enable columns displayed as stacked after a certain breakpoint (stack responsive layout).
   */
  @Input() stackResponsive: boolean = false;
  /**
   * The breakpoint to define the maximum width boundary when using stack responsive layout.
   */
  @Input() stackBreakpoint: string = '960px';

  /**
   * Activate paginator.
   */
  @Input() paginator: boolean = false;
  /**
   * Rows number to display per page.
   */
  @Input() paginateRows: number = 100;
  private _paginateFirst: number = 0;
  /**
   * Two way binding. Index of first row in page.
   */
  @Input() set paginateFirst(first: number) {
    if (this._paginateFirst !== first) {
      // console.log('TableComponent.set paginateFirst:', first);
      this._paginateFirst = first;
      this.paginateFirstChange.emit(first);
    }
  }
  @Output() paginateFirstChange = new EventEmitter<number>();
  public get paginateFirst(): number {
    // console.log('TableComponent.get paginateFirst:', this._paginateFirst);
    return this._paginateFirst;
  }
  /**
   * Array of integer/object values to display inside rows per page dropdown of paginator.
   */
  @Input() rowsPerPageOptions: (number | { showAll: string })[] = [10, 50, 100, {showAll:'All'}];
  /**
   * Whether to show it even there is only one page.
   */
  @Input() alwaysShowPaginator: boolean = true;
  /**
   * Whether to show it even there is only one page.
   */
  @Input() paginatorPosition: 'top' | 'bottom' | 'both' = 'bottom';
  /**
   * Whether to show page links.
   */
  @Input() showPageLinks: boolean = false;
  /**
   * Number of page links to display in paginator.
   */
  @Input() pageLinks!: number;
   /**
   * Whether to display a dropdown to navigate to any page.
   */
  @Input() showJumpToPageDropdown: boolean = true;
  /**
   * Whether to display current page report.
   */
  @Input() showCurrentPageReport: boolean = false;
  /**
   * Template of the current page report element. Available placeholders are
   * {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
   */
  @Input() currentPageReportTemplate: string = '{currentPage} of {totalPages}';
  /**
   * Whether to display a input to navigate to any page.
   */
  @Input() showJumpToPageInput: boolean = false;
  /**
   * When enabled, icons are displayed on paginator to go first and last page.
   */
  @Input() showFirstLastIcon: boolean = true;

  /**
   * Whether to display a first column with rows checkbox selection.
   */
  @Input() selectRows = false;
  private _selectedRows: any;
  /**
   * Two way binding. Selected row in single mode or an array of values in multiple mode.
   */
  @Input() set selectedRows(selected: any) {
    if (this._selectedRows !== selected) {
      console.log('TableComponent.set selectedRows:', selected, 'this._selectedRows:', this._selectedRows);
      this._selectedRows = selected;
      this.selectedRowsChange.emit(selected);
    }
  }
  @Output() selectedRowsChange = new EventEmitter<any>();
  get selectedRows(): any {
    // console.log('TableComponent.get selectedRows:', this._selectedRows);
    return this._selectedRows;
  }

  /**
   * Caption content of the table.
   */
  @Input() caption?: string;
  /**
   * An array of fields as string to use in global filtering.
   */
  @Input() globalFilterFields!: string[];

  /**
   * When enabled, columns can be resized using drag and drop.
   */
  @Input() resizableColumns: boolean = false;
  /**
   * When enabled, columns can be reordered using drag and drop.
   */
  @Input() reorderableColumns: boolean = false;

  /**
   * Displays a loader to indicate data load is in progress.
   */
  @Input() loading: boolean = false;

  /**
   * When enabled, rows can be reordered using drag and drop.
   */
  @Input() reorderableRows?: boolean = false;

  /**
   * Adds hover effect to rows without the need for selectionMode.
   */
  @Input() rowHover: boolean = true;

  // private currentLang!: string;

  constructor(
    // private translate: TranslateService,
    // private config: PrimeNGConfig
  ) {
    // this.currentLang = this.translate.currentLang;
    // console.log('TableComponent.constructor() currentLang:', this.currentLang);
    console.log('TableComponent.constructor() moment.locale:', moment.locale());
  }

  ngOnInit(): void {
    // update column style
    this.columns.forEach((column) => {
      if (column.width) {
        if (column.style) {
          column.style += ';';
        } else {
          column.style = '';
        }
        column.style += this.scrollable ? 'flex:0 0 '+column.width : 'width:'+column.width;
      }
    });

    // this.config.filterMatchModeOptions = {
    //   text: [
    //     FilterMatchMode.STARTS_WITH,
    //     FilterMatchMode.CONTAINS,
    //     FilterMatchMode.NOT_CONTAINS,
    //     FilterMatchMode.ENDS_WITH,
    //     FilterMatchMode.EQUALS,
    //     FilterMatchMode.NOT_EQUALS
    //   ],
    //   numeric: [
    //     FilterMatchMode.EQUALS,
    //     FilterMatchMode.NOT_EQUALS,
    //     FilterMatchMode.LESS_THAN,
    //     FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
    //     FilterMatchMode.GREATER_THAN,
    //     FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
    //   ],
    //   date: [
    //     FilterMatchMode.DATE_IS,
    //     FilterMatchMode.DATE_IS_NOT,
    //     FilterMatchMode.DATE_BEFORE,
    //     FilterMatchMode.DATE_AFTER
    //   ]
    // }
  }

  // getSelectedRows(): void {
  //   const selectedNodes = this.agGrid?.api.getSelectedNodes();
  //   const selectedData = selectedNodes?.map(node => node.data);
  //   const selectedDataStringPresentation = selectedData?.map(node => `${node.make} ${node.model}`).join(', ');
  //   console.log(`Selected nodes: ${selectedDataStringPresentation}`);
  // }

  public globalSearch(event: Event) {
    console.log('globalSearch() dt:', this.dt);
    // console.log('globalSearch() event:', event);
    // console.log('globalSearch() event.target:', event.target);
    // console.log('globalSearch() event.target:', event.target);
    // console.log('globalSearch() event.target.value:', (event.target as any).value);
    this.dt.filterGlobal((event.target as any).value, 'contains');
  }

  public getData(row: any, column: TableColumn): string {
    const debug = false;
    const { field, type } = column;
    if (!field) return '';
    if (debug) console.log('getData() row:', row, 'field:', field, 'type:', type, 'column:', column);
    const fieldArr = field.split('.');
    let result = row;
    fieldArr.forEach((field: string) => {
      if (result !== undefined) {
        result = result[field];
      }
    });
    if (debug) console.log('getData() result:', result);
    if (column.foreign) {
      const idField: string = column.foreign.idField || 'id';
      if (debug) console.log('getData() foreign:', column.foreign, 'idField:', idField);
      const foundRow = column.foreign.data.find((foreignRow) => {
        foreignRow[idField] === result;
      });
      if (debug) console.log('getData() foundRow:', foundRow);
      result = foundRow? foundRow[column.foreign.field] : undefined;
      if (debug) console.log('getData() result:', result);
    }
    if (result !== undefined) {
      switch(type) {
      case 'date':
        if (result) {
          result = moment(result).format('L LTS');
        }
        break;
      // case 'boolean':
      //   if (result) {
      //     result = 'T';
      //   }
      //   else {
      //     result = 'F';
      //   }
      //   break;
      // default:
      //   break;
      }
      return result;
    }
    return '';
  }

  exportPdf() {
    // import("jspdf").then(jsPDF => {
    //   import("jspdf-autotable").then(x => {
    //     const doc = new jsPDF.default(0,0);
    //     doc.autoTable(this.columns, this.cars);
    //     doc.save('primengTable.pdf');
    //   })
    // })
  }

  exportExcel() {
    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.getCars());
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "primengTable");
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // import("file-saver").then(FileSaver => {
    //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //   let EXCEL_EXTENSION = '.xlsx';
    //   const data: Blob = new Blob([buffer], {
    //     type: EXCEL_TYPE
    //   });
    //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // });
  }

  public onRowReorder(event: any): void {
    console.log('TableComponent.onRowReorder() event:', event, 'event.dragIndex:', event.dragIndex, 'event.dropIndex:', event.dropIndex);
  }

  public onRowSelect(event: any): void {
    console.log('TableComponent.onRowSelect() event:', event, 'event.originalEvent:', event.originalEvent, 'event.data:', event.data, 'event.type:', event.type, 'event.index:', event.index);
    // if (event.preventDefault) {
    //   event.preventDefault();
    // }
    // if (event.stopPropagation) {
    //   event.stopPropagation();
    // }
  }
  public onRowUnselect(event: any): void {
    console.log('TableComponent.onRowUnselect() event:', event, 'event.originalEvent:', event.originalEvent, 'event.data:', event.data, 'event.type:', event.type, 'event.index:', event.index);
  }

  public onCellClick(data: Record<string, any>, column: TableColumn, event: Event): void {
    console.log('TableComponent.onCellClick() data:', data, 'column:', column, 'event:', event);
    if (column.onClick) {
      column.onClick(data, column, event);
    }
  }
}
