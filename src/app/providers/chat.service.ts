import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = []
  items: Observable<any>;
  public usuario: any = {}

  constructor( public firestore: AngularFirestore,
                public auth: AngularFireAuth,
                private router: Router ) {

      this.auth.authState.subscribe( user => {
        console.log(user)

        if( !user ) {

          return
        }

        this.usuario.nombre = user.displayName
        this.usuario.uid = user.uid
        console.log(this.usuario.nombre)
      })
  }

  login( proveedor: string) {
    this.usuario = {}
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.auth.signOut();

  }

  cargarMensajes(){

    return this.items = this.firestore.collection<Mensaje>('chats', ref => ref.orderBy('fecha','asc')).valueChanges()
                          .pipe( map( (mensajes: Mensaje[]) => this.chats = mensajes ) )
  }

  agregarMensajes( texto: string ) {

    var now = moment()

    let mensaje: Mensaje = {

        nombre: this.usuario.nombre,
        mensaje: texto,
        fecha: now.format('HH:mm'),
        uid: this.usuario.uid

    }

    return this.firestore.collection('chats').add( mensaje )

  }



}
