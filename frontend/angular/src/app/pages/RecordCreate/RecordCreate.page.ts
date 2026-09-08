import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
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

  minutes: WritableSignal<string> = signal('1');
  date: WritableSignal<string> = signal('');
  comment: WritableSignal<string> = signal('');
  selectedTask: WritableSignal<DropdownItem | null> = signal(null);
  taskOptions: WritableSignal<DropdownItem[]> = signal([]);


  async ngOnInit() {
    const tasks = await this.tasksService.getAll();
    if (tasks.length) {
      this.taskOptions.set(tasks.map(t => ({id: String(t.id), title: t.title})));
    }
    console.log('tasks', tasks);
  }

  async onCreate() {
    if (!this.selectedTask())
      return;

    const result = await this.recordsService.createRecord({
      task_id: Number(this.selectedTask()?.id),
      minutes: Number(this.minutes()), 
      date: this.date(), 
      comment: this.comment()
    });
    if (result)
      this.router.navigate(['/timetable']);
    else
      alert('Record creation failure.');
  }
}