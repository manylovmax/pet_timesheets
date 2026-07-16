import { Component, inject, signal, Signal } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import AuthService from "../../services/auth.service";
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';

@Component({
  selector: 'SigninForm',
  templateUrl: './SigninForm.component.html',
  imports: [InputComponent, RouterLink],
})
export class SigninForm {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  email = signal<string>('');
  password = signal<string>('');

  async login(): Promise<void> {
    if (await this.authService.signin(this.password(), this.email()))
      this.router.navigate(['/records'])
  }
}