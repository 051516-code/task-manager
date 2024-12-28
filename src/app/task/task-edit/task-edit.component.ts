import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'] // Corregido: styleUrls
})
export class TaskEditComponent implements OnInit {
  taskId: number | null = null;
  task: Task | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la tarea desde la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.taskId = Number(id); // Convertir explícitamente a number
        this.task = this.taskService.getTaskById(this.taskId); // Obtener la tarea por ID
        console.log('Task fetched:', this.task); // Verifica que se obtenga correctamente
        if (!this.task) {
          alert('Task not found!');
          this.router.navigate(['/']);
        }
      }
    });
  }

  async saveTask(): Promise<void> {
    if (!this.task || !this.task.title.trim() || !this.task.description.trim()) {
      this.showValidationError();
      return;
    }

    try {
      // Esperar a que se actualice la tarea
      await this.taskService.updateTask(this.task).toPromise();
      console.log('Task updated successfully.');
      // Redirigir al listado después de la actualización
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' );
    }
  }

  // Método de validación
  public showValidationError(): void {
    alert('Please fill in all required fields.');
  }

  cancelEdit(): void {
    this.router.navigate(['/']); // Redirigir al listado de tareas sin guardar
  }
}
