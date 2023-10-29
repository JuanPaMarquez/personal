import { Component } from '@angular/core';
import { BackendService } from 'src/app/servicios/backend.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  imagenPath1: string = 'assets/carrusel0.jpg';
  imagenPath2: string = 'assets/carrusel1.jpg';
  imagenPath3: string = 'assets/carrusel2.jpg';
  libros: any;

  constructor(public backendService: BackendService) {
    if(backendService.recargo){
      window.location.reload();
    }
  }

  ngOnInit(): void {
    this.backendService.obtenerLibros().subscribe(respuesta => {
      console.log(respuesta);
      this.libros = respuesta;
    });
  }

  //funcion Guardar  
  guardar(libroid: string, titulo: string) {
    console.log(libroid);
    if (this.backendService.usuarioAutenticado) {
      this.backendService.agregarLibro(libroid, this.backendService.usuarioIniciado.id, titulo, 'guardado').subscribe();
      window.confirm("El Libro Fue Guardado Con Exito");
    } else {
      window.confirm("Debe Iniciar Seccion para poder Guardar");
    }

  }

  //PintarCard
  libroId: any;
  libroTitulo: any;
  libroPortada: any;
  libroAutor: any;
  libroPublicacion: any;
  libroGenero: any;
  libroResumen: any;
  libroDescarga: any;
  pintarCard(libroId: string, LibroTitulo: string, libroPortada: string, libroAutor: string, libroPublicacion: string, libroGenero: string, libroResumen: string, libroDescarga: string) {
    this.libroId = libroId
    this.libroTitulo = LibroTitulo
    this.libroPortada = libroPortada
    this.libroAutor = libroAutor
    this.libroPublicacion = libroPublicacion
    this.libroGenero = libroGenero
    this.libroResumen = libroResumen
    this.libroDescarga = libroDescarga
  }

}
