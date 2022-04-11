import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';

import { AuthInterceptorService } from './services/auth-interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { VerificarCuentaComponent } from './components/verificar-cuenta/verificar-cuenta.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarLoggedComponent } from './components/navbar-logged/navbar-logged.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ProfileComponent,
    VerificarCuentaComponent,
    SidebarComponent,
    NavbarLoggedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
  },
  AuthGuard
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
