import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.interface';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(
      (data) => {
        this.tasks = data.reverse();
      },
      (error) =>{
        console.log('error al obtener las task')
      }

    )
  }

 async deleteTask(id: number | null ) {

    if (id === null) {
      console.error('Task ID is null');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de esta acción?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar la tarea
        this.taskService.deleteTask(id).subscribe(
          () => {
            // Mostrar notificación de éxito
            Swal.fire('¡Eliminada!', 'La tarea ha sido eliminada con éxito.', 'success');
            // Actualizar la lista local de tareas
            this.tasks = this.tasks.filter((task) => task.id !== id);
          },
          (error) => {
            // Mostrar notificación de error
            Swal.fire('¡Error al Eliminar!', 'La tarea no se ha podido eliminar con éxito.', 'error');
          },
          () => {
            // Eliminación completada (callback final)
            console.log('Eliminación completada');
          }
        );
      }
    });
  }
  
  
  editTask(id: number): void {
    this.router.navigate([`/edit/${id}`]);
  }

  // Modal 
  showTaskDetails(task: Task): void {
    this.selectedTask = task;
  }

  closeModal(): void {
    this.selectedTask = null;
  }
}
