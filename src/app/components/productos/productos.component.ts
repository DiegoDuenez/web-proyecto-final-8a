import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService} from 'src/app/services/producto/producto.service';
import { AuthService} from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Producto } from '../../models/producto';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productoObject!: any;

  productoCreateForm!: FormGroup;
  productoEditForm!: FormGroup;

  producto!: Producto;
  productoEdit!: Producto;

  perfilObject!: any;
  dataRequest!: any;

  itemSelected!: any;
  itemSelectedEdit!: any;

  nombreProducto!: String;
  precioProducto!: String;

  data!: any;

  codigo!: String;
  swalProgress: any;


  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) { this.createForm();
  this.editForm()
}

  ngOnInit(): void {
    this.productos()
    this.perfil()
  }

  create(codigo?: String){

    if(this.productoCreateForm.invalid){
      return Object.values(this.productoCreateForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{
      Swal.fire({  
        title: 'Aviso',  
        text: 'Estas seguro de registrar el producto',  
        icon: 'warning',  
        showCancelButton: true,  
        allowOutsideClick: false,
        confirmButtonText: 'Ok',  
        cancelButtonText: 'Cancelar'
      }).then((result) => {  
        if (result.value) {  
          this.setProducto(this.codigo);
          this.productoService.post(this.producto).subscribe((data: any) => {
            this.productos();
            this.cerrarModal('#productoCreateModal')
          }, error =>{
            console.log(error)
            if(error.error.message == "El nombre del producto ya fue registrado anteriormente"){
              this.confirmBox()
            }

          })
        } 
      })  
    }
  }

  abrirModal(id: String){
    (<any>$(id)).modal('show');
  }

  cerrarModal(id: String){
    (<any>$(id)).modal('toggle');
  }

  // EDITAR PRODUCTO
  edit(codigo?: String){


    if(this.productoEditForm.invalid){
      return Object.values(this.productoEditForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{

      //(<any>$('#productoEditModal')).modal('show');
      Swal.fire({  
        title: 'Aviso',  
        text: 'Estas seguro de editar el producto',  
        icon: 'warning',  
        showCancelButton: true,  
        allowOutsideClick: false,
        confirmButtonText: 'Ok',  
        cancelButtonText: 'Cancelar'
      }).then((result) => {  
        if (result.value) {  
          this.setProductoEdit(this.codigo);
          console.log(this.productoEdit)
          this.productoService.put(this.productoEdit, this.itemSelected.id).subscribe((data: any) => {
            this.productos();
            this.cerrarModal('#productoEditModal');
          }, error =>{
            console.log(error)
            if(error.error.message == "El nombre del producto ya fue registrado anteriormente"){
              this.confirmBox()
            }
  
          })
        } 
      })  

      
    }
  }


  delete(codigo: String = ''){

    this.setData(codigo);
    this.productoService.delete(this.data, this.itemSelected.id).subscribe((data: any) => {

      Swal.fire({
        title: `Autorizado`,
        text: 'Se ha eliminado el producto',
        icon: 'success'
      })
      this.productos()

    }, error =>{
      console.log(error)
        Swal.fire({
          title: `No Autorizado`,
          text: 'No se ha autorizado la acción',
          icon: 'warning'
        })
    });
  }

  requestPermission(mensaje: String){

    if(this.itemSelected != null){
      this.dataRequest = {
        solicitud: "El usuario " + this.perfilObject.username_usuario  + " solicita poder "+ mensaje + " " +this.itemSelected.nombre_producto ,
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
        
          this.requestPermission("eliminar el producto")
    
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
      this.nombreProducto = this.itemSelected.nombre_producto
      this.precioProducto = this.itemSelected.precio_producto
      console.log(this.itemSelected)

      if(this.perfilObject.rol_id == 1){
      
        this.requestPermission("editar el producto")
  
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
        return this.delete('')
      }
  
  }


  onSelectItemCreate(){
    this.itemSelected = null
    console.log(this.itemSelected)
    if(this.perfilObject.rol_id == 1){
    
      this.requestPermission("crear un producto")

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

          this.verificarCodigo(codigo, false)
          
         // return this.delete(codigo)
        }
      })

    }
    else{
      return this.delete('')
    }

}


  verificarCodigo(codigo: String, editar: boolean){

    
    this.productoService.verificarCodigo(codigo).subscribe((data: any) => {
      console.log(data)
      this.codigo = codigo;

      if(editar == true){
        this.abrirModal('#productoEditModal')
      }
      else{
        this.abrirModal('#productoCreateModal')
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

  confirmBox(){  
    Swal.fire({  
      title: 'Datos incorrectos',  
      text: 'El nombre de este producto ya fue registrado',  
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

  timerBox(){
    this.swalProgress = Swal.fire({
      title: 'Cargando productos',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }


  /* GET PRODUCTOS */

  productos(){
    this.timerBox()
    this.productoService.get().subscribe((data: any) => {

      this.productoObject = data.productos;
      this.swalProgress.close()

      if(this.productoObject.length <= 0){
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

  /* GET AUTH PERFIL */

  perfil(){
    this.authService.perfil().subscribe((data: any) => {
      this.perfilObject = data;
      
    }, error =>{
      console.log(error)
    });
  }

  /* CREATE PRODUCTO FORM */

  createForm(): void {
    this.productoCreateForm = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    });
  }

  /* EDIT PRODUCTO FORM */

  editForm(): void {
    this.productoEditForm = this.fb.group({
      nombre_edit: ['', [Validators.required]],
      precio_edit: ['', [Validators.required]],
    });
  }

  /* VALIDATOR CREATE PRODUCTO */

  get precioValidate() {
    return (
      this.productoCreateForm.get('precio')?.invalid &&
      this.productoCreateForm.get('precio')?.touched
    );
  }

  get nombreValidate() {
    return (
      this.productoCreateForm.get('nombre')?.invalid &&
      this.productoCreateForm.get('nombre')?.touched
    );
  }

  /* VALIDATOR EDIT PRODUCTO */
  
  get precioEditValidate() {
    return (
      this.productoEditForm.get('precio_edit')?.invalid &&
      this.productoEditForm.get('precio_edit')?.touched
    );
  }

  get nombreEditValidate() {
    return (
      this.productoEditForm.get('nombre_edit')?.invalid &&
      this.productoEditForm.get('nombre_edit')?.touched
    );
  }


  /* SET PRODUCTO CREATE */

  setProducto(codigo?: String): void {
      this.producto = {
        nombre_producto: this.productoCreateForm.get('nombre')?.value,
        precio_producto: this.productoCreateForm.get('precio')?.value,
        user_id: this.perfilObject.id,
        codigo_verificacion: codigo,
        
      };
  }

  /* SET PRODUCTO EDIT */

  setProductoEdit(codigo?: String): void {
    this.productoEdit = {
      nombre_producto: this.productoEditForm.get('nombre_edit')?.value,
      precio_producto: this.productoEditForm.get('precio_edit')?.value,
      codigo_verificacion: codigo,
      
    };
  }

  /* SET DATA CODIGO VERIFICACION */

  setData(codigo: String): void{
    this.data = {
      codigo_verificacion:  codigo
    }
  }

}