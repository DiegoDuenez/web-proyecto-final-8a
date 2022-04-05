import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  user!: User;

  alertaMensaje?: string;
  alertaTipo: boolean = true;



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    //private usuarioService: UsuarioService,
    private router: Router
  ) { this.createForm() }

  ngOnInit(): void {
    this.authService.alert.subscribe(data => {
     this.alertaMensaje = data.alerta.message
     this.alertaTipo = data.alerta.success;
     this.changeDetector.detectChanges();
     console.log(this.alertaMensaje)
     console.log(this.alertaTipo)
 
    })
  }

  login(): void {

    //alert('ola');
    if (this.loginForm.invalid) {
      return Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      this.setUser();
      this.authService.login(this.user).subscribe(
        (data: any) => {
          
          const token = data.token;
          localStorage.setItem('token', token);
          console.log(token)
          //this.getPerfil()
          //this.rolService.setUserName(this.user.username);
          //this.perfilUsuario()
          
        },
        (error) => {
          console.log(error)
          
        },
      );
    }
  }

  get usernameValidate() {
    return (
      this.loginForm.get('username')?.invalid &&
      this.loginForm.get('username')?.touched
    );
  }

  get passwordValidate() {
    return (
      this.loginForm.get('password')?.invalid &&
      this.loginForm.get('password')?.touched
    );
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  setUser(): void {
    this.user = {
      username_usuario: this.loginForm.get('username')?.value,
      password_usuario: this.loginForm.get('password')?.value,
    };
  }



}
