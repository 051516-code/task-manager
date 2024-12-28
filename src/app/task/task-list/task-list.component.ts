import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.interface';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';

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
        this.tasks = data;
      },
      (error) =>{
        console.log('error al obtener las task')
      },
      () => {
        // console.log('completado')
      }

    )
  }

  deleteTask(id: number): void {
    // Llamar al servicio para eliminar la tarea
    this.taskService.deleteTask(id).subscribe(
      () => {
        console.log('Tarea eliminada con éxito');
        // Aquí podrías actualizar el estado local de las tareas si es necesario
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      (error) => {
        console.error('Error al eliminar la tarea', error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
      },
      () => {
        // console.log('Eliminación completada')
      }
    );
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
