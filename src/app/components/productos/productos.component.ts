import { Component, OnInit} from '@angular/core';
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
            console.log(data)
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
      console.log(this.perfilObject)
      
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

}
