import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export function toNgbDate(date: Date): NgbDateStruct {
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};
}