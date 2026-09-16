import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { Router, RouterLink } from "@angular/router";
import ProjectsService from "../../services/projects.service";
import { form, required, FormField } from "@angular/forms/signals";
import { StatefulInput } from "../../components/StatefulInput/StatefulInput.component";
import { StatefulTextarea } from "../../components/StatefulTextarea/StatefulTextarea.component";

interface ProjectFormModel {
  title: string;
  code: string;
  description: string;
}

@Component({
  selector: 'ProjectCreatePage',
  templateUrl: './ProjectCreate.page.html',
  imports: [MainLayout, StatefulInput, StatefulTextarea, RouterLink, FormField],
})
export class ProjectCreatePage {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);

  projectModel = signal<ProjectFormModel>({title: '', code: '', description: ''});
  projectForm = form(this.projectModel, (schemaPath) => {
    required(schemaPath.title, {message: 'Title is required'});
    required(schemaPath.code, {message: 'Code is required'});
  });

  async onCreate() {
    if (this.projectForm().invalid())
      return;
    
    const result = await this.projectsService.create(this.projectModel());
    if (result)
      this.router.navigate(['/projects']);
    else
      alert('Project creation failure.');
  }
}