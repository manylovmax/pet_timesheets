import { Routes } from '@angular/router';
import { SigninPage } from './pages/Signin/Signin.page';
import { SignupPage } from './pages/Signup/Signup.page';
import { RecordUpdatePage } from './pages/RecordUpdate/RecordUpdate.page';
import { RecordsPage } from './pages/Records/Records.page';
import { RecordCreatePage } from './pages/RecordCreate/RecordCreate.page';
import { authGuard } from './guards/AuthGuard';

export const routes: Routes = [
  { path: '', redirectTo: '/records', pathMatch: 'full' },
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
];
