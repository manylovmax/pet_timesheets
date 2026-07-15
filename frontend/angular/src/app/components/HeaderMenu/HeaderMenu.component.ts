import { Component, inject } from "@angular/core";
import AuthService from "../../services/auth.service";
import  { LucideLogOut } from '@lucide/angular'

@Component({
  selector: 'HeaderMenu',
  templateUrl: './HeaderMenu.component.html',
  imports: [LucideLogOut],
})
export class HeaderMenu {
  private readonly authService = inject(AuthService);

  async signout() {
    await this.authService.signout();
  }
}