import { Routes } from '@angular/router';
import { SigninPage } from './pages/Signin/Signin.page';
import { SignupPage } from './pages/Signup/Signup.page';
import { RecordUpdatePage } from './pages/RecordUpdate/RecordUpdate.page';
import { RecordsPage } from './pages/Records/Records.page';
import { RecordCreatePage } from './pages/RecordCreate/RecordCreate.page';
import { authGuard } from './guards/AuthGuard';
import { TimeTablePage } from './pages/TimeTable/TimeTable.page';
import { ProjectsPage } from './pages/Projects/Projects.page';
import { ProjectCreatePage } from './pages/ProjectCreate/ProjectCreate.page';
import { ProjectUpdatePage } from './pages/ProjectUpdate/ProjectUpdate.page';
import { ProjectPage } from './pages/Project/Project.page';
import { TaskCreatePage } from './pages/TaskCreate/TaskCreate.page';
import { TaskUpdatePage } from './pages/TaskUpdate/TaskUpdate.page';

export const routes: Routes = [
  { path: '', redirectTo: '/timetable', pathMatch: 'full' },
  {
    path: 'signin',
    component: SigninPage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: 'records',
    component: RecordsPage,
    canActivate: [authGuard],
  },
  { 
    path: 'record-update/:id',
    component: RecordUpdatePage,
    canActivate: [authGuard],
  },
  { 
    path: 'record-create',
    component: RecordCreatePage,
    canActivate: [authGuard],
  },
  {
    path: 'timetable',
    component: TimeTablePage,
    canActivate: [authGuard],
  },
  {
    path: 'projects',
    component: ProjectsPage,
    canActivate: [authGuard],
  },
  {
    path: 'project-create',
    component: ProjectCreatePage,
    canActivate: [authGuard],
  },
  { 
    path: 'project-update/:id',
    component: ProjectUpdatePage,
    canActivate: [authGuard],
  },
  {
    path: 'project/:id',
    component: ProjectPage,
    canActivate: [authGuard],
  },
  {
    path: 'project/:id/create-task',
    component: TaskCreatePage,
    canActivate: [authGuard],
  },
  {
    path: 'task/:id/update',
    component: TaskUpdatePage,
    canActivate: [authGuard],
  },
];
