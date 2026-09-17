import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import TasksService, { TimesheetsTask } from "../../services/tasks.service";
import { StatefulInput } from "../../components/StatefulInput/StatefulInput.component";
import { StatefulTextarea } from "../../components/StatefulTextarea/StatefulTextarea.component";
import { form, FormField, required } from "@angular/forms/signals";


interface TaskFormModel {
  title: string;
  code: string;
  description: string;
}


@Component({
  selector: 'TaskUpdatePage',
  templateUrl: './TaskUpdate.page.html',
  imports: [MainLayout, StatefulInput, StatefulTextarea, RouterLink, FormField],
})
export class TaskUpdatePage {
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private task: TimesheetsTask | null = null;

  id: number = 0;
  project_id: WritableSignal<number> = signal(0);

  taskModel = signal<TaskFormModel>({title: '', code: '', description: ''});
  taskForm = form(this.taskModel, (schemaPath) => {
    required(schemaPath.title, {message: 'Title is required'});
    required(schemaPath.code, {message: 'Code is required'});
  });


  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.task = await this.tasksService.get(this.id);
    if (this.task) {
      this.project_id.set(this.task?.project_id);
      this.taskModel.set({
        title: this.task?.title,
        code: this.task?.code,
        description: this.task?.description,
      })
    }
  }

  async onUpdate() {
    if (this.taskForm().invalid())
      return;

    const result = await this.tasksService.update({
      task_id: this.id,
      ...this.taskModel(),
    });
    if (result)
      this.router.navigate(['/project/' + this.project_id()]);
    else
      alert('Task update failure.');
  }
}