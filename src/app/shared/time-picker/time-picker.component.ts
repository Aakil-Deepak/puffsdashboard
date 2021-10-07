import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimepickerComponent implements OnInit {
  
  @Input() model: any;
  @Output() onValueChanged = new EventEmitter<any>();

  spinners = false;
  meridian = false;

  constructor() { }

  ngOnInit(): void {

  }

  sendTimeEvent(){
    this.onValueChanged.emit(this.model);
  }
}
