import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  authUser: any = null;

  constructor(private authService: AuthService,) { }

  ngOnInit(): void {
    this.perfil()
  }

  perfil(){
    this.authService.perfil().subscribe((data: any) => {

      this.authUser = data
      
    }, error =>{
      console.log(error)
    });
  }

  logout(){
    this.authService.logout().subscribe((data: any) => {

      //console.log(data)
      localStorage.removeItem('token');

      //this.router.navigate(['/login']);
    // this.confirmBox()
      
    }, error =>{
      console.log(error)
    });
  }

}
