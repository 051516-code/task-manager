import { Component } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { Task } from '../models/task.interface';
import { FormsModule } from '@angular/forms';

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
  createTask(): void {
    // Validación de campos
    if (!this.newTask.title || !this.newTask.description) {
      console.log('Both title and description are required.');
      return;
    }
  
    this.taskService.addTask(this.newTask).subscribe(
      () => {
        console.log('Task created successfully');
        // redigie a la lista 
        this.router.navigate(['/'])
      
      },
      (error) => {
        console.error('Failed to create task', error);
      }
    );
  }

  cancelCreate(): void {

    this.router.navigate(['/'])
  }
}
