import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEditComponent } from './task-edit.component';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; 
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let fixture: ComponentFixture<TaskEditComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTaskById', 'updateTask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Simulamos el servicio getTaskById para devolver una tarea mock
    mockTaskService.getTaskById.and.returnValue({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await TestBed.configureTestingModule({
      imports: [TaskEditComponent, FormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => '1' }) }, // Simula que el id es 1
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call updateTask if save is canceled', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true })); // Simula cancelación

    // Solo espía una vez el método updateTask en el bloque beforeEach
    const updateSpy = mockTaskService.updateTask;

    await component.saveTask();

    expect(updateSpy).not.toHaveBeenCalled(); // Verifica que no se haya llamado a updateTask
    expect(mockRouter.navigate).not.toHaveBeenCalled(); // Verifica que no se haya redirigido
  });

  it('should handle errors during updateTask gracefully', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false })); // Simula confirmación
    
    // Cambiar el comportamiento del spy en esta prueba específica
    mockTaskService.updateTask.and.throwError('Error'); // Simula error en updateTask

    component.task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await component.saveTask();

    // Verifica que Swal.fire haya sido llamado con el mensaje de error adecuado
    expect(Swal.fire).toHaveBeenCalledWith('¡Error al Editar!', 'No se pudo actualizar la tarea.', 'error');
  });
});
