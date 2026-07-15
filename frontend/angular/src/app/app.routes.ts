import { Routes } from '@angular/router';
import { SigninPage } from './pages/Signin/Signin.page';
import { SignupPage } from './pages/Signup/Signup.page';

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
  },
];
