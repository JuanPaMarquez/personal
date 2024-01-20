import { Component } from '@angular/core';
import { Message } from 'src/app/servicios/message.model';
import { BackendService } from 'src/app/servicios/backend.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  chatVisible = false;
  inputText = '';
  messages: Message[] = [];
  botResponses: string[] = [];
  private currentPage = 0;
  librosMostrados = false;
  private categoria = "";

  constructor(private backendService: BackendService) { }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    if (!this.chatVisible) {
      this.resetChat();
    }
  }

  agregarSaltoDeLinea() {
    this.inputText += '\n';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.agregarSaltoDeLinea();
    }
  }

  private resetChat(): void {
    this.messages = [];
    this.botResponses = [];
    this.inputText = '';
    this.currentPage = 0;
    this.librosMostrados = false;
    this.categoria = '';
  }

  private processUserMessage(userMessage: string): void {
    const normalizedMessage = userMessage.toLowerCase();

    if (normalizedMessage === 'no') {
      this.botResponses.push('Gracias por usar este servicio. ¡Hasta luego!');
      setTimeout(() => {
        this.resetChat();
      }, 1000);  // Añadir un retardo antes de reiniciar el chat
      return;
    }

    switch (normalizedMessage) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        if (!this.librosMostrados) {
          this.categoria = this.getCategoriaFromOption(normalizedMessage);
          this.handleBooksRequest();
          this.librosMostrados = true;
        } else {
          this.botResponses.push(`¿Quieres ver más libros de ${this.categoria}? Responde 'si' o 'no'.`);
        }
        break;
      case 'si':
        if (this.librosMostrados) {
          this.showNextBooks();
        } else {
          this.botResponses.push('Lo siento, aún no has pedido ver los libros. Por favor, elige una categoría del 1 al 5.');
        }
        break;
      case 'no':
        this.botResponses.push('Gracias por usar este servicio. ¡Hasta luego!');
        this.resetChat();
        break;
      default:
        this.botResponses.push('Lo siento, no sé la respuesta a esa pregunta');
        break;
    }
  }

  private getCategoriaFromOption(option: string): string {
    const categorias = ["aventura", "ciencia", "educacion", "ficcion", "literatura"];
    const index = parseInt(option) - 1;
    return categorias[index];
  }

  private handleBooksRequest(): void {
    console.log('Llamando a obtenerLibros', this.categoria);
    this.backendService.obtenerLibros().subscribe(
      (response: any) => {
        const allLibros: any[] = response;
        const librosCategoria = allLibros.filter(libro => libro.genero.toLowerCase() === this.categoria);

        if (librosCategoria.length > 0) {
          this.displayBooks(librosCategoria);
        } else {
          this.botResponses.push(`No tenemos más libros de ${this.categoria} por el momento.`);
          this.resetChat();  // Volver al menú después de mostrar libros
        }
      },
      error => {
        console.error('Error al obtener libros:', error);
        this.botResponses.push('Lo siento, no se pudo obtener la información en este momento.');
        this.resetChat();  // Volver al menú después de mostrar libros
      }
    );
  }

  private displayBooks(libros: any[]): void {
    const booksPerPage = 3;
    const startIdx = this.currentPage * booksPerPage;
    const endIdx = startIdx + booksPerPage;

    if (startIdx < libros.length) {
      let response = (`Aquí tienes algunos libros de ${this.categoria}:\n`);
      for (let i = startIdx; i < endIdx && i < libros.length; i++) {
        response += `${i + 1}.) Título: ${libros[i].titulo}\n`;
      }
      if (endIdx < libros.length) {
        response += `¿Quieres ver más libros de ${this.categoria}? Responde 'si' o 'no'.`;
      } else {
        response += `No tenemos más libros de ${this.categoria} por el momento.`;
        this.resetChat();  // Volver al menú después de mostrar todos los libros
      }

      if (!this.botResponses.includes(response)) {
        this.botResponses.push(response);
      }
    } else {
      this.botResponses.push(`No tenemos más libros de ${this.categoria} por el momento.`);
      this.resetChat();  // Volver al menú si no hay libros
    }
  }

  private showNextBooks(): void {
    this.currentPage++;
    this.handleBooksRequest();
  }

  sendMessage() {
    const question = this.inputText.trim();
    if (question === '') {
      return;
    }
    this.inputText = '';

    this.processUserMessage(question);

    this.messages.push({ content: question, isUser: true });
  }

  getCombinedMessages(): any[] {
    const combinedMessages: any[] = [];
    const totalMessages = Math.max(this.messages.length, this.botResponses.length);

    for (let i = 0; i < totalMessages; i++) {
      if (i < this.messages.length) {
        combinedMessages.push({ content: this.messages[i].content, isUser: true });
      }
      if (i < this.botResponses.length) {
        combinedMessages.push({ content: this.botResponses[i], isUser: false });
      }
    }

    return combinedMessages;
  }
}

