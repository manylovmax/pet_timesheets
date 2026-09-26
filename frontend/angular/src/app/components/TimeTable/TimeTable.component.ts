import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import RecordsService, { TimesheetsRecord } from "../../services/records.service";
import { Router, RouterLink } from "@angular/router";
import  { LucideX } from '@lucide/angular'
import { DropdownComponent, DropdownItem } from "../Dropdown/Dropdown.component";
import TasksService from "../../services/tasks.service";
import { minutesToString, parseTimeToMinutes, time } from "../../utils/time";
import { form, FormField, required } from "@angular/forms/signals";
import { StatefulInput } from "../StatefulInput/StatefulInput.component";
import { StatefulTextarea } from "../StatefulTextarea/StatefulTextarea.component";


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


interface RecordForm {
  date: string;
  time: string;
  comment: string;
}


@Component({
  selector: 'TimeTable',
  templateUrl: './TimeTable.component.html',
  styleUrl: './TimeTable.component.css',
  imports: [StatefulInput, StatefulTextarea, LucideX, RouterLink, DropdownComponent, FormField],
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
  selectedTask: WritableSignal<DropdownItem | null> = signal(null);
  taskOptions: WritableSignal<DropdownItem[]> = signal([]);
  minutesToString = minutesToString;


  formModel = signal<RecordForm>({date: '', comment: '', time: ''});
  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.date, {message: 'Date is required'});
    required(schemaPath.time, {message: 'Spent time is required'});
    time(schemaPath.time); 
  });
  
  async ngOnInit() {
    this.initializeWeekdays(this.currentDate);
    this.refreshRecords();
    const tasks = await this.tasksService.getAll();
    if (tasks.length) {
      this.taskOptions.set(tasks.map(t => ({id: t.id, title: t.title})));
    }
  }

  private initializeWeekdays(startDay: Date) {
    const today = new Date();
    const weekDays: weekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDay);
      const dayOfWeek = date.getDay();// starting from Sunday = 0, Saturday = 6
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      date.setDate(startDay.getDate() - daysToSubtract + i)// remove the daysToSubtract term to start from Sunday
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
      weekDays[i].totalMinutes = 0;
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
      this.formModel.set({
        date: String(this.editingRecord?.date),
        time: minutesToString(this.editingRecord?.minutes),
        comment: this.editingRecord?.comment,
      });
      const seletedTask = this.taskOptions().find(to => to.id === this.editingRecord?.task_id);
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

    if (this.form().invalid() || !this.selectedTask())
      return;


    const result = await this.recordsService.updateRecord({
      task_id: this.editingRecord.task_id,
      record_id: this.editingRecord.id,
      minutes: parseTimeToMinutes(this.formModel().time), 
      date: this.formModel().date,
      comment: this.formModel().comment,
    });

    if (result) {
      await this.refreshRecords();
      this.modalOpen = false;
    }
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

  async goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.initializeWeekdays(this.currentDate);
    await this.refreshRecords();
  }

  async goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.initializeWeekdays(this.currentDate);
    await this.refreshRecords();
  }

  goToOldLayout() {
    this.router.navigate(['/records']);
  }

  goToProjects() {
    this.router.navigate(['/projects']);
  }
}