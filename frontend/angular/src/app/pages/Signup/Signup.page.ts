import { Component } from "@angular/core";
import { UnauthorizedLayout } from "../../layouts/Unauthorized/Unauthorized.layout";
import { SignupForm } from "../../components/SignupForm/SignupForm.component";

@Component({
  selector: 'SignupPage',
  templateUrl: './Signup.page.html',
  imports: [UnauthorizedLayout, SignupForm]
})
export class SignupPage {

}