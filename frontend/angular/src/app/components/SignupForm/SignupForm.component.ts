import { Component, inject, signal, Signal } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import AuthService from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { form, FormField, required, validate } from "@angular/forms/signals";
import { StatefulInput } from "../StatefulInput/StatefulInput.component";



interface SignupFormModel {
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
}


@Component({
  selector: 'SignupForm',
  templateUrl: './SignupForm.component.html',
  imports: [FormField, RouterLink, StatefulInput],
})
export class SignupForm {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  formModel = signal<SignupFormModel>({email: '', password: '', confirmPassword: '', fullname: ''});
  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.fullname, {message: 'Fullname is required'});
    required(schemaPath.password, {message: 'Password is required'});
    required(schemaPath.confirmPassword, {message: 'Please confirm your password'});
     validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });
  });

  async signup(): Promise<void> {
    if (this.form().invalid())
      return;

    if (await this.authService.signup({
      password: this.formModel().password, 
      email: this.formModel().email,
      fullname: this.formModel().fullname,
    }))
      this.router.navigate(['/timetable'])
  }
}