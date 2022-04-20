import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CodigoCelularGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){ }

  canActivate(): boolean{
    if(this.authService.authIn3()){
      return true
    }else{
      this.router.navigate(['/login'])
      return false
    }
  }
  
}
