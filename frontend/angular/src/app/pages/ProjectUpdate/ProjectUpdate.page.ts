import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import ProjectsService, { TimesheetsProject } from "../../services/projects.service";
import { InputComponent } from "../../components/Input/Input.component";
import { TextareaComponent } from "../../components/Textarea/Textarea.component";

@Component({
  selector: 'ProjectUpdatePage',
  templateUrl: './ProjectUpdate.page.html',
  imports: [MainLayout, InputComponent, TextareaComponent, RouterLink],
})
export class ProjectUpdatePage {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private project: TimesheetsProject | null = null;

  private id: number = 0;
  title: WritableSignal<string> = signal('');
  code: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.project = await this.projectsService.get(this.id);
    if (this.project) {
      this.title.set(String(this.project?.title));
      this.code.set(String(this.project?.code));
      this.description.set(String(this.project?.description));
    }
  }

  async onUpdate() {
    const result = await this.projectsService.update({
      project_id: this.id,
      title: this.title(), 
      description: this.description(), 
      code: this.code()
    });
    if (result)
      this.router.navigate(['/projects']);
    else
      alert('Project update failure.');
  }
}