import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
//import Swal from 'sweetalert2/dist/sweetalert2.js'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit  {

  registerForm!: FormGroup;
  user!: User;

  messageAlert!: String;

  ipAddress!: String;
  num: String = '+52';

  swalProgress: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { this.createForm() }

  ngOnInit(): void {
    //this.getIP()
  }


  register(): void{

    this.timerBox()

    if(this.registerForm.invalid){
      return Object.values(this.registerForm.controls).forEach(control =>{
        control.markAsTouched();
        this.swalProgress.close()

      });
    }
    else{
      this.setUser();
      this.authService.register(this.user).subscribe((data: any) => {
        this.swalProgress.close()

        this.authService.alert.emit({
          alerta: {
            message:  "Confirma tu correo para poder iniciar sesión.",
            success: true
          }
        })
        //this.router.navigate(['/login']);
       this.confirmBox()
        
      }, error =>{
        console.log(error.error.errors)

        if(error.error.errors.hasOwnProperty('numero_usuario')){
          Swal.fire({  
            title: 'Datos incorrectos',  
            text: 'Este número de usuario ya ha sido registrado',  
            icon: 'error',  
            showCancelButton: false,  
            allowOutsideClick: false,
            confirmButtonText: 'Ok',  
          })  
        }
        if(error.error.errors.hasOwnProperty('email_usuario')){
          Swal.fire({  
            title: 'Datos incorrectos',  
            text: 'Este email ya ha sido registrado',  
            icon: 'error',  
            showCancelButton: false,  
            allowOutsideClick: false,
            confirmButtonText: 'Ok',  
          })  
        }
        if(error.error.errors.hasOwnProperty('username_usuario')){
          Swal.fire({  
            title: 'Datos incorrectos',  
            text: 'Este nombre de usuario ya ha sido registrado',  
            icon: 'error',  
            showCancelButton: false,  
            allowOutsideClick: false,
            confirmButtonText: 'Ok',  
          })  
        }
        if(error.error.errors.hasOwnProperty('ip_public_usuario')){
          Swal.fire({  
            title: 'Datos incorrectos',  
            text: 'Esta ip ya ha sido registrada',  
            icon: 'error',  
            showCancelButton: false,  
            allowOutsideClick: false,
            confirmButtonText: 'Ok',  
          })  
        }

      });
    }

  }

  timerBox(){
    this.swalProgress = Swal.fire({
      title: 'Registrando',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  confirmBox(){  
    Swal.fire({  
      title: 'Gracias, por registrarte!',  
      text: 'Confirma tu cuenta con el código de verificación que mandamos a tu correo.',  
      icon: 'success',  
      showCancelButton: false,  
      allowOutsideClick: false,
      confirmButtonText: 'Ok',  
    }).then((result) => {  
      if (result.value) {  
        this.router.navigate(['/login']);
       
      } 
    })  
  }  

  getIP()  
  {  
    this.authService.getIPAddress().subscribe((data:any)=>{  
      this.ipAddress = data.ip;  
    });  
  } 


  get usernameValidate() {
    return (
      this.registerForm.get('username')?.invalid &&
      this.registerForm.get('username')?.touched
    );
  }

  get nombreValidate() {
    return (
      this.registerForm.get('nombre')?.invalid &&
      this.registerForm.get('nombre')?.touched
    );
  }

  get apellidosValidate() {
    return (
      this.registerForm.get('apellidos')?.invalid &&
      this.registerForm.get('apellidos')?.touched
    );
  }

  get emailValidate() {
    return (
      this.registerForm.get('email')?.invalid &&
      this.registerForm.get('email')?.touched
    );
  }

  get phoneValidate() {
    return (
      this.registerForm.get('phone')?.invalid &&
      this.registerForm.get('phone')?.touched
    );
  }

  get passwordValidate() {
    return (
      this.registerForm.get('password')?.invalid &&
      this.registerForm.get('password')?.touched
    );
  }

  get ipValidate() {
    return (
      this.registerForm.get('ip')?.invalid &&
      this.registerForm.get('ip')?.touched
    );
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      ip: ['', [Validators.required]],
    });
  }

  setUser(): void {
    this.user = {
      username_usuario: this.registerForm.get('username')?.value,
      nombre_usuario: this.registerForm.get('nombre')?.value,
      apellidos_usuario: this.registerForm.get('apellidos')?.value,
      email_usuario: this.registerForm.get('email')?.value,
      numero_usuario: this.registerForm.get('phone')?.value,
      password_usuario: this.registerForm.get('password')?.value,
      ip_public_usuario: this.registerForm.get('ip')?.value
    };
  }

}
