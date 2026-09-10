import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import ProjectsService, { TimesheetsProject } from "../../services/projects.service";
import { TableColumn, TasksTableComponent } from "../../components/TasksTableComponent/TasksTableComponent.component";
import TasksService, { TimesheetsTask } from "../../services/tasks.service";
import { minutesToString } from "../../utils/time";

@Component({
  selector: 'ProjectPage',
  templateUrl: './Project.page.html',
  imports: [MainLayout, RouterLink, TasksTableComponent],
})
export class ProjectPage {
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private readonly route = inject(ActivatedRoute);

  private project: TimesheetsProject | null = null;
  id: number = 0;

  title: WritableSignal<string> = signal('');
  code: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');

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
    {
      label: 'Spent time',
      attribute: 'total_minutes',
    },
  ];
  private tasks: TimesheetsTask[] = [];
  mappedTasks: WritableSignal<Record<string, string>[]> = signal([]);

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.project = await this.projectsService.get(this.id);
    if (this.project) {
      this.title.set(String(this.project?.title));
      this.code.set(String(this.project?.code));
      this.description.set(String(this.project?.description));
      await this.refreshTasks();
    }
  }


  private async refreshTasks(): Promise<void> {
    this.tasks = await this.tasksService.getAllForProject(this.id);
    this.mappedTasks.set(this.tasks.map(r => ({
      'id': `${r.id}`,
      'user_id': `${r.user_id}`,
      'title': r.title,
      'description': r.description,
      'code': r.code,
      'total_minutes': r.total_minutes ? minutesToString(r.total_minutes) : '',
    })));
  }

  goToUpdateTaskPage(index: number) {
    const id = this.tasks[index]?.id;
    this.router.navigate(['/task/' + id + '/update']);
  }

  async deleteTask(index: number) {
    const id = this.tasks[index]?.id;
    if (id) {
      const result = await this.tasksService.delete(id);
      if (result) {
        await this.refreshTasks();
      }
    }
  }

  goToTask(index: number) {
    const id = this.tasks[index]?.id;
    this.router.navigate(['/task/' + id]);
  }
}