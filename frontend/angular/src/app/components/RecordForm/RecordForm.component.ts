import { Component, effect, Input, input, output, signal, WritableSignal } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import { RouterLink } from "@angular/router";
import { TextareaComponent } from "../Textarea/Textarea.component";


@Component({
  selector: 'RecordForm',
  templateUrl: './RecordForm.component.html',
  imports: [InputComponent, RouterLink, TextareaComponent],
})
export class RecordForm {
  type = input<'create' | 'update'>('create');
  @Input() minutes: WritableSignal<string> = signal('');
  @Input() date: WritableSignal<string> = signal('');
  @Input() comment: WritableSignal<string> = signal('');
  submit = output<void>();
}