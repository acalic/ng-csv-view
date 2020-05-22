import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren, OnInit } from '@angular/core';

enum DataDelimiters {
  Semicolon = ';',
  Colon = ','
}

/* interface Row {
  guid: string;
  name: string;
  first: string;
  last: string;
  email: string;
  value: string;
  date: string;
  phone: string;
  age: string;
  state: string;
  street: string;
} */

//export type SortColumn = keyof Row | '';
export type SortColumn = '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class TableSortableHeaderComponent {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableComponent implements OnInit {

  @Input() tableData: string;

  @ViewChildren(TableSortableHeaderComponent) headers: QueryList<TableSortableHeaderComponent>;

  formattedTableData: any[];

  ngOnInit() {
    this.formatData(this.tableData);
  }

  onSort({column, direction}: SortEvent) {

    let initialTableData = this.formattedTableData;  

    console.log(direction);

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting data
    if (direction === '' || column === '') {
      this.formattedTableData = initialTableData;
    } else {
      this.formattedTableData = [...initialTableData].sort((a, b) => {
        const res = compare(`${a[column]}`, `${b[column]}`);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  formatData(allText) {
    // split content based on new line
    var allTextLines = allText.split(/\r\n|\n/);

    let delimiter = this.getDelimiter(allTextLines[0]);

    var headers = allTextLines[0].split(delimiter);
    var lines = [];

    for ( var i = 1; i < allTextLines.length; i++) {
        // split content based on delimiter
        let data = allTextLines[i].split(delimiter);

        if (data.length == headers.length) {
            let columnObj = {};

            for ( var j = 0; j < headers.length; j++) {
              columnObj[headers[j]] = data[j];
            }
            lines.push(columnObj);
        }
      }

      this.formattedTableData = lines;
      console.log(this.formattedTableData);
  };

  getDelimiter(str: string) {
    let a = str.split(DataDelimiters.Semicolon)
    let b = str.split(DataDelimiters.Colon)

    return a.length > b.length ? DataDelimiters.Semicolon : DataDelimiters.Colon;
  }

}