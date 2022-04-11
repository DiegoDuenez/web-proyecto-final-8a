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

  

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { this.createForm() }

  ngOnInit(): void {

    this.perfil();
  }

  update(){

    if(this.profileEditForm.invalid){
      return Object.values(this.profileEditForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{
      this.setUser();
      this.userService.update(this.user, this.perfilObject.id).subscribe((data: any) => {

        console.log(data)
        //const token = data.token;
//        this.confirmBox();
        //this.router.navigate(['/login']);
       //this.confirmBox()
        
      }, error =>{
        console.log(error)
      });
    }

  }

  perfil(){
    this.authService.perfil().subscribe((data: any) => {

      this.perfilObject = data;
      //this.router.navigate(['/login']);
    // this.confirmBox()
      
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

  setUser(): void {
    if(this.passwordInput === true){
        this.user = {
          username_usuario: this.profileEditForm.get('username')?.value,
          nombre_usuario: this.profileEditForm.get('nombre')?.value,
          apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
          email_usuario: this.profileEditForm.get('email')?.value,
          numero_usuario: this.profileEditForm.get('numero')?.value,
          password_usuario: this.profileEditForm.get('contraseña')?.value,
        };
    }
    else{
      this.user = {
        username_usuario: this.profileEditForm.get('username')?.value,
        nombre_usuario: this.profileEditForm.get('nombre')?.value,
        apellidos_usuario: this.profileEditForm.get('apellidos')?.value,
        email_usuario: this.profileEditForm.get('email')?.value,
        numero_usuario: this.profileEditForm.get('numero')?.value,
      };
    }
  }
    

}
