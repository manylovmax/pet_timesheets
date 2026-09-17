import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import TasksService from "../../services/tasks.service";
import { StatefulInput } from "../../components/StatefulInput/StatefulInput.component";
import { StatefulTextarea } from "../../components/StatefulTextarea/StatefulTextarea.component";
import { form, FormField, required } from "@angular/forms/signals";


interface TaskFormModel {
  title: string;
  code: string;
  description: string;
}


@Component({
  selector: 'TaskCreatePage',
  templateUrl: './TaskCreate.page.html',
  imports: [MainLayout, StatefulInput, StatefulTextarea, RouterLink, FormField],
})
export class TaskCreatePage {
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id: number = 0;

  taskModel = signal<TaskFormModel>({title: '', code: '', description: ''});
  taskForm = form(this.taskModel, (schemaPath) => {
    required(schemaPath.title, {message: 'Title is required'});
    required(schemaPath.code, {message: 'Code is required'});
  });

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async onCreate() {
    if (this.taskForm().invalid())
      return;

    const result = await this.tasksService.create({
      project_id: this.id,
      ...this.taskModel()
    });
    if (result)
      this.router.navigate(['/project/' + this.id]);
    else
      alert('Task creation failure.');
  }
}