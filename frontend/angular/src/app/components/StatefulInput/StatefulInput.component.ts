import { Component, input, model, output } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import { DisabledReason, FormValueControl, ValidationError, WithOptionalFieldTree } from "@angular/forms/signals";


@Component({
  selector: 'StatefulInput',
  templateUrl: './StatefulInput.component.html',
})
export class StatefulInput implements FormValueControl<string>  {
  type = input<'text' | 'password' | 'email' | 'date' | 'number'>('text');
  label = input<string>('');
  id = uuidv4();
  value = model<string>('');

  touched = input<boolean>(false);
  touch = output<void>();
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]); 
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}