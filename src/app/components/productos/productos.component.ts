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
  producto!: Producto;

  perfilObject!: any;
  dataRequest!: any;

  itemSelected!: any;

  data!: any;


  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) { this.createForm()}

  ngOnInit(): void {
    this.productos()
    this.perfil()
  }

  create(){

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
          this.setProducto();
          this.productoService.post(this.producto).subscribe((data: any) => {
            this.productos();
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

  requestPermission(){

    this.dataRequest = {
      solicitud: "El usuario " + this.perfilObject.username_usuario  + " solicita poder eliminar el producto " + this.itemSelected.nombre_producto ,
      requesting_user: this.perfilObject.id,
      requested_item: this.itemSelected.id
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

  productos(){
    this.productoService.get().subscribe((data: any) => {

      this.productoObject = data.productos;
     
      
    }, error =>{
      console.log(error)
    });
  }

  perfil(){
    this.authService.perfil().subscribe((data: any) => {
      this.perfilObject = data;
      
    }, error =>{
      console.log(error)
    });
  }

  createForm(): void {
    this.productoCreateForm = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    });
  }

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


  setProducto(): void {
      this.producto = {
        nombre_producto: this.productoCreateForm.get('nombre')?.value,
        precio_producto: this.productoCreateForm.get('precio')?.value,
        user_id: this.perfilObject.id
        
      };
  }

  setData(codigo: String): void{
    this.data = {
      codigo_verificacion:  codigo
    }
  }

}
