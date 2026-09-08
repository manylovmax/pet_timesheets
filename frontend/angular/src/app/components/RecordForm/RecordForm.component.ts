import { Component, effect, Input, input, output, signal, WritableSignal } from "@angular/core";
import { InputComponent } from "../Input/Input.component";
import { RouterLink } from "@angular/router";
import { TextareaComponent } from "../Textarea/Textarea.component";
import { DropdownComponent, DropdownItem } from "../Dropdown/Dropdown.component";


@Component({
  selector: 'RecordForm',
  templateUrl: './RecordForm.component.html',
  imports: [InputComponent, RouterLink, TextareaComponent, DropdownComponent],
})
export class RecordForm {
  type = input<'create' | 'update'>('create');
  @Input() task_id: WritableSignal<number> = signal(0);
  @Input() minutes: WritableSignal<string> = signal('');
  @Input() date: WritableSignal<string> = signal('');
  @Input() comment: WritableSignal<string> = signal('');
  @Input() task: WritableSignal<DropdownItem | null> = signal(null);
  @Input() taskOptions: DropdownItem[] = [];
  submit = output<void>();
}