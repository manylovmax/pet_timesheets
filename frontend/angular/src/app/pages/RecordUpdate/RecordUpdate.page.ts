import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { RecordForm } from "../../components/RecordForm/RecordForm.component";
import RecordsService, { TimesheetsRecord } from "../../services/records.service";
import { DropdownItem } from "../../components/Dropdown/Dropdown.component";
import TasksService from "../../services/tasks.service";

@Component({
  selector: 'RecordUpdatePage',
  templateUrl: './RecordUpdate.page.html',
  imports: [MainLayout, RecordForm],
})
export class RecordUpdatePage implements OnInit {
  private readonly recordsService = inject(RecordsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tasksService = inject(TasksService);

  minutes: WritableSignal<string> = signal('1');
  date: WritableSignal<string> = signal('');
  comment: WritableSignal<string> = signal('');
  selectedTask: WritableSignal<DropdownItem | null> = signal(null);
  taskOptions: WritableSignal<DropdownItem[]> = signal([]);
  private id: number = 0;
  private record: TimesheetsRecord | null = null;

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.record = await this.recordsService.getRecord(this.id);
    if (this.record) {
      this.minutes.set(String(this.record?.minutes));
      this.date.set(String(this.record?.date));
      this.comment.set(String(this.record?.comment));
    }
    const tasks = await this.tasksService.getAll();
    if (tasks.length) {
      this.taskOptions.set(tasks.map(t => ({id: String(t.id), title: t.title})));
      const seletedTask = this.taskOptions().find(to => to.id === String(this.record?.task_id));
      this.selectedTask.set(seletedTask ? seletedTask : null);
    }
  }

  async onUpdate() {
    const result = await this.recordsService.updateRecord({
      task_id: Number(this.selectedTask()?.id),
      record_id: this.id,
      minutes: Number(this.minutes()), 
      date: this.date(),
      comment: this.comment(),
    });
    if (result)
      this.router.navigate(['/timetable']);
    else
      alert('Record update failure.');
  }
}