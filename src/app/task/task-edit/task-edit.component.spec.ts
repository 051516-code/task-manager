import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TaskEditComponent } from './task-edit.component';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router'; // Importar Router

describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let fixture: ComponentFixture<TaskEditComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: any;

  beforeEach(async () => {
    // Mock TaskService
    taskServiceMock = jasmine.createSpyObj('TaskService', ['getTaskById', 'updateTask']);
    taskServiceMock.getTaskById.and.returnValue({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending', // Añadido status
      createdAt: new Date(), // Usando Date directamente
      updatedAt: new Date(), // Usando Date directamente
    });

    // Mock router
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        TaskEditComponent // Ahora lo importamos, no lo declaramos
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '1' })) } },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch task on ngOnInit', () => {
    expect(component.taskId).toBe(1);
    expect(component.task).toEqual({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: jasmine.any(Date), // Verifica que createdAt es una instancia de Date
      updatedAt: jasmine.any(Date), // Verifica que updatedAt es una instancia de Date
    });
    expect(taskServiceMock.getTaskById).toHaveBeenCalledWith(1);
  });

  it('should navigate to the task list on cancelEdit', () => {
    component.cancelEdit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show validation error when saving task with empty fields', async () => {
    component.task = { 
      id: 1, 
      title: '', 
      description: '', 
      status: 'pending', 
      createdAt: new Date(), // Usando Date directamente
      updatedAt: new Date() // Usando Date directamente
    };
    spyOn(window, 'alert'); // Mock the alert function
    await component.saveTask();
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
  });
});
