import { Component, inject } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import AuthService from "../../services/auth.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'SigninForm',
  templateUrl: './SigninForm.component.html',
  imports: [InputComponent, RouterLink],
})
export class SigninForm {
  private readonly authService = inject(AuthService);
  email: string = '';
  password: string = '';

  async login(): Promise<void> {
    this.authService.signin(this.password, this.email);
  }
}