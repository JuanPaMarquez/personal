import { Component } from '@angular/core';
import { BackendService } from 'src/app/servicios/backend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { usuario } from 'src/app/servicios/usuario';
import { Route, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent {
  formularioUsuario: FormGroup;
  usuario: any;
  correoV: any;

  constructor(
    private backendService: BackendService,
    public formulario: FormBuilder,
    private ruteador: Router
  ) {
    this.formularioUsuario = this.formulario.group({
      nombre: [''],
      apellido: [''],
      correo: [''],
      contrasena: [''],
    });

    this.usuario = backendService.usuarioIniciado;

    if (this.usuario) {
      this.formularioUsuario.setValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        correo: this.usuario.correo,
        contrasena: this.usuario.contrasena,
      });
    }
  }
  historial: any;

  ngOnInit(): void {
    this.backendService
      .obtenerHistorial(this.backendService.usuarioIniciado.id)
      .subscribe((respuesta) => {
        console.log(respuesta);
        this.historial = respuesta;
      });
  }

  resCorreo: any;

  enviarDatos(): any {
    console.log('Me presionaste');
    console.log(this.formularioUsuario.value);
    const correoControl = this.formularioUsuario.get('correo');
    if (correoControl) {
      this.correoV = correoControl.value;
    }
    console.log(this.correoV);

    forkJoin([
      this.backendService.editarUsuario(
        this.usuario.id,
        this.formularioUsuario.value
      ),
      this.backendService.obtenerUsuario(this.correoV),
    ]).subscribe(([edicionRespuesta, respuesta]) => {
      this.resCorreo = respuesta;
      this.backendService.usuarioIniciado = this.resCorreo[0];
      localStorage.setItem(
        'usuario',
        JSON.stringify(this.backendService.usuarioIniciado)
      );
      window.location.reload();
    });
  }

  borrarHistorial(idhistorial: any, titulo: any) {
    console.log(idhistorial);
    if (
      window.confirm(
        '¿Seguro que quieres borrar "' + titulo + '" de tu historial?'
      )
    ) {
      this.backendService.borrarHistorial(idhistorial).subscribe(
        (response) => {
          // Manejar la respuesta exitosa aquí
          console.log('Elemento borrado con éxito', response);
          window.location.reload();
          // Puedes actualizar tu interfaz de usuario o realizar otras acciones necesarias
        },
        (error) => {
          // Manejar errores aquí
          console.error('Error al borrar elemento del historial', error);
          // Puedes mostrar un mensaje de error o realizar otras acciones en caso de error
        }
      );
    }
  }

  cerrarSesion() {
    if (window.confirm('¿Quieres Cerrar Sesion?')) {
      localStorage.setItem('usuarioAutenticado', 'false');
      localStorage.setItem('sinUsuario', 'true');
      this.backendService.recargo = true;
      this.ruteador.navigate(['/inicio']);
    }
  }

  libro: any;

  libroId: any;
  libroTitulo: any;
  libroPortada: any;
  libroAutor: any;
  libroPublicacion: any;
  libroGenero: any;
  libroResumen: any;
  libroDescarga: any;
  pintarCard(libroId: string) {
    this.libroId = libroId;
    this.backendService.obtenerLibro(this.libroId).subscribe((respuesta) => {
      this.libro = respuesta[0];
      this.libroTitulo = this.libro.titulo;
      this.libroPortada = this.libro.portada;
      this.libroAutor = this.libro.autor;
      this.libroPublicacion = this.libro.publicacion;
      this.libroGenero = this.libro.genero;
      this.libroResumen = this.libro.resumen;
      this.libroDescarga = this.libro.descarga;
    });
  }
}
