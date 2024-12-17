import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {HeaderComponent} from '../header/header.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'register-form',
  templateUrl: 'register.component.html',
  styleUrl: 'register.component.css',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, HeaderComponent, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    birth: new FormControl('', [Validators.required])
  });
  readonly maxDate = new Date();

  errorMessage = signal('');

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.registerForm.get('email')?.setValue(route.snapshot.params['email']);
  }

  updateErrorMessage() {
    if (this.registerForm.get('email')?.hasError('required')) {
      this.errorMessage.set('Заполните поле');
    } else if (this.registerForm.get('email')?.hasError('email')) {
      this.errorMessage.set('Некорректный email');
    } else {
      this.errorMessage.set('');
    }
  }

  register() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.authService.register(this.registerForm.value)
        .subscribe({
          next: (data: any) => this.router.navigate(['/user', data.id])
        });
    }
  }
}
