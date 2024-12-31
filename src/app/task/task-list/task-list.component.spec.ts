import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { of } from 'rxjs';
import { Task } from '../models/task.interface';
import Swal from 'sweetalert2';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
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
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent], // Cambiado de `declarations` a `imports`
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should fetch tasks on initialization', () => {
    mockTaskService.getTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(mockTaskService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks.reverse());
  });

  it('should delete a task and update the task list', async () => {
    const deleteTaskSpy = mockTaskService.deleteTask.and.returnValue(of(void 0));
    component.tasks = [...mockTasks];
  
    // Simula el comportamiento de SweetAlert2 confirmando la acción
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  
    // Llama al método que elimina la tarea
    await component.deleteTask(1); // Asegúrate de usar `await` si deleteTask es asíncrono
  
    expect(deleteTaskSpy).toHaveBeenCalledWith(1); // Verifica que el método del servicio sea llamado
    expect(component.tasks.length).toBe(1); // Verifica que la tarea fue eliminada
    expect(component.tasks[0].id).toBe(2); // Verifica que queda la tarea correcta
  });
  

  it('should set selectedTask when showTaskDetails is called', () => {
    const task: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'in-progress',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component.showTaskDetails(task);

    expect(component.selectedTask).toEqual(task);
  });

  it('should clear selectedTask when closeModal is called', () => {
    component.selectedTask = mockTasks[0];

    component.closeModal();

    expect(component.selectedTask).toBeNull();
  });
});
