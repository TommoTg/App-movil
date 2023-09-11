import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  formularioRecuperacion: FormGroup;
  usuarios?: { nombre: string, password: string }[]; 

  constructor(private fb: FormBuilder, private alertController: AlertController, private router: Router) {
    this.formularioRecuperacion = this.fb.group({
      nombre: ['', [Validators.required]],
    });
  }

  recuperarContrasena() {
    const nombre = this.formularioRecuperacion.value.nombre;
    
    let usuarioEncontrado;
    const usuario = this.obtenerUsuarioPorNombre(nombre);
    console.log('Usuario encontrado:', usuarioEncontrado);

    if (usuario) {
      
      this.mostrarContrasena(usuario.password);
    } else {
      
      this.mostrarMensajeError();
    }
  }

  async mostrarContrasena(contrasena: string) {
    const alert = await this.alertController.create({
      header: 'Contraseña del Usuario',
      message: `La contraseña del usuario es: ${contrasena}`,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async mostrarMensajeError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El nombre ingresado no corresponde a un usuario válido.',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  obtenerUsuarioPorNombre(nombre: string): any {
    const usuariosJSON = localStorage.getItem('usuarios');
    const usuarios: { nombre: string, password: string }[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];
  
    console.log('Usuarios almacenados en localStorage:', usuarios); 
  
    const usuarioEncontrado = usuarios.find(u => u.nombre === nombre);
  
    console.log('Usuario encontrado:', usuarioEncontrado);
  
    return usuarioEncontrado || null;
  }

  
}




