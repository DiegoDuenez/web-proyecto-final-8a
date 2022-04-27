import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  UserService } from 'src/app/services/user/user.service';
import { AuthService} from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  nombreUsuario!: String;
  ipUsuario!: String;
  ipAddress!: String;

  perfilObject!: any;
  swalProgress: any;
  rolUsuario!: String;

  profileEditForm!: FormGroup;

  passwordInput: boolean = false;

  user!: User;

  dataRequest!: any;



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { this.createForm() }

  ngOnInit(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('password');
    this.perfil();
    
  }

  getIP()  
  {  
    this.authService.getIPAddress().subscribe((data:any)=>{  
      this.ipAddress = data.ip;  
    });  
  } 

  update(codigo: String = ''){

    if(this.profileEditForm.invalid){
      return Object.values(this.profileEditForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{
      this.setUser(codigo);
      this.userService.update(this.user, this.perfilObject.id).subscribe((data: any) => {

        console.log(data)
        Swal.fire({
          title: `Autorizado`,
          text: 'Se ha actualizado tu información',
          icon: 'success'
        })
  
      }, error =>{
        console.log(error)
          Swal.fire({
            title: `No Autorizado`,
            text: 'No se ha autorizado la acción',
            icon: 'warning'
          })
      });
    }

  }


  requestPermission(){

    this.dataRequest = {
      solicitud: "El usuario " + this.perfilObject.username_usuario  + " solicita poder editar los datos de su perfil" ,
      requesting_user: this.perfilObject.id,
      requested_item: this.perfilObject.id
    }

    this.userService.solicitarPermiso(this.dataRequest).subscribe((data: any) => {
      console.log(data)
      
    }, error =>{
      console.log(error)
    });
  }


  confirmBox(){

    if(this.perfilObject.rol_id == 1){

      this.requestPermission()

      Swal.fire({
        title: 'Usuario no autorizado',
        text: 'Ingresa el codigo de autorización que se envio a tu correo',
        input: 'text',
        allowOutsideClick: false,
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: false,
        confirmButtonText: 'Confirmar',
        showLoaderOnConfirm: true,
        preConfirm: (codigo) => {

          return this.update(codigo)
        

        }
        
      })

    }
    else{
      return this.update()

    }
    
  }

  perfil(){
    this.timerBox()
    this.authService.perfil().subscribe((data: any) => {
      this.perfilObject = data;
      this.ipUsuario = data.ip_public_usuario
      this.rolUsuario = this.perfilObject.rol_id
      this.swalProgress.close()

     /* this.authService.getIPAddress().subscribe((data:any)=>{  
        this.ipAddress = data.ip; 
        this.swalProgress.close()
        if(this.ipUsuario != this.ipAddress){
          Swal.fire({  
            title: 'Aviso!',  
            text: `Tu ip publica ha cambiado debes actualizarla de ${this.ipUsuario} a ${this.ipAddress}.`,  
            icon: 'info',  
            showCancelButton: false,  
            allowOutsideClick: false,
            confirmButtonText: 'Actualizar',  
          }).then((result) => {  
            if (result.value) {  
              this.cambiarIp()
            
            } 
          }) 
        }
      });  */
      
    }, error =>{
      console.log(error)
    });
  }

  cambiarIp(){
    this.swalProgress = Swal.fire({
      title: 'Cambiando ip',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    var data = {
      'ip_public_usuario': this.ipAddress
    }
    this.userService.cambiarIp(data, this.perfilObject.id).subscribe((data: any) => {
        console.log(data)
        Swal.fire({
          title: `Nueva ip !`,
          text: 'Se ha actualizado tu ip publica',
          icon: 'success'
        })
        this.swalProgress.close()
        this.perfil()
    }, error =>{
      console.log(error)
    })
  }

  createForm(): void {
    this.profileEditForm = this.fb.group({
      username: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      contraseña: ['', [Validators.nullValidator]],
      cambiarContraseña: ['', [Validators.nullValidator]],
    });
  }

  timerBox(){
    this.swalProgress = Swal.fire({
      title: 'Cargando perfil',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  get usernameValidate() {
    return (
      this.profileEditForm.get('username')?.invalid &&
      this.profileEditForm.get('username')?.touched
    );
  }

  get nombreValidate() {
    return (
      this.profileEditForm.get('nombre')?.invalid &&
      this.profileEditForm.get('nombre')?.touched
    );
  }

  get apellidosValidate() {
    return (
      this.profileEditForm.get('apellidos')?.invalid &&
      this.profileEditForm.get('apellidos')?.touched
    );
  }

  get numeroValidate() {
    return (
      this.profileEditForm.get('numero')?.invalid &&
      this.profileEditForm.get('numero')?.touched
    );
  }

  get emailValidate() {
    return (
      this.profileEditForm.get('email')?.invalid &&
      this.profileEditForm.get('email')?.touched
    );
  }

  get contraseniaValidate() {
    if(this.passwordInput === true){
      return (
        this.profileEditForm.get('contraseña')?.invalid &&
        this.profileEditForm.get('contraseña')?.touched
      );
    }
    return null;
    
  }

  setUser(codigo: String): void {

    if(this.perfilObject.rol_id == 1){

      if(this.passwordInput === true){
        this.user = {
          username_usuario: this.profileEditForm.get('username')?.value,
          nombre_usuario: this.profileEditForm.get('nombre')?.value,
          apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
          email_usuario: this.profileEditForm.get('email')?.value,
          numero_usuario: this.profileEditForm.get('numero')?.value,
          password_usuario: this.profileEditForm.get('contraseña')?.value,
          rol_id: this.rolUsuario,
          codigo_verificacion: codigo,
        };
      }
      else{
        this.user = {
          username_usuario: this.profileEditForm.get('username')?.value,
          nombre_usuario: this.profileEditForm.get('nombre')?.value,
          apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
          email_usuario: this.profileEditForm.get('email')?.value,
          numero_usuario: this.profileEditForm.get('numero')?.value,
          rol_id: this.rolUsuario,
          codigo_verificacion: codigo
        };
      }

    }
    else if(this.perfilObject.rol_id == 2 || this.perfilObject.rol_id == 3){

      if(this.passwordInput === true){
        this.user = {
          username_usuario: this.profileEditForm.get('username')?.value,
          nombre_usuario: this.profileEditForm.get('nombre')?.value,
          apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
          email_usuario: this.profileEditForm.get('email')?.value,
          numero_usuario: this.profileEditForm.get('numero')?.value,
          rol_id: this.rolUsuario,
          password_usuario: this.profileEditForm.get('contraseña')?.value
        };
      }
      else{
        this.user = {
          username_usuario: this.profileEditForm.get('username')?.value,
          nombre_usuario: this.profileEditForm.get('nombre')?.value,
          apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
          email_usuario: this.profileEditForm.get('email')?.value,
          rol_id: this.rolUsuario,
          numero_usuario: this.profileEditForm.get('numero')?.value
        };
      }

    }
    
  }
    

}
