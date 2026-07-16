import { Component, inject, signal, Signal } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import AuthService from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'SignupForm',
  templateUrl: './SignupForm.component.html',
  imports: [InputComponent, RouterLink],
})
export class SignupForm {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  email = signal<string>('');
  password = signal<string>('');
  passwordRepeat = signal<string>('');
  fullname = signal<string>('');

  async signup(): Promise<void> {
    if (await this.authService.signup({
      password: this.password(), 
      email: this.email(),
      fullname: this.fullname(),
    }))
      this.router.navigate(['/records'])
  }
}