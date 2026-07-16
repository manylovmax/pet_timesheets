import { Component, inject } from "@angular/core";
import AuthService from "../../services/auth.service";
import  { LucideLogOut } from '@lucide/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'HeaderMenu',
  templateUrl: './HeaderMenu.component.html',
  imports: [LucideLogOut],
})
export class HeaderMenu {
  private readonly router = inject(Router); 
  private readonly authService = inject(AuthService);

  async signout() {
    if (await this.authService.signout())
      this.router.navigate(['/signin'])
  }
}