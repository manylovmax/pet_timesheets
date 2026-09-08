import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { InputComponent } from "../../components/Input/Input.component";
import { TextareaComponent } from "../../components/Textarea/Textarea.component";
import TasksService, { TimesheetsTask } from "../../services/tasks.service";

@Component({
  selector: 'TaskUpdatePage',
  templateUrl: './TaskUpdate.page.html',
  imports: [MainLayout, InputComponent, TextareaComponent, RouterLink],
})
export class TaskUpdatePage {
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private task: TimesheetsTask | null = null;

  id: number = 0;
  project_id: WritableSignal<number> = signal(0);
  title: WritableSignal<string> = signal('');
  code: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.task = await this.tasksService.get(this.id);
    if (this.task) {
      this.project_id.set(this.task?.project_id);
      this.title.set(String(this.task?.title));
      this.code.set(String(this.task?.code));
      this.description.set(String(this.task?.description));
    }
  }

  async onUpdate() {
    const result = await this.tasksService.update({
      task_id: this.id,
      title: this.title(), 
      description: this.description(), 
      code: this.code()
    });
    if (result)
      this.router.navigate(['/project/' + this.project_id()]);
    else
      alert('Task update failure.');
  }
}