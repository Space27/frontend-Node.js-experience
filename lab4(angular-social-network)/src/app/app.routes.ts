import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ProfileComponent} from './components/profile/profile.component';
import {NewsComponent} from './components/news/news.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register/:email',
    component: RegisterComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'user/:id',
    component: ProfileComponent
  },
  {
    path: 'user/:id/friends/news',
    component: NewsComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
