import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { TableColumn, TableComponent } from "../../components/TableComponent/TableComponent.component";
import { Router } from "@angular/router";
import RecordsService, { TimesheetsRecord } from "../../services/records.service";

@Component({
  selector: 'RecordsPage',
  templateUrl: './Records.page.html',
  imports: [MainLayout, TableComponent],
})
export class RecordsPage implements OnInit {
  private readonly router = inject(Router);
  private readonly recordsService = inject(RecordsService);

  columns: Array<TableColumn> = [
    {
      label: 'ID',
      attribute: 'id',
    },
    {
      label: 'Date',
      attribute: 'date',
    },
    {
      label: 'Minutes',
      attribute: 'minutes',
    },
  ];
  private records: TimesheetsRecord[] = [];
  mappedRecords: WritableSignal<Record<string, string>[]> = signal([]);

  async ngOnInit(): Promise<void> {
    await this.refreshRecords();
  }

  private async refreshRecords(): Promise<void> {
    this.records = await this.recordsService.getAllRecords();
    this.mappedRecords.set(this.records.map(r => ({
      'id': `${r.id}`,
      'user_id': `${r.user_id}`,
      'date': r.date,
      'minutes': `${r.minutes}`,
    })));
  }

  goToCreate() {
    this.router.navigate(['/record-create'])
  }

  goToUpdatePage(index: number) {
    const recordId = this.records[index]?.id;
    this.router.navigate(['/record-update/' + recordId]);
  }

  async deleteRecord(index: number) {
    const recordId = this.records[index]?.id;
    if (recordId) {
      const result = await this.recordsService.deleteRecord(recordId);
      if (result) {
        await this.refreshRecords();
      }
    }
  }
}