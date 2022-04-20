import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL = environment.apiURL;
  httpheaders: HttpHeaders = new HttpHeaders();

  @Output() alert: EventEmitter<any> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.httpheaders.append('Content-Type', 'aplication/json');
    this.httpheaders.append('Access-Control-Allow-Headers', 'Content-Type');
    this.httpheaders.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    this.httpheaders.append('Access-Control-Allow-Origin', '*');
    this.httpheaders.append(
      'Authorization',
      'Bearer' + localStorage.getItem('token'),
    );
  }

  login(user: User): Observable<any> {
    return this.httpClient.post(`${this.apiURL}login`, user);
  }

  loginRol2(user: User): Observable<any> {
    return this.httpClient.post(`${this.apiURL}login/rol/2`, user);
  }

  loginRol3(user: User): Observable<any> { // pendiente
    return this.httpClient.post(`${this.apiURL}login/rol/3`, user);
  }

  loggedIn(){
    return !! localStorage.getItem('token')
  }

  authIn(){
    return !! localStorage.getItem('usuario') && localStorage.getItem('password')
  }

  authIn3(){
    return !! localStorage.getItem('usuario') && localStorage.getItem('password') && localStorage.getItem('codigo') 
  }


  logout() {
   // this.router.navigate(['/login']);
    return this.httpClient.delete(`${this.apiURL}logout`)
  }

  register(user: User): Observable<any> {
    return this.httpClient.post(`${this.apiURL}register`, user);
  }

  verify(codigo: any){
    return this.httpClient.get(`${this.apiURL}register/verify/${codigo}`);
  }

  perfil(){
    return this.httpClient.get(`${this.apiURL}perfil`);
  }

  public getIPAddress()  
  {  
    return this.httpClient.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json");  
  } 



}
