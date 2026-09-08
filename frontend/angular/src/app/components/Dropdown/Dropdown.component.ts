import { Component, Input, input, OnChanges, signal, SimpleChanges, WritableSignal } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';

export interface DropdownItem {
    id: string;
    title: string;
}

@Component({
  selector: 'Dropdown',
  templateUrl: './Dropdown.component.html',
})
export class DropdownComponent implements OnChanges {
  @Input() value: WritableSignal<DropdownItem | null> = signal(null);
  options = input<DropdownItem[]> ([]);
  label = input<string>('');
  required = input<boolean>(true);
  id = uuidv4();
  inputText = signal('');
  visibleOptions: DropdownItem[] = this.options();
  listVisible: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.visibleOptions = this.options();
      this.value.set(null);
      this.inputText.set('');
    }
  }

  onInput(event: InputEvent) {
    event.stopPropagation(); 
    const element = event.target as HTMLInputElement;
    const newValue = String(element.value);
    this.inputText.set(newValue);
    this.value.set(null);
    if (newValue.length)
      this.visibleOptions = this.options().filter(o => o.title.includes(newValue));
    else
      this.visibleOptions = this.options();
  }

  onBlur() {
    this.listVisible = false;
  }

  onFocus() {
    this.listVisible = true;
  }

  onSelect(id: string) {
    const selected = this.options().find(o => o.id === id);
    if (selected) {
      this.value.set(selected);
      this.inputText.set(selected.title);
    }
    this.onBlur();
  }
}