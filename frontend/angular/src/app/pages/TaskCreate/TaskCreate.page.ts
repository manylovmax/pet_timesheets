import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import ProjectsService from "../../services/projects.service";
import { InputComponent } from "../../components/Input/Input.component";
import { TextareaComponent } from "../../components/Textarea/Textarea.component";
import TasksService from "../../services/tasks.service";

@Component({
  selector: 'TaskCreatePage',
  templateUrl: './TaskCreate.page.html',
  imports: [MainLayout, InputComponent, TextareaComponent, RouterLink],
})
export class TaskCreatePage {
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id: number = 0;
  title: WritableSignal<string> = signal('');
  code: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async onCreate() {
    const result = await this.tasksService.create({
      project_id: this.id,
      title: this.title(), 
      description: this.description(), 
      code: this.code()
    });
    if (result)
      this.router.navigate(['/project/' + this.id]);
    else
      alert('Task creation failure.');
  }
}