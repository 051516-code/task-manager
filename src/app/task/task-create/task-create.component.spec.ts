import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreateComponent } from './task-create.component';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

  it('should not call addTask if title or description is missing', async () => {
    spyOn(taskService, 'addTask').and.callThrough();
    component.newTask.title = '';
    component.newTask.description = '';

    await component.createTask();

    expect(taskService.addTask).not.toHaveBeenCalled(); // Verifica que el servicio no se llamó
  });

  it('should call addTask and navigate on success', async () => {
    spyOn(taskService, 'addTask').and.returnValue(of(undefined)); // Espía el servicio
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any); // Simula la confirmación

    component.newTask = {
      id: 0,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await component.createTask();

    expect(taskService.addTask).toHaveBeenCalled(); // Verifica que el servicio fue llamado
    expect(router.navigate).toHaveBeenCalledWith(['/']); // Verifica la navegación
  });

  it('should show error alert on service failure', async () => {
    spyOn(taskService, 'addTask').and.returnValue(throwError(() => new Error('Service error')));
    const swalSpy = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any); // Simula confirmación

    component.newTask = {
      id: 0,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await component.createTask();

    expect(taskService.addTask).toHaveBeenCalled(); // Verifica que el servicio fue llamado
    expect(swalSpy).toHaveBeenCalledWith('¡Error al Crear la Tarea!', 'No se pudo Crear la tarea.', 'error');
  });
});
