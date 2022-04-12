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

  perfilObject!: any;

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

    this.perfil();
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
          
          /*return fetch(`//api.github.com/users/${login}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json()
            })
            .catch(error => {
                Swal.showValidationMessage(
                  `Ingresa un codigo valido`
                )
            })*/

        }
        //allowOutsideClick: () => !Swal.isLoading()
      })


    }
    
  }

  perfil(){
    this.authService.perfil().subscribe((data: any) => {
      this.perfilObject = data;
      console.log(this.perfilObject)
      
    }, error =>{
      console.log(error)
    });
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
    if(this.passwordInput === true){
        this.user = {
          username_usuario: this.profileEditForm.get('username')?.value,
          nombre_usuario: this.profileEditForm.get('nombre')?.value,
          apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
          email_usuario: this.profileEditForm.get('email')?.value,
          numero_usuario: this.profileEditForm.get('numero')?.value,
          password_usuario: this.profileEditForm.get('contraseña')?.value,
          codigo_verificacion: codigo
        };
    }
    else{
      this.user = {
        username_usuario: this.profileEditForm.get('username')?.value,
        nombre_usuario: this.profileEditForm.get('nombre')?.value,
        apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
        email_usuario: this.profileEditForm.get('email')?.value,
        numero_usuario: this.profileEditForm.get('numero')?.value,
        codigo_verificacion: codigo

      };
    }
  }
    

}
