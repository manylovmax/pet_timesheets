import { Component, input, output } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'InputComponent',
  templateUrl: './Input.component.html',
})
export class InputComponent {
  type = input<'text' | 'password' | 'email' | 'date' | 'number'>('text');
  label = input<string>('');
  input = output<string>();
  id = uuidv4();

  onInput(event: InputEvent) {
    event.stopPropagation(); 
    const element = event.target as HTMLInputElement;
    this.input.emit(String(element.value));
  }
}