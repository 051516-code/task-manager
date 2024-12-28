import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'routing-app';


   // Inyectamos Router en el constructor
   constructor(private router: Router) {}

   // Método para navegar a la lista de tareas
   goToTaskList(): void {
     this.router.navigate(['/']);
   }
 
   // Método para navegar a la página de creación de tareas
   goToCreateTask(): void {
     this.router.navigate(['create']);
   }
}
