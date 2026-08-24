import { Component, input, model, output } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'TextareaComponent',
  templateUrl: './Textarea.component.html',
})
export class TextareaComponent {
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