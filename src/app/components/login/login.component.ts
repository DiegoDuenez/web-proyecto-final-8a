import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  user!: User;
  
  isLogged: boolean = false;

  alertaMensaje?: string;
  alertaTipo: boolean = true;

  swalProgress: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private ngZone: NgZone,
    //private usuarioService: UsuarioService,
    private router: Router
  ) { this.createForm() }

  ngOnInit(): void {
    /*this.authService.alert.subscribe(data => {
        this.ngZone.run( () => {
        this.alertaMensaje = data.alerta.message
        this.alertaTipo = data.alerta.success;
        console.log(this.alertaMensaje)
        console.log(this.alertaTipo)
        });
     })*/
  }

  confirmBox(){  
    Swal.fire({  
      title: 'Datos incorrectos',  
      text: 'Los datos ingresados no son correctos',  
      icon: 'error',  
      showCancelButton: false,  
      allowOutsideClick: false,
      confirmButtonText: 'Ok',  
    })/*.then((result) => {  
      if (result.value) {  
        this.router.navigate(['/profile']);
       
      } 
    })  */
  }  

  login(): void {
    this.timerBox()
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
          this.swalProgress.close()
          console.log(data)
          if(data.user.rol_id == 1){
            this.isLogged = true;
            this.router.navigate(['/profile']);
          }
          else if(data.user.rol_id == 2 || data.user.rol_id == 3){
           
            localStorage.setItem('usuario', this.loginForm.get('username')?.value)
            localStorage.setItem('password', this.loginForm.get('password')?.value)
            localStorage.setItem('rol', data.user.rol_id)
            localStorage.setItem('id', data.user.id)


            this.router.navigate(['/autenticacion/cuenta']);
          }
          //this.getPerfil()
          //this.rolService.setUserName(this.user.username);
          //this.perfilUsuario()
          
        },
        (error) => {
          //console.log(error.error.message)
          this.swalProgress.close()

          console.log(error)
          if(error.error.message == "La cuenta no se ha activado, verifique su correo."){
              this.router.navigate(['verificar/cuenta']);

          }
          else if(error.error.message == "Los datos ingresados son incorrectos"){
            this.confirmBox()
          }
          else if(error.error.message == "La cuenta se ha deshabilitado."){
            Swal.fire({  
              title: 'Cuenta deshabilitada',  
              text: 'Esta cuenta se ha deshabilitado',  
              icon: 'warning',  
              showCancelButton: false,  
              confirmButtonText: 'Ok',  
            })
          }

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

  timerBox(){
    this.swalProgress = Swal.fire({
      title: 'Iniciando sesión',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  setUser(): void {
    this.user = {
      username_usuario: this.loginForm.get('username')?.value,
      password_usuario: this.loginForm.get('password')?.value,
    };
  }

  /*
  displayAlert(){
    return `
    <div class="alert alert-primary" role="alert" >
      ${this.alertaMensaje}
    </div>
    `
  }
*/

}
