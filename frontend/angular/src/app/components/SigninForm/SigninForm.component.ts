import { Component, inject, signal, Signal } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import AuthService from "../../services/auth.service";
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';
import { form, FormField, required } from "@angular/forms/signals";
import { StatefulInput } from "../StatefulInput/StatefulInput.component";


interface SigninFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'SigninForm',
  templateUrl: './SigninForm.component.html',
  imports: [RouterLink, StatefulInput, FormField],
})
export class SigninForm {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);


  formModel = signal<SigninFormModel>({email: '', password: ''});
  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.password, {message: 'Password is required'});
  });

  async login(): Promise<void> {
    if (this.form().invalid())
      return;
    
    if (await this.authService.signin(this.formModel().password, this.formModel().email))
      this.router.navigate(['/timetable'])
  }
}