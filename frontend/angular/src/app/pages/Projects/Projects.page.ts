import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { Router, RouterLink } from "@angular/router";
import ProjectsService, { TimesheetsProject } from "../../services/projects.service";
import { ProjectsTableComponent, TableColumn } from "../../components/ProjectsTableComponent/ProjectsTableComponent.component";

@Component({
  selector: 'ProjectsPage',
  templateUrl: './Projects.page.html',
  imports: [MainLayout, ProjectsTableComponent, RouterLink],
})
export class ProjectsPage implements OnInit {
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);

  columns: Array<TableColumn> = [
    {
      label: 'Title',
      attribute: 'title',
    },
    {
      label: 'Code',
      attribute: 'code',
    },
    {
      label: 'Description',
      attribute: 'description',
    },
  ];
  private projects: TimesheetsProject[] = [];
  mappedProjects: WritableSignal<Record<string, string>[]> = signal([]);

  async ngOnInit(): Promise<void> {
    await this.refreshProjects();
  }

  private async refreshProjects(): Promise<void> {
    this.projects = await this.projectsService.getAll();
    this.mappedProjects.set(this.projects.map(r => ({
      'id': `${r.id}`,
      'user_id': `${r.user_id}`,
      'title': r.title,
      'description': r.description,
      'code': r.code,
    })));
  }

  goToUpdatePage(index: number) {
    const id = this.projects[index]?.id;
    this.router.navigate(['/project-update/' + id]);
  }

  async deleteProject(index: number) {
    const id = this.projects[index]?.id;
    if (id) {
      const result = await this.projectsService.delete(id);
      if (result) {
        await this.refreshProjects();
      }
    }
  }

  goToTimetable() {
    this.router.navigate(['/timetable']);
  }

  goToProject(index: number) {
    const id = this.projects[index]?.id;
    this.router.navigate(['/project/' + id]);
  }
}