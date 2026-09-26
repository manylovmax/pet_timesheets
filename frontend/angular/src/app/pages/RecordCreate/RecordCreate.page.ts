import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import RecordsService from "../../services/records.service";
import { Router, RouterLink } from "@angular/router";
import TasksService from "../../services/tasks.service";
import { DropdownComponent, DropdownItem } from "../../components/Dropdown/Dropdown.component";
import { form, FormField, required } from "@angular/forms/signals";
import { parseTimeToMinutes, time } from "../../utils/time";
import { StatefulInput } from "../../components/StatefulInput/StatefulInput.component";
import { StatefulTextarea } from "../../components/StatefulTextarea/StatefulTextarea.component";


interface RecordForm {
  date: string;
  time: string;
  comment: string;
}


@Component({
  selector: 'RecordCreatePage',
  templateUrl: './RecordCreate.page.html',
  imports: [MainLayout, StatefulInput, StatefulTextarea, DropdownComponent, FormField, RouterLink],
})
export class RecordCreatePage implements OnInit {
  private readonly recordsService = inject(RecordsService);
  private readonly router = inject(Router);
  private readonly tasksService = inject(TasksService);

  selectedTask: WritableSignal<DropdownItem | null> = signal(null);
  taskOptions: WritableSignal<DropdownItem[]> = signal([]);

  formModel = signal<RecordForm>({date: '', comment: '', time: ''});
  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.date, {message: 'Date is required'});
    required(schemaPath.time, {message: 'Spent time is required'});
    time(schemaPath.time); 
  });


  async ngOnInit() {
    const tasks = await this.tasksService.getAll();
    if (tasks.length) {
      this.taskOptions.set(tasks.map(t => ({id: t.id, title: t.title})));
    }
  }

  async onCreate() {
    if (!this.selectedTask())
      return;

    if (this.form().invalid() || !this.selectedTask())
      return;

    const result = await this.recordsService.createRecord({
      task_id: Number(this.selectedTask()?.id),
      minutes: parseTimeToMinutes(this.formModel().time), 
      date: this.formModel().date, 
      comment: this.formModel().comment,
    });
    if (result)
      this.router.navigate(['/timetable']);
    else
      alert('Record creation failure.');
  }
}