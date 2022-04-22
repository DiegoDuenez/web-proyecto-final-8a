import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from '../../models/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

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
      return this.httpClient.get(`${this.apiURL}mostrar/solicitudes/permisos/${id}`);
    }
    else{
      return this.httpClient.get(`${this.apiURL}mostrar/solicitudes/permisos`);
    }

  }

  rechazarSolicitud(data: any, id: String){
    return this.httpClient.post(`${this.apiURL}enviar/solictudes/rechazadas/${id}`, data);
  }

  aceptarSolicitud(data: any, id: String){
    return this.httpClient.post(`${this.apiURL}enviar/solictudes/aceptadas/${id}`, data);
  }

}
