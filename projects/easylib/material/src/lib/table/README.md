# Table

Easy table.

## How to use

- Import module in `app.module`:
### app.module.ts
```ts
import { TableModule } from '@easylib/material';
@NgModule({
  imports: [
    TableModule,
  ],
})
```

- Add in your component:
### app.component.html
```html
<app-table
[data]="comments"
[columns]="columns"
[selectRows]="true"
[(selectedRows)]="selectedRows"
[paginator]="true"
[paginateRow]="10"
></app-table>
```

### app.component.ts
```ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Columns } from '@easylib/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public columns: Columns = [
    {
      field: 'id',
      header: 'ID',
      type: 'numeric',
      width: '100px',
    },
    {
      field: 'post.user.name',
      header: 'Name',
      sortable: 'post.user.name',
      width: '15%',
    },
    {
      field: 'post.user.email',
      header: 'Email',
      sortable: 'post.user.email',
      width: '20%',
    },
    {
      field: 'post.title',
      header: 'Post',
      sortable: 'post.title',
    },
    {
      field: 'email',
      header: 'Email',
      sortable: 'email',
      filter: true,
      width: '20%',
    },
  ]

  private _selectedRows: any;
  get selectedRows(): any {
    // this.log('UsersComponent.get selectedRows:', this._selectedRows);
    return this._selectedRows;
  }
  set selectedRows(selected: any) {
    this.log('UsersComponent.set selectedRows:', selected);
    this._selectedRows = selected;
  }

  public users!: Record<string, any>[];
  public posts!: Record<string, any>[];
  public comments!: Record<string, any>[];

  constructor(private http: HttpClient,) {}

  ngOnInit(): void {
    this.http.get('https://jsonplaceholder.typicode.com/users')
    .toPromise()
    .then((data: any) => {
      this.users = data as Record<string, any>[];
      return Promise.resolve();
    })
    .then(() => {
      return this.http.get('https://jsonplaceholder.typicode.com/posts')
      .toPromise();
    })
    .then((data: any) => {
      this.posts = data as Record<string, any>[];
      return Promise.resolve();
    })
    .then(() => {
      return this.http.get('https://jsonplaceholder.typicode.com/comments')
      .toPromise();
    })
    .then((data: any) => {
      const comments: Record<string, any>[] = data as Record<string, any>[];
      comments.forEach((comment: Record<string, any>) => {
        comment.post = this.posts.find((post: Record<string, any>) => {
          return post.id === comment.postId;
        })
        comment.post.user = this.users.find((user: Record<string, any>) => {
          return user.id === comment.post.userId;
        })
      });
      this.comments = comments;
      console.log('comments:', comments);
    });
  }

}
```

## Group example with structured JSON data

Multiple row grouping doesn't works. Use `groupRowsBy` to set field name to use
in row grouping. To group rown set `group: true` in columns you want to group.

This example shows how to group rows in the first two columns.
Data is structured with multiple sub-children, but only one grouping can be done
with this table version.

Note: table grouping works only in no scrollable mode.

### HTML

```html
<app-table
[data]="data"
[columns]="columns"
[scrollable]="false"
groupRowsBy="father"
></app-table>
```

### Columns

```js
[
  {
    header: 'Father',
    field: 'father',
    group: true,
  },
  {
    header: 'Name',
    field: 'name',
    group: true,
  },
  {
    header: 'Child',
    field: 'child',
    father: 'children',
    childrenLevel: 1,
  },
  {
    header: 'SubChild',
    field: 'subchild',
    father: 'subchildren',
    childrenLevel: 2,
  },
]
```

### Data

```js
[
  {
    father: '1',
    father: 'uno',
    children: [
      {
        child: '1.1',
        subchildren: [
          {
            subchild: '1.1.1',
          },
          {
            subchild: '1.1.2',
          },
        ]
      },
      {
        child: '1.2',
        subchildren: [
          {
            subchild: '1.2.1',
          },
          {
            subchild: '1.2.2',
          },
        ]
      },
    ],
  },
  {
    father: '2',
    father: 'due',
    children: [
      {
        child: '2.1',
        subchildren: [
          {
            subchild: '2.1.1',
          },
          {
            subchild: '2.1.2',
          },
        ]
      },
      {
        child: '2.2',
        subchildren: [
          {
            subchild: '2.2.1',
          },
          {
            subchild: '2.2.2',
          },
        ]
      },
    ],
  },
]
```

