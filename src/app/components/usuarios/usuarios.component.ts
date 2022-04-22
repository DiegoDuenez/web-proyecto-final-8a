import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProductoService } from 'src/app/services/producto/producto.service';
import { Rol }  from '../../models/rol';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarioEditForm!: FormGroup;

  usuarioObject!: any;
  perfilObject!: any;
  rolesList!: Rol[];

  swalProgress: any;

  data!: any;
  itemSelected!: any;
  dataRequest!: any;

  codigo!: String;
  usuarioEdit!: User;
  usernameUsuario!: String;
  nombreUsuario!: String;
  apellidosUsuario!: String;
  emailUsuario!: String;
  numeroUsuario!: String;
  rolUsuario!: String;


  idRolSelect!:any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private productoService: ProductoService,
    private router: Router 
  ) { this.editForm() }

  ngOnInit(): void {
    this.usuarios()
    this.perfil()
    this.roles()
  }

  usuarios(){
    this.timerBox()
    this.userService.get().subscribe((data: any) => {

      this.usuarioObject = data.users;
      this.swalProgress.close()

      if(this.usuarioObject.length <= 0){
        Swal.fire({  
          title: 'Sin usuarios',  
          text: 'No hay ningun usuario registrado aún',  
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

  roles(){
    this.userService.getRoles().subscribe((data: any) => {
      this.rolesList = data.roles;
      console.log(data.roles)
      
    }, error =>{
      console.log(error)
    });
  }

  abrirModal(id: String){
    (<any>$(id)).modal('show');
  }

  cerrarModal(id: String){
    (<any>$(id)).modal('toggle');
  }


  verificarCodigo(codigo: String, editar: boolean){
    
    this.productoService.verificarCodigo(codigo).subscribe((data: any) => {
      console.log(data)
      this.codigo = codigo;

      if(editar == true){
        this.abrirModal('#usuarioEditModal')
      }
      else{
        this.abrirModal('#usuarioCreateModal')
      }

    }, error =>{
      console.log(error)
     // if(error.error.message == "este codigo no existe"){
        Swal.fire({
          title: `No Autorizado`,
          text: 'No se ha autorizado la acción',
          icon: 'warning'
        })
      //}

    })

  }



  // EDITAR USUARIO
  edit(codigo?: String){


    if(this.usuarioEditForm.invalid){
      return Object.values(this.usuarioEditForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{

      Swal.fire({  
        title: 'Aviso',  
        text: 'Estas seguro de editar el usuario',  
        icon: 'warning',  
        showCancelButton: true,  
        allowOutsideClick: false,
        confirmButtonText: 'Ok',  
        cancelButtonText: 'Cancelar'
      }).then((result) => {  
        if (result.value) {  
          this.setUsuarioEdit(this.codigo);
          console.log(this.usuarioEdit)
          this.userService.update(this.usuarioEdit, this.itemSelected.id).subscribe((data: any) => {
            this.usuarios();
            this.cerrarModal('#usuarioEditModal');
          }, error =>{
            console.log(error)
            if(error.error.message == "Este usuario ya fue registrado anteriormente"){
              this.confirmBox('Datos incorrectos', 'Este usuario ya fue registrado')
            }
  
          })
        } 
      })  
      
    }
  }

  editForm(): void {
    this.usuarioEditForm = this.fb.group({
      username: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required]],
      numero: ['', [Validators.required]]
    });
  }


  confirmBox(title: String, text: String){  
    Swal.fire({  
      title: `${title}`,  
      text: `${text}`,  
      icon: 'error',  
      showCancelButton: false,  
      allowOutsideClick: false,
      confirmButtonText: 'Ok',  
    })
  } 


  delete(codigo: String = ''){

    this.setData(codigo);
    this.userService.delete(this.data, this.itemSelected.id).subscribe((data: any) => {

      Swal.fire({
        title: `Autorizado`,
        text: 'Se ha eliminado al usuario',
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
    

    this.userService.solicitarPermiso(this.dataRequest).subscribe((data: any) => {
      
    }, error =>{
      console.log(error)
    });
  }

  onSelectItem(event: any){
    
    Swal.fire({  
      title: 'Aviso',  
      text: '¿Estas seguro de eliminar este usuario?',  
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

  onSelectItemEdit(event: any){

    this.itemSelected = event
    this.usernameUsuario = this.itemSelected.username_usuario
    this.nombreUsuario = this.itemSelected.nombre_usuario
    this.apellidosUsuario = this.itemSelected.apellidos_usuario
    this.emailUsuario = this.itemSelected.email_usuario
    this.numeroUsuario = this.itemSelected.numero_usuario
    this.rolUsuario = this.itemSelected.rol_id

    console.log(this.itemSelected)

    if(this.perfilObject.rol_id == 1){
    
      this.requestPermission("editar el usuario")

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

          this.verificarCodigo(codigo, true)
          
         // return this.delete(codigo)
        }
      })

    }
    else{
      this.abrirModal('#usuarioEditModal')
   
    }

}

  setUsuarioEdit(codigo?: String): void {
    this.usuarioEdit = {
      username_usuario: this.usuarioEditForm.get('username')?.value,
      nombre_usuario: this.usuarioEditForm.get('nombre')?.value,
      apellidos_usuario: this.usuarioEditForm.get('apellidos')?.value,
      email_usuario: this.usuarioEditForm.get('email')?.value,
      numero_usuario: this.usuarioEditForm.get('numero')?.value,
      rol_id: this.rolUsuario,
      codigo_verificacion: codigo,
    };
  }

  get usernameValidate() {
    return (
      this.usuarioEditForm.get('username')?.invalid &&
      this.usuarioEditForm.get('username')?.touched
    );
  }

  get nombreValidate() {
    return (
      this.usuarioEditForm.get('nombre')?.invalid &&
      this.usuarioEditForm.get('nombre')?.touched
    );
  }

  get apellidosValidate() {
    return (
      this.usuarioEditForm.get('apellidos')?.invalid &&
      this.usuarioEditForm.get('apellidos')?.touched
    );
  }

  get numeroValidate() {
    return (
      this.usuarioEditForm.get('numero')?.invalid &&
      this.usuarioEditForm.get('numero')?.touched
    );
  }

  get emailValidate() {
    return (
      this.usuarioEditForm.get('email')?.invalid &&
      this.usuarioEditForm.get('email')?.touched
    );
  }

  get rolValidate() {
    return (
      this.usuarioEditForm.get('rol')?.invalid &&
      this.usuarioEditForm.get('rol')?.touched
    );
  }

  /* SET DATA CODIGO VERIFICACION */

  setData(codigo: String): void{
    this.data = {
      codigo_verificacion:  codigo
    }
  }

  onSelectRol(event: any){

    this.idRolSelect = event.target.value
    this.rolUsuario = event.target.value
    console.log(event.target.value)
    this.userService.getRoles(event.target.value).subscribe((data: any) => {

      console.log(data)

    }, error =>{
      console.log(error)

    });

  }
}
