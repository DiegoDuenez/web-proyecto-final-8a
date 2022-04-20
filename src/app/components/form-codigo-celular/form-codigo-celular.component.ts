import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

@Component({
  selector: 'app-form-codigo-celular',
  templateUrl: './form-codigo-celular.component.html',
  styleUrls: ['./form-codigo-celular.component.css']
})
export class FormCodigoCelularComponent implements OnInit {

  
  verifyForm!: FormGroup;
  user!: User;
  codigoConfirmacionAnterior?: any;
  codigoConfirmacion?: any;
  username!: any;
  password!: any;
  rol!: any;

  constructor( 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) 
    { this.createForm() }

  ngOnInit(): void {

    this.username = localStorage.getItem('usuario')
    this.password = localStorage.getItem('password')
    this.rol = localStorage.getItem('rol')
    this.codigoConfirmacionAnterior = localStorage.getItem('codigo')
    console.log(this.codigoConfirmacionAnterior)

  }

  verify(): void{

    if(this.verifyForm.invalid){
      return Object.values(this.verifyForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{
      this.setUser();
     
        this.authService.loginRol3(this.user).subscribe((data: any) => {
          /// FALTA TAMBIEN EN LARAVEL EL LOGIN 3
          /*if(this.rol == '2' ){
            const token = data.token;
            console.log(data)
            console.log(this.rol)
            localStorage.setItem('token', token);
            this.successBox();
          }
          else if(this.rol == '3'){
            console.log(data)
          }*/
          
        }, error =>{
          console.log(error)
          this.errorBox()
        });
      /*else if(this.rol == 3){
        this.authService.loginRol2(this.user).subscribe((data: any) => {

          const token = data.token;
          console.log(data)
          localStorage.setItem('token', token);
          this.successBox();
        
          
        }, error =>{
          console.log(error)
          this.errorBox()
        });
      }*/
     
    }

  }

  successBox(){  
    Swal.fire({  
      title: 'Gracias!',  
      text: 'Tu cuenta se ha autenticado correctamente!',  
      icon: 'success',  
      showCancelButton: false,  
      allowOutsideClick: false,
      confirmButtonText: 'Ok',  
    }).then((result) => {  
      if (result.value) {  
        this.router.navigate(['/profile']);
       
      } 
    })  
  }  

  errorBox(){  
    Swal.fire({  
      title: 'Hubo un problema',  
      text: 'El codigo ingresado no existe o ha expirado',  
      icon: 'error',  
      showCancelButton: false,  
      allowOutsideClick: false,
      confirmButtonText: 'Ok',  
    })  
  }  

  createForm(): void {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required]],
    });
  }

  get codeValidate() {
    return (
      this.verifyForm.get('code')?.invalid &&
      this.verifyForm.get('code')?.touched
    );
  }

  setUser(): void {
    this.codigoConfirmacion = this.verifyForm.get('code')?.value
    this.user = {
      username_usuario: this.username,
      password_usuario: this.password,
      codigo_autenticacion: this.codigoConfirmacion

      
    };
  }

}
