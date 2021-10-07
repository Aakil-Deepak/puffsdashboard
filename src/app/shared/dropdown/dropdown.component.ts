import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  @Input() items: string[] = [];
  @Output() onSelected = new EventEmitter<string>();  

  defaultValue: string = "Select "; 
  
  changeSortOrder(newSortOrder: string) { 
    this.defaultValue = newSortOrder;
    this.onSelected.emit(newSortOrder);    
  }
}
