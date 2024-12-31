import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  taskId: number | null = null;
  task: Task | null = null;
  previousStatus: string | undefined = 'pending';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la tarea desde la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.taskId = Number(id); // Convertir explícitamente a number
        this.task = this.taskService.getTaskById(this.taskId); // Obtener la tarea por ID
        this.previousStatus = this.task?.status; // Asignamos el status actual de la tarea

        if (!this.task) {
          alert('¡Tarea no encontrada!');
          this.router.navigate(['/']);
        }
      }
    });
  }

  async saveTask(): Promise<void> {
    // Validación básica
    if (!this.task || !this.task.title?.trim() || !this.task.description?.trim()) {
      this.showValidationError();
      return;
    }
    

    const result = await Swal.fire({
      title: '¿Estás seguro de editar esta tarea?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar',
    });

    console.log('Estado antes de la alteración:', this.previousStatus);

    if (result && result.isConfirmed) {
      try {
        // Actualizar la tarea
        this.taskService.updateTask(this.task);

        // Mostrar mensaje de éxito
        Swal.fire('¡Editada!', 'La tarea ha sido actualizada con éxito.', 'success');

        // Obtener el estado actualizado de la tarea
        const updatedTask = this.taskService.getTaskById(this.task.id);

        console.log('Estado después de la alteración:', updatedTask?.status);

        // Verificamos si el estado cambió a 'In Progress' o 'Completed' después de la actualización
        if (
          (updatedTask?.status === 'in-progress' || updatedTask?.status === 'completed') &&
          this.previousStatus !== updatedTask?.status
        ) {
          Swal.fire(
            '¡Felicidades!',
            `¡Buen trabajo! La tarea está ahora en estado "${updatedTask?.status}".`,
            'success'
          );
        }

        // Redirigir o actualizar la vista
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error al editar la tarea:', error);
        Swal.fire('¡Error al Editar!', 'No se pudo actualizar la tarea.', 'error');
      }
    }
  }

  // Método de validación
  public showValidationError(): void {
    alert('Por favor, complete todos los campos requeridos.');
  }

  cancelEdit(): void {
    this.router.navigate(['/']); // Redirigir al listado de tareas sin guardar
  }
}
