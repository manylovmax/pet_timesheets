import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import RecordsService, { TimesheetsRecord } from "../../services/records.service";
import { Router, RouterLink } from "@angular/router";
import { TextareaComponent } from "../Textarea/Textarea.component";
import  { LucideX } from '@lucide/angular'
import { DropdownComponent, DropdownItem } from "../Dropdown/Dropdown.component";
import TasksService from "../../services/tasks.service";
import { TimeInputComponent } from "../TimeInput/TimeInput.component";
import { minutesToString } from "../../utils/time";

interface weekDay {
  title: string;
  date: number;
  month: number;
  year: number;
  dateObj: Date;
  index: number;
  records: TimesheetsRecord[];
  isToday: boolean;
  totalMinutes: number;
}

@Component({
  selector: 'TimeTable',
  templateUrl: './TimeTable.component.html',
  styleUrl: './TimeTable.component.css',
  imports: [TextareaComponent, LucideX, RouterLink, DropdownComponent, TimeInputComponent],
})
export class TimeTable implements OnInit {
  private readonly router = inject(Router);
  private readonly recordsService = inject(RecordsService);
  private readonly tasksService = inject(TasksService);

  records: TimesheetsRecord[] = [];
  currentDate = new Date();
  weekDays: WritableSignal<weekDay[]> = signal([]);
  weekDaysPeriodString: string = '';
  modalOpen: boolean = false;
  editingRecord: TimesheetsRecord | undefined;
  minutes: WritableSignal<number> = signal(0);
  date: WritableSignal<string> = signal('');
  comment: WritableSignal<string> = signal('');
  selectedTask: WritableSignal<DropdownItem | null> = signal(null);
  taskOptions: WritableSignal<DropdownItem[]> = signal([]);
  minutesToString = minutesToString;
  
  async ngOnInit() {
    this.currentDate.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    this.initializeWeekdays(this.currentDate);
    this.refreshRecords();
    const tasks = await this.tasksService.getAll();
    if (tasks.length) {
      this.taskOptions.set(tasks.map(t => ({id: String(t.id), title: t.title})));
    }
  }

  private initializeWeekdays(startDay: Date) {
    const today = new Date();
    const weekDays: weekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDay);
      const weekDay = date.getDay();// starting from Sunday = 0, Saturday = 6
      const shiftToMonday = 1 - weekDay;
      date.setDate(startDay.getDate() + shiftToMonday + i)// remove the shiftToMonday term to start from Sunday
      weekDays.push({
        title: date.toLocaleDateString('en-US', { weekday: 'long' }), 
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        dateObj: date,
        index: i,
        records: [],
        isToday: today.toLocaleDateString('en-CA') == date.toLocaleDateString('en-CA'),
        totalMinutes: 0,
      });
    }
    this.weekDays.set(weekDays);
    this.weekDaysPeriodString = 
      weekDays[0].dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      + ' - ' +
      weekDays[weekDays.length - 1].dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
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
        weekDay.totalMinutes += record.minutes;
      }
    }
    this.weekDays.set(weekDays);
  }

  onEdit(recordId: number) {
    this.editingRecord = this.records.find(r => r.id === recordId);
    if (this.editingRecord) {
      this.minutes.set(this.editingRecord?.minutes);
      this.date.set(String(this.editingRecord?.date));
      this.comment.set(String(this.editingRecord?.comment));
      const seletedTask = this.taskOptions().find(to => to.id === String(this.editingRecord?.task_id));
      this.selectedTask.set(seletedTask ? seletedTask : null);
      this.modalOpen = true;
    }
  }

  closeModal() {
    this.modalOpen = false;
  }
  
  async onSave() {
    if (!this.editingRecord)
      return;

    const result = await this.recordsService.updateRecord({
      task_id: this.editingRecord.task_id,
      record_id: this.editingRecord.id,
      minutes: this.minutes(), 
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

  goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.initializeWeekdays(this.currentDate);
    this.refreshRecords();
  }

  goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.initializeWeekdays(this.currentDate);
    this.refreshRecords();
  }

  goToOldLayout() {
    this.router.navigate(['/records']);
  }

  goToProjects() {
    this.router.navigate(['/projects']);
  }
}