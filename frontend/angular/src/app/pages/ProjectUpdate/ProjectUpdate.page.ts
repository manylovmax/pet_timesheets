import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import ProjectsService, { TimesheetsProject } from "../../services/projects.service";
import { form, required, FormField } from "@angular/forms/signals";
import { StatefulInput } from "../../components/StatefulInput/StatefulInput.component";
import { StatefulTextarea } from "../../components/StatefulTextarea/StatefulTextarea.component";


interface ProjectFormModel {
  title: string;
  code: string;
  description: string;
}


@Component({
  selector: 'ProjectUpdatePage',
  templateUrl: './ProjectUpdate.page.html',
  imports: [MainLayout, StatefulInput, StatefulTextarea, RouterLink, FormField],
})
export class ProjectUpdatePage {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private project: TimesheetsProject | null = null;

  private id: number = 0;

  projectModel = signal<ProjectFormModel>({title: '', code: '', description: ''});
  projectForm = form(this.projectModel, (schemaPath) => {
    required(schemaPath.title, {message: 'Title is required'});
    required(schemaPath.code, {message: 'Code is required'});
  });


  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.project = await this.projectsService.get(this.id);
    if (this.project) {
      this.projectModel.set(this.project)
    }
  }

  async onUpdate() {
    if (this.projectForm().invalid())
      return;

    const result = await this.projectsService.update({
      project_id: this.id,
      title: this.projectModel().title, 
      description: this.projectModel().description, 
      code: this.projectModel().code
    });
    if (result)
      this.router.navigate(['/projects']);
    else
      alert('Project update failure.');
  }
}