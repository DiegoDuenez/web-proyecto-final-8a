import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CodigoAuthGuard } from './guards/codigo-auth.guard';
import { CodigoCelularGuard } from './guards/codigo-celular.guard';


import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VerificarCuentaComponent } from './components/verificar-cuenta/verificar-cuenta.component';
import { FormCodigoAutenticacionComponent } from './components/form-codigo-autenticacion/form-codigo-autenticacion.component';
import { FormCodigoCelularComponent } from './components/form-codigo-celular/form-codigo-celular.component';


const routes: Routes = [
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path:'productos', component: ProductosComponent, canActivate: [AuthGuard]},
    {path:'usuarios', component: UsuariosComponent, canActivate: [AuthGuard]},
    {path:'verificar/cuenta', component: VerificarCuentaComponent},
    {path:'autenticacion/cuenta', component: FormCodigoAutenticacionComponent, canActivate: [CodigoAuthGuard]},
    {path:'tercera/autenticacion/cuenta', component: FormCodigoCelularComponent, canActivate: [CodigoCelularGuard]},
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'**', redirectTo:'login'}
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }