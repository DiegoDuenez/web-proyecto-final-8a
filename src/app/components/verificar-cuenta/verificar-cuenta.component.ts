import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

@Component({
  selector: 'app-verificar-cuenta',
  templateUrl: './verificar-cuenta.component.html',
  styleUrls: ['./verificar-cuenta.component.css']
})
export class VerificarCuentaComponent implements OnInit {

  verifyForm!: FormGroup;
  user!: User;
  codigoConfirmacion?: String;

  constructor( 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) 
    { this.createForm() }

  ngOnInit(): void {
  }

  verify(): void{

    if(this.verifyForm.invalid){
      return Object.values(this.verifyForm.controls).forEach(control =>{
        control.markAsTouched();
      });
    }
    else{
      this.setUser();
      this.authService.verify(this.codigoConfirmacion).subscribe((data: any) => {

        console.log(data.token)
        const token = data.token;
        localStorage.setItem('token', token);
        this.confirmBox();
        //this.router.navigate(['/login']);
       //this.confirmBox()
        
      }, error =>{
        console.log(error)
      });
    }

  }

  confirmBox(){  
    Swal.fire({  
      title: 'Gracias!',  
      text: 'Tu cuenta se ha verificado correctamente!',  
      icon: 'success',  
      showCancelButton: false,  
      allowOutsideClick: false,
      confirmButtonText: 'Ok',  
    }).then((result) => {  
      if (result.value) {  
        this.router.navigate(['/profile']);
        /*Swal.fire(  
          'Deleted!',  
          'Your imaginary file has been deleted.',  
          'success'  
        )  */
      } 
    })  
  }  

  createForm(): void {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required]],
    });
  }

  get codeValidate() {
    return (
      this.verifyForm.get('code')?.invalid &&
      this.verifyForm.get('code')?.touched
    );
  }

  setUser(): void {
    this.user = {
      email_code_usuario: this.verifyForm.get('code')?.value,
    };
    this.codigoConfirmacion = this.verifyForm.get('code')?.value
  }
}
