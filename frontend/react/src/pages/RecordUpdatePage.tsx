import { useParams } from "react-router";

import RecordForm from "../components/RecordForm";
import MainLayout from "../layouts/MainLayout";
import RecordsService from "../services/records.service";

const recordsService = new RecordsService();

export default function RecordUpdatePage() {
  const {id} = useParams();  

  const updateRecord = async (minutes: string, date: string): Promise<void> => {
    await recordsService.updateRecord({minutes: Number(minutes), date, recordId: Number(id)});
  }
  
  return (
    <MainLayout>
      <div className="grid place-items-center h-screen">
        <RecordForm 
          type="update"
          onSubmit={updateRecord}  
        />
      </div>
    </MainLayout>
  )
}