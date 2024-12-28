import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreateComponent } from './task-create.component';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

// Servicio simulado
class MockTaskService {
  addTask(task: any) {
    return of({}); // Simula éxito en la llamada al servicio
  }
}

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let taskService: TaskService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskCreateComponent, FormsModule], // Configuración para el componente standalone
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }, // Espía para Router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call addTask if title or description is missing', () => {
    spyOn(taskService, 'addTask').and.callThrough();

    component.newTask.title = '';
    component.newTask.description = '';
    component.createTask();

    expect(taskService.addTask).not.toHaveBeenCalled(); // Verifica que el servicio no se llamó
  });

  it('should call addTask and navigate on success', () => {
    spyOn(taskService, 'addTask').and.callThrough(); // Espía el servicio
    component.newTask = {
      id: 0,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component.createTask();

    expect(taskService.addTask).toHaveBeenCalled(); // Verifica que el servicio fue llamado
    expect(router.navigate).toHaveBeenCalledWith(['/']); // Verifica la navegación
  });

  it('should log error on service failure', () => {
    spyOn(taskService, 'addTask').and.returnValue(throwError(() => new Error('Service error')));
    spyOn(console, 'error'); // Espía el log de errores

    component.newTask = {
      id: 0,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component.createTask();

    expect(console.error).toHaveBeenCalledWith('Failed to create task', jasmine.any(Error));
  });
});
