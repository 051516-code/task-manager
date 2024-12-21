import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MathService } from './math.service';  // Importamos el servicio con la función soma

describe('AppComponent', () => {
  let mathService: MathService;  // Definimos el servicio

  beforeEach(async () => {
    // Configuramos el TestBed para incluir el MathService
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [MathService],  // Aseguramos que MathService esté disponible
    }).compileComponents();

    mathService = TestBed.inject(MathService);  // Inyectamos el servicio
  });

  it('Amdress', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'task-CAVALCANTE' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('task-manager');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, task-manager');
  });

  // Test de la función soma
  it('should return the sum of two numbers', () => {
    const result = mathService.soma(2, 3);
    expect(result).toBe(5);  // Comprobamos que la suma sea correcta
  });

  it('should return 0 when both numbers are 0', () => {
    const result = mathService.soma(0, 0);
    expect(result).toBe(0);  // Comprobamos que la suma de 0 + 0 sea 0
  });

  it('should return a negative number when adding negative numbers', () => {
    const result = mathService.soma(-2, -3);
    expect(result).toBe(-5);  // Comprobamos que la suma de -2 + -3 sea -5
  });
});
