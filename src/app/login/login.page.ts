import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder,
    public alertController: AlertController, private router: Router) { 
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }

  async ingresar() {
    const f = this.formularioLogin.value;

    // Verifica si el usuario ya existe en localStorage
    const usuariosJSON = localStorage.getItem('usuarios');
    const usuarios: { nombre: string, password: string }[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];

    const usuario = usuarios.find(u => u.nombre === f.nombre && u.password === f.password);

    if (usuario) {
      // Guarda el nombre de usuario en localStorage
      localStorage.setItem('nombreUsuario', usuario.nombre);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      // Navega a la página de inicio
      this.router.navigate(['/home']);
      console.log("Sesión iniciada");
    } else {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Los datos que ingresaste no son correctos',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }
}
