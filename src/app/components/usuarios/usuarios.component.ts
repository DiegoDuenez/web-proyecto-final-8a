import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarioObject!: any;
  perfilObject!: any;


  swalProgress: any;



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.usuarios()
    this.perfil()
  }

  usuarios(){
    this.timerBox()
    this.userService.get().subscribe((data: any) => {

      this.usuarioObject = data.users;
      this.swalProgress.close()

      if(this.usuarioObject.length <= 0){
        Swal.fire({  
          title: 'Sin productos',  
          text: 'No hay ningun producto registrado aún',  
          icon: 'info',  
          showCancelButton: false,  
          confirmButtonText: 'Ok',  
        })
      }

    }, error =>{
      console.log(error)
    });
  }

  perfil(){
    this.authService.perfil().subscribe((data: any) => {
      this.perfilObject = data;
      console.log(this.perfilObject)
      
    }, error =>{
      console.log(error)
    });
  }

  timerBox(){
    this.swalProgress = Swal.fire({
      title: 'Cargando usuarios',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

}
