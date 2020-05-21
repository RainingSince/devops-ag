import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ReposComponent} from './repos/repos.component';
import {JenkinsComponent} from './jenkins/jenkins.component';
import {WorkerComponent} from './worker/worker.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: HomeComponent,
    children: [
      {path: '', component: WorkerComponent},
      {path: 'repos', component: ReposComponent},
      {path: 'pipeline', component: JenkinsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
