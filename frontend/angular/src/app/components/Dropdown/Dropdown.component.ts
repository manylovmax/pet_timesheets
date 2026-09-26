import { Component, effect, Input, input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';

export interface DropdownItem {
    id: number;
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
  innerHTML = signal('');
  visibleOptions: DropdownItem[] = this.options();
  listVisible: boolean = false;

  constructor() {
    effect(() => {
      const selected = this.options().find(o => o.id === this.value()?.id);
      if (selected) {
        this.innerHTML.set('<div class="rounded bg-gray-200 px-1 w-fit">' + selected.title + '</div>');
        this.listVisible = false;
      } else {
        this.innerHTML.set('');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.visibleOptions = this.options();
      this.value.set(null);
      this.innerHTML.set('');
    }
  }

  onInput(event: InputEvent) {
    event.stopPropagation(); 
    const element = event.target as HTMLDivElement;
    let newValue = String(element.innerText);
    if (this.value()) {
      this.value.set(null);
      this.innerHTML.set('');
      newValue = '';
    }
    const cleanString = newValue.replace(/[\r\n]/g, "");
    if (cleanString.length)
      this.visibleOptions = this.options().filter(o => o.title.includes(cleanString));
    else
      this.visibleOptions = this.options();

    this.listVisible = true;
  }

  onBlur() {
    this.listVisible = false;
  }

  onFocus() {
    if (!this.value())
      this.listVisible = true;
  }

  onSelect(id: number) {
    const selected = this.options().find(o => o.id === id);
    if (selected) {
      this.value.set(selected);
      // this.visibleOptions = [];
    }
    this.listVisible = false;
  }
}