import { Component, input, output } from "@angular/core";
import  { LucidePencil, LucideTrash } from '@lucide/angular'

export interface TableColumn {
  label: string, 
  attribute: string,
};

@Component({
  selector: 'TableComponent',
  templateUrl: './TableComponent.component.html',
  styleUrl: './TableComponent.component.css',
  imports: [LucidePencil, LucideTrash],
})
export class TableComponent {
  columns = input<TableColumn[]>([]);
  rows = input<Record<string, string>[]>([]);
  deleteButton = input<boolean>(false);
  updateButton = input<boolean>(false);
  update = output<number>(); 
  delete = output<number>();

  onUpdate(index: number) {
    this.update.emit(index);
  }

  onDelete(index: number) {
    this.delete.emit(index);
  }
}