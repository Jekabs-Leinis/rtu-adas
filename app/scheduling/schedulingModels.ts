import { Timestamp } from "@firebase/firestore";

export class Shift {
  constructor(
    public id: string,
    public employee: Employee,
    public shiftStart: Date | Timestamp,
    public shiftEnd: Date | Timestamp,
    public isOvertime: boolean,
  ) {}
}

export class Employee {
  constructor(
    public id: string,
    public name: string,
  ) {}
}
