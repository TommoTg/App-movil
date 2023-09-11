import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRegistro: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, private router: Router) {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'apellido': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'carrera': new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0]*$/)]),
      'rut': new FormControl("",[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d{7,8}-[0-9kK]$/)]),
      'password': new FormControl("", [Validators.required, Validators.pattern(/^\d{4}$/), Validators.minLength(4), Validators.maxLength(4)]),
      'confirmacionPassword': new FormControl("", [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
  }

  async guardar() {
    const f = this.formularioRegistro.value;

    const usuariosJSON = localStorage.getItem('usuarios');
    const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

    if (this.rutExiste(usuarios, f.rut)) {
      const alert = await this.alertController.create({
        header: 'RUT existente',
        message: 'El RUT ya está registrado. Por favor, ingresa otro RUT.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (this.usuarioExiste(usuarios, f.nombre)) {
      const alert = await this.alertController.create({
        header: 'Usuario existente',
        message: 'El usuario ya existe. Por favor, elige otro nombre de usuario.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (!f.nombre) {
      const alert = await this.alertController.create({
        header: 'Usuario requerido',
        message: 'Debes ingresar un nombre de usuario.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (f.nombre.length < 3 || f.nombre.length > 8) {
      const alert = await this.alertController.create({
        header: 'Usuario incorrecto',
        message: 'El usuario debe tener entre 3 y 8 caracteres.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (f.password.length !== 4) {
      const alert = await this.alertController.create({
        header: 'Contraseña incorrecta',
        message: 'La contraseña debe tener exactamente 4 caracteres.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (!f.confirmacionPassword) {
      const alert = await this.alertController.create({
        header: 'Confirmación de contraseña requerida',
        message: 'Debes confirmar tu contraseña.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    if (f.password !== f.confirmacionPassword) {
      const alert = await this.alertController.create({
        header: 'Contraseñas no coinciden',
        message: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }
    
    var usuario = {
      nombre: f.nombre,
      apellido: f.apellido,
      carrera: f.carrera,
      rut: f.rut,
      password: f.password,
      confirmacionPassword: f.confirmacionPassword
    }

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    console.log('Usuario registrado exitosamente.');
    const successAlert = await this.alertController.create({
      header: 'Usuario Registrado',
      message: 'Usuario registrado exitosamente.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await successAlert.present();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmacionPasswordControl = formGroup.get('confirmacionPassword');

    if (passwordControl && confirmacionPasswordControl) {
      const password = passwordControl.value;
      const confirmacionPassword = confirmacionPasswordControl.value;

      if (password !== confirmacionPassword) {
        confirmacionPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmacionPasswordControl.setErrors(null);
      }
    }
  }

  usuarioExiste(usuarios: any[], nombre: string): boolean {
    return usuarios.some(usuario => usuario.nombre === nombre);
  }

  rutExiste(usuarios: any[], rut: string): boolean {
    return usuarios.some(usuario => usuario.rut === rut);
  }
}