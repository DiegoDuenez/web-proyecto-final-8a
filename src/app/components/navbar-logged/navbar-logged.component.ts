import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar-logged',
  templateUrl: './navbar-logged.component.html',
  styleUrls: ['./navbar-logged.component.css']
})
export class NavbarLoggedComponent implements OnInit {

  authUser: any = null;

  
  constructor(
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit(): void {
    this.perfil()
  }

  perfil(){
    this.authService.perfil().subscribe((data: any) => {

      this.authUser = data
      
    });
  }

  logout(){
    this.authService.logout().subscribe((data: any) => {

      //console.log(data)
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    // this.confirmBox()
      
    }, error =>{
      console.log(error)
    });
  }

}
