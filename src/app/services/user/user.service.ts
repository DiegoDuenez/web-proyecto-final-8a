import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL = environment.apiURL;
  httpheaders: HttpHeaders = new HttpHeaders();

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

  get(id?: String){

    if(id){
      return this.httpClient.get(`${this.apiURL}mostrar/usuarios/${id}`);
    }
    else{
      return this.httpClient.get(`${this.apiURL}mostrar/usuarios`);
    }

  }

  getRoles(id?: String){
    if(id){
      return this.httpClient.get(`${this.apiURL}mostrar/roles/${id}`);
    }
    else{
      return this.httpClient.get(`${this.apiURL}mostrar/roles`);
    }
  }

  update(user: User, id: String){
    return this.httpClient.put(`${this.apiURL}editar/usuarios/${id}`, user);
  }

  delete(data: any, id: String){
    return this.httpClient.post(`${this.apiURL}eliminar/usuarios/${id}`, data);
  }

  solicitarPermiso(data: any){
      return this.httpClient.post(`${this.apiURL}solicitar/permiso`, data);
  }

  cambiarIp(data: any, id: String){
    return this.httpClient.put(`${this.apiURL}editar/ip/usuarios/${id}`, data);

  }
}
