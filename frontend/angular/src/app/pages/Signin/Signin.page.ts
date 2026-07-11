import { Component } from "@angular/core";
import { UnauthorizedLayout } from "../../layouts/Unauthorized/Unauthorized.layout";
import { SigninForm } from "../../components/SigninForm/SigninForm.component";

@Component({
  selector: 'SigninPage',
  templateUrl: './Signin.page.html',
  imports: [UnauthorizedLayout, SigninForm]
})
export class SigninPage {

}