### Result table

| Father | name | Child | SubChild |
|--------|------|-------|----------|
| 1      | uno  | 1.1   | 1.1.1    |
|        |      | 1.1   | 1.1.2    |
|        |      | 1.2   | 1.2.1    |
|        |      | 1.2   | 1.2.2    |
| 2      | due  | 2.1   | 2.1.1    |
|        |      | 2.1   | 2.1.2    |
|        |      | 2.2   | 2.2.1    |
|        |      | 2.2   | 2.2.2    |


## API

### EasyTable properties

| Name | Type | Default | Description |
|---|---|---|---|
| columns | array | undefined | An array of objects to represent dynamic columns. |
| data | array | undefined | An array of objects to display. |
| dataKey | string | id | A property to uniquely identify a record in data. |
| scrollable | boolean | true | When specifies, enables horizontal and/or vertical scrolling. |
| scrollHeight | string | flex | Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size. |
| stackResponsive | boolean | false | When scrollable is false, enable columns displayed as stacked after a certain breakpoint (stack responsive layout). |
| stackBreakpoint | string | 960px | The breakpoint to define the maximum width boundary when using stack responsive layout. |
| paginator | boolean | false | When specified as true, enables the pagination. |
| paginateRows | number | 100 | Number of rows to display per page. |
| paginateFirst | number | 0 | Two way binding. Index of the first row to be displayed. |
| rowsPerPageOptions | (number | { showAll: string })[] | [10, 50, 100, {showAll:'All'}] | Array of integer/object values to display inside rows per page dropdown of paginator. |
| alwaysShowPaginator | boolean | true | Whether to show it even there is only one page. |
| paginatorPosition | string | bottom | Position of the paginator, options are "top","bottom" or "both". |
| showPageLinks | boolean | false | Whether to show page links. |
| pageLinks | number | null | Number of page links to display in paginator. |
| showJumpToPageDropdown | boolean | true | Whether to display a dropdown to navigate to any page. |
| showCurrentPageReport | boolean | false | Whether to display current page report. |
| currentPageReportTemplate | string | ({currentPage} of {totalPages}) | Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} |
| showJumpToPageInput | boolean | false | Whether to display a input to navigate to any page. |
| showFirstLastIcon | boolean | true | When enabled, icons are displayed on paginator to go first and last page. |
| groupRowsBy | string | null | Field name to use in row grouping. With this table multiple grouping doesn't works. It can be possible to group more than one field (always only by one field) setting "group: true" in column property. |
| selectRows | boolean | false | Whether to display a first column with rows checkbox selection. |
| selectedRows | any | | Two way binding. Selected row in single mode or an array of values in multiple mode. |
| caption | string | | Caption content of the table. |
| globalFilterFields | array | null | An array of fields as string to use in global filtering. |
| resizableColumns | boolean | false | When enabled, columns can be resized using drag and drop. |
| reorderableColumns | boolean | false | When enabled, columns can be reordered using drag and drop. |
| loading | boolean | false | Displays a loader to indicate data load is in progress. |
| reorderableRows | boolean | false | When enabled, rows can be reordered using drag and drop. |
| rowHover | boolean | true | Adds hover effect to rows without the need for selectionMode. |

### Columns

| Name | Type | Default | Description |
|---|---|---|---|
| field | string | | Field name in data array object to use in column. |
| header | string | | Name to display in header column. |
| sortable | boolean | | Sortable column (default false). |
| filter | boolean | | Activate column filtering (default false). |
| type | string | | Column type for filtering. Values are: text (default) \| numeric \| boolean \| date. |
| width | string | | Column width. Example: '200px', '15%'. |
| style | string | | Custom style and automatic width from `width` (if `scrollable` uses flex layout). |
| buttonIcon | string | | Show `button-icon` and set icon name. |
| onButtonClick | Function | | Function to invoke on button click. Params sent: `data`, `column`, `$event`. |

```ts
export interface Column {
  field?: string, // fielad name
  header?: string, // header name
  sortable?: string, // sortable column name
  type?: 'text' | 'numeric' | 'boolean' | 'date', // text (default) | numeric | boolean | date
  filter?: boolean, // activate filter in header
  width?: string, // column width
  style?: string, // custom style and automatic width from `width`
  icon?: string, // custom content
  iconClick?: Function,
}
```
