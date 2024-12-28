import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks'; // Clave para almacenar en LocalStorage

  private defaultTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description of Task 2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor() {}

  /** Obtener todas las tareas */

  getTasks(): Observable<Task[]> {
    const tasks = this.getStoredTasks();
  
      return of(tasks); // Devuelve un Observable con las tareas
    
  }

  /** Crear una nueva tarea */
  addTask(task: Task): Observable<void> {
    const tasks = this.getStoredTasks();
    const maxId = this.getMaxTaskId(tasks) || 0; // Si no hay tareas, comienza en 0
  
    task.id = maxId + 1;
    task.createdAt = new Date();
    task.updatedAt = task.createdAt;
  
    tasks.push(task);
    this.saveTasks(tasks);
  
    return of(void 0); // Indica que la operación fue exitosa
  }
  

  /** Actualizar una tarea existente */
  updateTask(updatedTask: Task): Observable<void> {
    const tasks = this.getStoredTasks();
    const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
  
    if (taskIndex !== -1) {
      updatedTask.updatedAt = new Date();
      tasks[taskIndex] = updatedTask;
      this.saveTasks(tasks);
      return of(); // Retorna un Observable vacío indicando éxito
    } else {
      return throwError(() => new Error('Task not found')); // Retorna un error si no se encuentra la tarea
    }
  }
  
  /** Obtener una tarea por su ID */
  getTaskById(id: number): Task | null {
    const tasks = this.getStoredTasks();
    return tasks.find(task => task.id === id) || null;
  }

/** Eliminar una tarea */
  deleteTask(id: number): Observable<void> {
    // Obtener las tareas actuales desde LocalStorage
    let tasks = this.getStoredTasks();
    
    // Filtrar la tarea por ID (eliminarla)
    tasks = tasks.filter(task => task.id !== id);
    
    // Guardar las tareas actualizadas en LocalStorage
    this.saveTasks(tasks);
    
    return of(void 0); // Retorna un observable vacío con void indicando que la tarea fue eliminada
  }



  /** Función auxiliar: obtener tareas de LocalStorage */
  private getStoredTasks(): Task[] {
    const tasks = localStorage.getItem(this.STORAGE_KEY);
    try {
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error al obtener las tareas de LocalStorage:', error);
      return [];
    }
  }

  /** Función auxiliar: usar tareas predeterminadas */
  private useDefaultTasks(): Task[] {
    const storedTasks = this.getStoredTasks();
    if (storedTasks.length === 0) {
      this.saveTasks(this.defaultTasks);
      return this.defaultTasks;
    }
    return storedTasks;
  }

  /** Función auxiliar: guardar tareas en LocalStorage */
  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error al guardar las tareas en LocalStorage:', error);
    }
  }

  /** Función auxiliar: obtener el ID máximo de las tareas existentes */
  private getMaxTaskId(tasks: Task[]): number {
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  }
}
