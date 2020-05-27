import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren, OnInit, PipeTransform } from '@angular/core';
import { KeyValue, DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { map, startWith } from "rxjs/operators";

import { CsvOperationsService } from '@app/core/csv.service';

enum DataDelimiters {
  Semicolon = ';',
  Colon = ','
}

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

  formattedTableData: any;
  filteredFormattedTableData: any;

  page = 1;
  pageSize = 5;
  collectionSize: number;

  filter = new FormControl('');

  constructor(
    public pipe: DecimalPipe,
    private _csvOperations: CsvOperationsService
  ) {
      this.filter.valueChanges.subscribe(value => {
        this.filteredFormattedTableData = this.search(value, this.pipe)
        this.collectionSize = this.filteredFormattedTableData.length;
      });
    }

  ngOnInit() {
    this.formatData(this.tableData);
  }

  search(text: string, pipe: PipeTransform): any {
    const term = text.toLowerCase();
    return this.formattedTableData.filter(item =>
      Object.keys(item).some(
        k =>
          item[k] != null &&
          item[k]
            .toString()
            .toLowerCase()
            .includes(term.toLowerCase())
      )
    );
  }

  onSort({column, direction}: SortEvent) {

    let initialTableData = this.formattedTableData;  

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
    let allTextLines = allText.split(/\r\n|\n/);

    let delimiter = this._csvOperations.getDelimiter(allTextLines[0]);

    let headers = allTextLines[0].split(delimiter);
    let lines = [];

    for ( let i = 1; i < allTextLines.length; i++) {
        // split content based on delimiter
        let data = allTextLines[i].split(delimiter);

        if (data.length == headers.length) {
            let columnObj = {};

            for ( let j = 0; j < headers.length; j++) {
              if(headers[j] === 'state' && data[j] === '') data[j] = 'BLANK';
              columnObj[headers[j]] = data[j];
            }
            lines.push(columnObj);
        }
      }
      this.formattedTableData = lines;
      this.collectionSize = this.formattedTableData.length;
  };

  get rows(): any[] {
    return this.formattedTableData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  get filteredRows(): any[] {
    return this.filteredFormattedTableData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  // Order by ascending property value
  valueAscOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return a.value.localeCompare(b.value);
  }

  // Order by descending property key
  keyDescOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }
}