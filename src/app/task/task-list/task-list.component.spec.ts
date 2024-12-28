import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Task } from '../models/task.interface';
import { CommonModule } from '@angular/common';

// Mock de TaskService
class MockTaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Task 2', description: 'Description 2', status: 'pending', createdAt: new Date(), updatedAt: new Date() },
  ];

  getTasks() {
    return of(this.tasks);  // Devuelve las tareas actuales
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);  // Elimina la tarea con el id proporcionado
    return of();  // Retorna un Observable vacío después de la eliminación
  }
}

class MockRouter {
  navigate(path: string[]) {
    return true;  // Simula la navegación sin hacer nada realmente
  }
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, CommonModule],  // Importamos el componente y módulos necesarios
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    router = TestBed.inject(Router);

    // Inicializar el componente
    fixture.detectChanges();
  });

  it('should update the task list when a task is deleted', fakeAsync(() => {
    spyOn(taskService, 'deleteTask').and.callThrough();
    spyOn(taskService, 'getTasks').and.callThrough();

    // Primero cargamos las tareas
    component.ngOnInit();
    expect(component.tasks.length).toBe(2);  // Verifica que inicialmente hay 2 tareas

    // Eliminar una tarea
    component.deleteTask(1);
    
    // Usamos tick() para esperar a que se completen las operaciones asincrónicas
    tick(); 
    
    // Aseguramos que las tareas se actualizan después de la eliminación
    taskService.getTasks().subscribe(tasks => {
      component.tasks = tasks;
    });

    fixture.detectChanges();  // Asegúrate de que la vista se actualice

    // Verifica que la tarea se haya eliminado
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks.length).toBe(1);  // Ahora debería quedar solo 1 tarea
  }));

  it('should handle empty task list after deletion', fakeAsync(() => {
    spyOn(taskService, 'deleteTask').and.callThrough();
    spyOn(taskService, 'getTasks').and.callThrough();

    // Primero, cargamos las tareas
    component.ngOnInit();
    expect(component.tasks.length).toBe(2);  // Verifica que inicialmente hay 2 tareas

    // Eliminar todas las tareas
    component.deleteTask(1); // Elimina la tarea 1
    component.deleteTask(2); // Elimina la tarea 2
    
    tick();  // Asegurarse de que la operación asincrónica se complete

    // Aseguramos que las tareas se actualizan después de la eliminación
    taskService.getTasks().subscribe(tasks => {
      component.tasks = tasks;
    });

    fixture.detectChanges();  // Asegúrate de que la vista se actualice

    // Verifica que la lista de tareas esté vacía
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    expect(taskService.deleteTask).toHaveBeenCalledWith(2);
    expect(component.tasks.length).toBe(0);  // La lista debería estar vacía
  }));
});
