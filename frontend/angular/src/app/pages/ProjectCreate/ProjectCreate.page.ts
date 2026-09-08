import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { Router, RouterLink } from "@angular/router";
import ProjectsService from "../../services/projects.service";
import { InputComponent } from "../../components/Input/Input.component";
import { TextareaComponent } from "../../components/Textarea/Textarea.component";

@Component({
  selector: 'ProjectCreatePage',
  templateUrl: './ProjectCreate.page.html',
  imports: [MainLayout, InputComponent, TextareaComponent, RouterLink],
})
export class ProjectCreatePage {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);

  title: WritableSignal<string> = signal('');
  code: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

  async onCreate() {
    const result = await this.projectsService.create({title: this.title(), description: this.description(), code: this.code()});
    if (result)
      this.router.navigate(['/projects']);
    else
      alert('Project creation failure.');
  }
}