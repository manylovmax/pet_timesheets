import { Component, effect, input, model } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import { minutesToString } from "../../utils/time";


@Component({
  selector: 'TimeInputComponent',
  templateUrl: './TimeInput.component.html',
})
export class TimeInputComponent {
  label = input<string>('');
  id = uuidv4();
  value = model<number>(0);
  inputText: string = '';
  errorMessage = 'Input time in format "Xh Ym", where X and Y are integers, and first or second group is optional.';
  isValid = true;
  regex = /^(?:\d+h(?: \d+m)?|\d+m)$/;

  constructor() {
    effect(() => {
      const totalMinutes = this.value();
      this.inputText = minutesToString(totalMinutes);
    });
  }

  onInput(event: InputEvent) {
    event.stopPropagation(); 
    const element = event.target as HTMLInputElement;
    const newValue = String(element.value);
    this.inputText = newValue;
    this.isValid = Boolean(newValue.match(this.regex));
    if (this.isValid)
      this.value.set(this.parse(newValue));
  }

  parse(str: string): number {
    const hoursMatch = str.match(/(\d+)h/);
    const minutesMatch = str.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return (hours * 60) + minutes;
  }
}