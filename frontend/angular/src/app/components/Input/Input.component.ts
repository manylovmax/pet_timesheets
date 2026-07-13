import { Component, input, model, output } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'InputComponent',
  templateUrl: './Input.component.html',
})
export class InputComponent {
  type = input<'text' | 'password' | 'email' | 'date' | 'number'>('text');
  label = input<string>('');
  id = uuidv4();
  value = model<string>('');

  onInput(event: InputEvent) {
    event.stopPropagation(); 
    const element = event.target as HTMLInputElement;
    const newValue = String(element.value);
    this.value.set(newValue);
  }
}