import { Component } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { Task } from '../models/task.interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreateComponent {
  newTask : Task = {
    id: 0,
    title:'',
    description: '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  constructor(
    private taskService : TaskService,
    private router :  Router

  ){}


  //TODO> Create task 
  async createTask(): Promise<void> {
    // Validación de campos
    if (!this.newTask.title || !this.newTask.description) {
      Swal.fire('¡Error al Crear la Tarea!', 'No se pudo Crear la tarea.', 'error');
      return;
    }

      const result = await Swal.fire({
          title: '¿Estás seguro de Crear esta tarea?',
          text: '¡Se creara una nueva Tarea!',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, editar',
          cancelButtonText: 'Cancelar',
        });

        if(result.isConfirmed){
          try {

           this.taskService.addTask(this.newTask).subscribe(
              () => {
                 Swal.fire('Creada!', 'La tarea ha sido Creada con éxito.', 'success');
                // redigie a la lista 
                this.router.navigate(['/'])
              
              },
              (error) => {
               Swal.fire('¡Error al Crear la Tarea!', 'No se pudo Crear la tarea.', 'error');
              }
            );

          }catch ( error ) {
            Swal.fire('¡Error al Crear la Tarea!', 'No se pudo Crear la tarea.', 'error');
          }
        }
  
   
  }

  cancelCreate(): void {

    this.router.navigate(['/'])
  }
}
