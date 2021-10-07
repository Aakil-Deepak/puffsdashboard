import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-datepicker-popup',
  templateUrl: './datepicker-popup.component.html',
  styleUrls: ['./datepicker-popup.component.css']
})
export class DatepickerPopupComponent implements OnInit {
  
  @Input() model: NgbDateStruct | undefined;
  @Output() dateEventEmitter = new EventEmitter<NgbDateStruct>();

  constructor() { }

  ngOnInit(): void {
  }

  sendDateEvent(){
    this.dateEventEmitter.emit(this.model);
  }
}
