import { Component, inject, signal, WritableSignal } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { RecordForm } from "../../components/RecordForm/RecordForm.component";
import RecordsService from "../../services/records.service";
import { Router } from "@angular/router";

@Component({
  selector: 'RecordCreatePage',
  templateUrl: './RecordCreate.page.html',
  imports: [MainLayout, RecordForm]
})
export class RecordCreatePage {
  private readonly recordsService = inject(RecordsService);
  private readonly router = inject(Router);

  minutes: WritableSignal<string> = signal('1');
  date: WritableSignal<string> = signal('');

  async onCreate() {
    const result = await this.recordsService.createRecord({minutes: Number(this.minutes()), date: this.date()});
    if (result)
      this.router.navigate(['/records']);
    else
      alert('Record creation failure.');
  }
}