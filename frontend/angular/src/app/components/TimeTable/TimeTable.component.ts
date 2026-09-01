import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import RecordsService, { TimesheetsRecord } from "../../services/records.service";
import { Router } from "@angular/router";
import { TextareaComponent } from "../Textarea/Textarea.component";
import { InputComponent } from "../Input/Input.component";

interface weekDay {
  title: string;
  date: number;
  month: number;
  year: number;
  dateObj: Date;
  index: number;
  records: TimesheetsRecord[];
  isToday: boolean;
}

@Component({
  selector: 'TimeTable',
  templateUrl: './TimeTable.component.html',
  styleUrl: './TimeTable.component.css',
  imports: [TextareaComponent, InputComponent],
})
export class TimeTable implements OnInit {
  private readonly router = inject(Router);
  private readonly recordsService = inject(RecordsService);
  records: TimesheetsRecord[] = [];
  private today = new Date();
  weekDays: WritableSignal<weekDay[]> = signal([]);
  modalOpen: boolean = false;
  editingRecord: TimesheetsRecord | undefined;
  minutes: WritableSignal<string> = signal('1');
  date: WritableSignal<string> = signal('');
  comment: WritableSignal<string> = signal('');
  
  ngOnInit(): void {
    const dayOfWeek = this.today.getDay();// starting from 0 - Sunday
    const date = new Date();
    date.setDate(this.today.getDate() - dayOfWeek);
    this.initializeWeekdays(date);
    this.refreshRecords();
  }

  private initializeWeekdays(startDay: Date) {
    const weekDays: weekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i)
      weekDays.push({
        title: date.toLocaleDateString('en-US', { weekday: 'long' }), 
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        dateObj: date,
        index: i,
        records: [],
        isToday: this.today.toLocaleDateString('en-CA') == date.toLocaleDateString('en-CA')
      });
    }
    this.weekDays.set(weekDays);
  }

  private async refreshRecords(): Promise<void> {
    const weekDays = structuredClone(this.weekDays());
    for (let i = 0; i < weekDays.length; i++) {
      weekDays[i].records = [];
    }
    const startDate = weekDays[0].dateObj.toLocaleDateString('en-CA')
    const endDate = weekDays[weekDays.length - 1].dateObj.toLocaleDateString('en-CA')
    this.records = await this.recordsService.getRecordsForPeriod(startDate, endDate);
    for (let i = 0; i < this.records.length; i++) {
      const record = this.records[i];
      const weekDay = weekDays.find(wd => wd.dateObj.toLocaleDateString('en-CA') == record.date);
      if (weekDay) {
        weekDay.records.push(record);
      }
    }
    this.weekDays.set(weekDays);
  }

  onEdit(recordId: number) {
    this.editingRecord = this.records.find(r => r.id === recordId);
    if (this.editingRecord) {
      this.minutes.set(String(this.editingRecord?.minutes));
      this.date.set(String(this.editingRecord?.date));
      this.comment.set(String(this.editingRecord?.comment));
      this.modalOpen = true;
    }
  }

  onView() {
    this.modalOpen = false;
  }
  
  async onSave() {
    if (!this.editingRecord)
      return;

    const result = await this.recordsService.updateRecord({
      recordId: this.editingRecord.id,
      minutes: Number(this.minutes()), 
      date: this.date(),
      comment: this.comment(),
    });
    if (result) {
      await this.refreshRecords();
      this.modalOpen = false;
    } else
      alert('Record update failure.');
  }

  async onDelete() {
    const recordId = this.editingRecord?.id;
    if (recordId) {
      const result = await this.recordsService.deleteRecord(recordId);
      if (result) {
        await this.refreshRecords();
        this.modalOpen = false;
      }
    }
  }

  goToCreate() {
    this.router.navigate(['/record-create']);
  }
}