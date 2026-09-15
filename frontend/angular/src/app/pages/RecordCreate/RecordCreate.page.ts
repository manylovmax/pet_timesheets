import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { RecordForm } from "../../components/RecordForm/RecordForm.component";
import RecordsService from "../../services/records.service";
import { Router } from "@angular/router";
import TasksService from "../../services/tasks.service";
import { DropdownItem } from "../../components/Dropdown/Dropdown.component";

@Component({
  selector: 'RecordCreatePage',
  templateUrl: './RecordCreate.page.html',
  imports: [MainLayout, RecordForm],
})
export class RecordCreatePage implements OnInit {
  private readonly recordsService = inject(RecordsService);
  private readonly router = inject(Router);
  private readonly tasksService = inject(TasksService);

  minutes: WritableSignal<number> = signal(0);
  date: WritableSignal<string> = signal('');
  dateValidationMessage: string = '';
  comment: WritableSignal<string> = signal('');
  selectedTask: WritableSignal<DropdownItem | null> = signal(null);
  taskOptions: WritableSignal<DropdownItem[]> = signal([]);

  constructor() {
    effect(() => {
      const date = this.date();
      if (!date)
        this.dateValidationMessage = 'This field is required';
    });
  }


  async ngOnInit() {
    const tasks = await this.tasksService.getAll();
    if (tasks.length) {
      this.taskOptions.set(tasks.map(t => ({id: String(t.id), title: t.title})));
    }
  }

  async onCreate() {
    if (!this.selectedTask())
      return;

    if (!this.date())
      return;

    const result = await this.recordsService.createRecord({
      task_id: Number(this.selectedTask()?.id),
      minutes: this.minutes(), 
      date: this.date(), 
      comment: this.comment()
    });
    if (result)
      this.router.navigate(['/timetable']);
    else
      alert('Record creation failure.');
  }
}