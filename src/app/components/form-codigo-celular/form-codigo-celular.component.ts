import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import Echo from 'laravel-echo';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-form-codigo-celular',
  templateUrl: './form-codigo-celular.component.html',
  styleUrls: ['./form-codigo-celular.component.css']
})
export class FormCodigoCelularComponent implements OnInit {

  echo: Echo;
 
  verifyForm!: FormGroup;
  user!: User;
  codigoConfirmacionAnterior?: any;
  codigoConfirmacion?: any;
  username!: any;
  password!: any;
  rol!: any;
  id!: any;
  swalProgress: any;


  constructor( 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) 
    { 
     
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: environment.pusher_key,
        wsHost: environment.pusher_host,
        cluster: environment.pusher_cluster,
        wsPort: environment.pusher_port,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws'],
        //authEndpoint: '/custom/endpoint/auth'
      })
      this.createForm() 
    }

  ngOnInit(): void {

    /*this.echo.channel('channel-accesos')
    .listen('AccesoEvent', (resp: any) => {
      console.log(resp)
    })*/
    

    this.echo.channel('channel-auth')
    .listen('AuthEvent', (resp: any) => {
        console.log(resp)
      if(resp.message.status == 1){
        const token = resp.message.token;
        localStorage.setItem('token', token);
        Swal.fire({  
          title: 'Autenticación correcta!',  
          text: 'Se acepto la autenticación desde la app android.',  
          icon: 'success',  
          showCancelButton: false,  
          allowOutsideClick: false,
          confirmButtonText: 'Ok',  
        }).then((result) => {  
            this.router.navigate(['/profile']);
        }) 
      }
      else{
        Swal.fire({  
          title: 'Autenticación rechazada!',  
          text: 'Se rechazo la autenticación.',  
          icon: 'error',  
          showCancelButton: false,  
          allowOutsideClick: false,
          confirmButtonText: 'Ok',  
        }).then((result) => {  
            this.router.navigate(['/login']);
        }) 
      }
      
    })


    this.username = localStorage.getItem('usuario')
    this.password = localStorage.getItem('password')
    this.rol = localStorage.getItem('rol')
    this.id = localStorage.getItem('id')
    this.codigoConfirmacionAnterior = localStorage.getItem('codigo')
    
    this.authService.accesoUsuario(this.id).subscribe((data: any) => {
      console.log(data)
    })

  }

  esperandoAuth(){
    this.setUser()
    this.authService.esperandoAuth(this.user).subscribe((data: any) => {
      console.log(data)
      /*const token = data.token;
      localStorage.setItem('token', token);
      this.swalProgress.close()
      this.successBox();*/
    }, error =>{
      console.log(error)
      this.errorBox()
    });
  }

  verify(): void{
    this.timerBox()
    if(this.verifyForm.invalid){
      return Object.values(this.verifyForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{
      this.setUser();
     
        this.authService.loginRol3(this.user).subscribe((data: any) => {
          console.log(data)
          const token = data.token;
          localStorage.setItem('token', token);
          this.swalProgress.close()
          this.successBox();
        }, error =>{
          console.log(error)
          this.errorBox()
        });
     
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

  timerBox(){
    this.swalProgress = Swal.fire({
      title: 'Verificando',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
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
