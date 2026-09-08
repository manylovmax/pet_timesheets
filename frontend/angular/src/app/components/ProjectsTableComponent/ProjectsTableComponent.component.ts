import { Component, computed, input, output } from "@angular/core";

export interface TableColumn {
  label: string, 
  attribute: string,
};

@Component({
  selector: 'ProjectsTableComponent',
  templateUrl: './ProjectsTableComponent.component.html',
  styleUrl: './ProjectsTableComponent.component.css',
  imports: [],
})
export class ProjectsTableComponent {
  columns = input<TableColumn[]>([]);
  openObjectPageColumnAttribute = input<string>('');
  rows = input<Record<string, string>[]>([]);
  deleteButton = input<boolean>(false);
  updateButton = input<boolean>(false);
  update = output<number>(); 
  delete = output<number>();
  open = output<number>();

  colspan = computed(() => {
    const columnsLength = this.columns().length;
    const actionsColumnPresent = this.deleteButton() || this.updateButton();
    return columnsLength + (actionsColumnPresent ? 1 : 0);
  });

  onUpdate(index: number) {
    this.update.emit(index);
  }

  onDelete(index: number) {
    this.delete.emit(index);
  }

  onOpen(index: number) {
    this.open.emit(index);
  }
}