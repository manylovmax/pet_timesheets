import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { RecordForm } from "../../components/RecordForm/RecordForm.component";
import RecordsService, { TimesheetsRecord } from "../../services/records.service";

@Component({
  selector: 'RecordUpdatePage',
  templateUrl: './RecordUpdate.page.html',
  imports: [MainLayout, RecordForm]
})
export class RecordUpdatePage implements OnInit {
  private readonly recordsService = inject(RecordsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  minutes: WritableSignal<string> = signal('1');
  date: WritableSignal<string> = signal('');
  private id: number = 0;
  private record: TimesheetsRecord | null = null

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    this.record = await this.recordsService.getRecord(this.id);
    if (this.record) {
      this.minutes.set(String(this.record?.minutes));
      this.date.set(String(this.record?.date));
    }
  }

  async onUpdate() {
    const result = await this.recordsService.updateRecord({
      recordId: this.id,
      minutes: Number(this.minutes()), 
      date: this.date()
    });
    if (result)
      this.router.navigate(['/records']);
    else
      alert('Record creation failure.');
  }
}