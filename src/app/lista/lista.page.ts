import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit{
  qrData: any;
  usuarios: any[] = [];
  horaActual: string = '';

  constructor() {
    // Accede a los datos del estado de navegación
    const navigation = window.history.state;
    if (navigation && navigation.qrData) {
      this.qrData = navigation.qrData;
    }

    this.horaActual = new Date().toLocaleTimeString();
  }
  ngOnInit() {
    // Recuperar el mensaje de localStorage
    const mensajeLocalStorage = localStorage.getItem('mensaje');

    // Obtén los datos almacenados en localStorage al inicializar el componente
    const usuariosLocalStorage = localStorage.getItem('usuarios');
    if (usuariosLocalStorage) {
      this.usuarios = JSON.parse(usuariosLocalStorage);
    }




  }
  
}
