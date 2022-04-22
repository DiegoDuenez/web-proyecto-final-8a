import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { SolicitudesService } from 'src/app/services/solicitudes/solicitudes.service';
import { Solicitud }  from '../../models/solicitud';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit {

  peticionRechazarForm!: FormGroup;
  peticionAceptarForm!: FormGroup;

  swalProgress: any;
  perfilObject!: any;
  solicitudObject!: any;

  peticionSeleccionada!: any;
  dataRechazar!: any;
  dataAceptar!: any;
  codigoGenerado!: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private solicitudService: SolicitudesService,
    private router: Router 
  ) { this.rechazarForm(); this.aceptarForm()}

  ngOnInit(): void {

    this.solicitudes()
    this.perfil()
  }

  solicitudes(){
    this.timerBox()
    this.solicitudService.get().subscribe((data: any) => {

      this.solicitudObject = data.solicitudes;
      this.swalProgress.close()
      console.log(this.solicitudObject)

      if(this.solicitudObject.length <= 0){
        Swal.fire({  
          title: 'Sin peticiones',  
          text: 'No hay ninguna petición',  
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
      title: 'Cargando peticiones',
      html: 'Por favor espere...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  onSelectItem(event: any, modal: String){
    this.peticionSeleccionada = event
    this.abrirModal(modal)
  }

  abrirModal(id: String){
    (<any>$(id)).modal('show');
  }

  cerrarModal(id: String){
    (<any>$(id)).modal('toggle');
  }

  rechazar(){
    if (this.peticionRechazarForm.invalid) {
      return Object.values(this.peticionRechazarForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      this.setData();
      this.solicitudService.rechazarSolicitud(this.dataRechazar, this.peticionSeleccionada).subscribe((data: any) => {
        Swal.fire({  
          title: `Solicitud Rechazada`,
          text: 'Se ha rechazado esta solicitud',
          icon: 'success',
          showCancelButton: false,  
          confirmButtonText: 'Ok',  
        }).then((result) => {
          this.cerrarModal('#peticionRechazarModal');
          this.solicitudes()
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

  aceptar(){
    if (this.peticionAceptarForm.invalid) {
      return Object.values(this.peticionAceptarForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      this.setDataAceptada();
      this.solicitudService.aceptarSolicitud(this.dataAceptar, this.peticionSeleccionada).subscribe((data: any) => {
        Swal.fire({  
          title: `Solicitud Aceptada`,
          text: 'Se ha aceptado esta solicitud y enviado el código al usuario',
          icon: 'success',
          showCancelButton: false,  
          confirmButtonText: 'Ok',  
        }).then((result) => {
          this.cerrarModal('#peticionAceptarModal');
          this.solicitudes()
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

  rechazarForm(): void {
    this.peticionRechazarForm = this.fb.group({
      mensaje: ['', [Validators.required]],
    });
  }

  aceptarForm(): void {
    this.peticionAceptarForm = this.fb.group({
      codigo: ['', [Validators.required]],
    });
  }

  get mensajeValidate() {
    return (
      this.peticionRechazarForm.get('mensaje')?.invalid &&
      this.peticionRechazarForm.get('mensaje')?.touched
    );
  }

  get codigoValidate() {
    return (
      this.peticionAceptarForm.get('codigo')?.invalid &&
      this.peticionAceptarForm.get('codigo')?.touched
    );
  }

  generarCodigo(min: number, max: number) { // min and max included 
    this.codigoGenerado = Math.floor(Math.random() * (max - min + 1) + min)
  }
  

  /* SET DATA MENSAJE DE RECHAZO*/

  setData(): void{
    this.dataRechazar = {
      mensaje: this.peticionRechazarForm.get('mensaje')?.value,
    }
  }

  /* SET DATA ACEPTADA*/

  setDataAceptada(): void{
    this.dataAceptar = {
      codigo: this.peticionAceptarForm.get('codigo')?.value,
    }
  }
}
