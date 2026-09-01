import { Component, computed, input, OnInit, output } from "@angular/core";

@Component({
  selector: 'TimeTable',
  templateUrl: './TimeTable.component.html',
  styleUrl: './TimeTable.component.css',
  imports: [],
})
export class TimeTable implements OnInit {
  private date = new Date();
  private weekDaysNumbers: number[] = [];
  
  ngOnInit(): void {
    const dayOfWeek = this.date.getDay();// starting from 0
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    this.date.setDate(this.date.getDate() + diffToMonday);
    for (let i = 0; i < 7; i++) {
      this.date.setDate(this.date.getDate() + i)
      this.weekDaysNumbers.push(this.date.getDate())
    }
  }
}