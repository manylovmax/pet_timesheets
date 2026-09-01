import { Component } from "@angular/core";
import { MainLayout } from "../../layouts/Main/Main.layout";
import { TimeTable } from "../../components/TimeTable/TimeTable.component";

@Component({
  selector: 'TimeTablePage',
  templateUrl: './TimeTable.page.html',
  imports: [MainLayout, TimeTable],
})
export class TimeTablePage {
}