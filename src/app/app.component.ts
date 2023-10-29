import {
  Component,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BackendService } from 'src/app/servicios/backend.service';
import { Route, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  formularioSeccion: FormGroup;
  title = 'Libro-Click';

  logo1: string = 'assets/facelogo.png';
  logo2: string = 'assets/inslogo.png';
  logo3: string = 'assets/logoX.png';

  correoV: any;
  contrasenaV: any;
  mostrarModal = false;

  constructor(
    public formulario: FormBuilder,
    public backendService: BackendService,
    private ruteador: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.formularioSeccion = this.formulario.group({
      correo: [''],
      contrasena: [''],
    });

    
    if (backendService.usuarioAutenticado) {
      this.estado = backendService.usuarioIniciado.nombre;
    }
  }

  modalSeccion(sec: boolean) {
    if (sec === true) {
      this.mostrarModal = true;
    } else {
      this.mostrarModal = false;
    }
  }

  resCorreo: any;
  resContrasena: any;
  inicioSeccion() {
    const correoControl = this.formularioSeccion.get('correo');
    const contraControl = this.formularioSeccion.get('contrasena');

    if (correoControl && contraControl) {
      this.correoV = correoControl.value;
      this.contrasenaV = contraControl.value;
    }

    forkJoin([
      this.backendService.obtenerUsuarioCon(this.contrasenaV),
      this.backendService.obtenerUsuario(this.correoV),
    ]).subscribe(([resContrasena, respuesta]) => {
      this.resContrasena = resContrasena;
      this.resCorreo = respuesta;
      if (this.resCorreo != null && this.resContrasena != null) {
        if (
          JSON.stringify(this.resCorreo) === JSON.stringify(this.resContrasena)
        ) {
          // Informacion a Mantener
          this.backendService.usuarioIniciado = this.resCorreo[0];
          this.backendService.usuarioAutenticado = true;
          this.backendService.sinUsuario = false;
          // ...
          const usuAut = this.backendService.usuarioAutenticado ? "true" : "false";
          const sinUsu = this.backendService.sinUsuario ? "true" : "false";

          localStorage.setItem('usuario', JSON.stringify(this.backendService.usuarioIniciado));
          localStorage.setItem('usuarioAutenticado', usuAut);
          localStorage.setItem('sinUsuario', sinUsu);

          this.estado = this.backendService.usuarioIniciado.nombre;

          window.alert('Inicio Seccion Correcto');
          this.modalSeccion(false);
          this.ruteador.navigate(['/usuario']);
        } else {
          window.alert('Correo o Contraseña Incorrectos');
        }
      } else {
        window.alert('Correo o Contraseña Incorrectos');
      }
    });
  }

  estado = '';
}
