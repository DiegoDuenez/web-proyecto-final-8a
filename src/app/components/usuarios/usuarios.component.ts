import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProductoService } from 'src/app/services/producto/producto.service';

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

  data!: any;
  itemSelected!: any;
  dataRequest!: any;



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private productoService: ProductoService,
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

  delete(codigo: String = ''){

    this.setData(codigo);
    this.userService.delete(this.data, this.itemSelected.id).subscribe((data: any) => {

      Swal.fire({
        title: `Autorizado`,
        text: 'Se ha eliminado el producto',
        icon: 'success'
      })
      this.usuarios()

    }, error =>{
      console.log(error)
        Swal.fire({
          title: `No Autorizado`,
          text: 'No se ha autorizado la acción',
          icon: 'warning'
        })
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


  requestPermission(mensaje: String){

    if(this.itemSelected != null){
      this.dataRequest = {
        solicitud: "El usuario " + this.perfilObject.username_usuario  + " solicita poder "+ mensaje + " " +this.itemSelected.username_usuario ,
        requesting_user: this.perfilObject.id,
        requested_item: this.itemSelected.id
      }
    }
    else if(this.itemSelected == null){
      this.dataRequest = {
        solicitud: "El usuario " + this.perfilObject.username_usuario  + " solicita poder "+ mensaje ,
        requesting_user: this.perfilObject.id,
        requested_item: null
      }
    }
    

    this.productoService.solicitarPermiso(this.dataRequest).subscribe((data: any) => {
      
    }, error =>{
      console.log(error)
    });
  }

  onSelectItem(event: any){
    
    Swal.fire({  
      title: 'Aviso',  
      text: '¿Estas seguro de eliminar este producto?',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Ok',  
      cancelButtonText: 'Cancelar'
    }).then((result) => {  
      if (result.value) {  

        this.itemSelected = event

        if(this.perfilObject.rol_id == 1){
        
          this.requestPermission("eliminar al usuario")
    
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
              return this.delete(codigo)
            }
          })
    
        }
        else{
          return this.delete('')

        }
        
      } 
    })  
    
    
  }

  /* SET DATA CODIGO VERIFICACION */

  setData(codigo: String): void{
    this.data = {
      codigo_verificacion:  codigo
    }
  }

}
