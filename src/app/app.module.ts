import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {httpInterceptorProviders} from './api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {zh_CN} from 'ng-zorro-antd/i18n';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {HomeComponent} from './home/home.component';
import {ReposComponent} from './repos/repos.component';
import {ConfigComponent} from './repos/config/config.component';
import {JenkinsComponent} from './jenkins/jenkins.component';
import {JconfigComponent} from './jenkins/jconfig/jconfig.component';
import { JnodeComponent } from './jenkins/jnode/jnode.component';
import { JformComponent } from './jenkins/jform/jform.component';
import { JtypesComponent } from './jenkins/jtypes/jtypes.component';
import { WorkerComponent } from './worker/worker.component';
import { JgitComponent } from './jenkins/jgit/jgit.component';
import { JeditorComponent } from './jenkins/jeditor/jeditor.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ReposComponent,
    ConfigComponent,
    JenkinsComponent,
    JconfigComponent,
    JnodeComponent,
    JformComponent,
    JtypesComponent,
    WorkerComponent,
    JgitComponent,
    JeditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    httpInterceptorProviders,
    {provide: NZ_I18N, useValue: zh_CN},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
