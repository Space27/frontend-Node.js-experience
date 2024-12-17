import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {HeaderComponent} from '../header/header.component';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.css',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  errorMessage = signal('');

  updateErrorMessage() {
    if (this.loginForm.get('email')?.hasError('required')) {
      this.errorMessage.set('Заполните поле');
    } else if (this.loginForm.get('email')?.hasError('email')) {
      this.errorMessage.set('Некорректный email');
    } else {
      this.errorMessage.set('');
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.get('email')?.value)
        .subscribe({
          next: (data: any) => this.router.navigate(['/user', data.id]),
          error: () => this.router.navigate(['/register', this.loginForm.get('email')?.value])
        })
    }
  }
}
