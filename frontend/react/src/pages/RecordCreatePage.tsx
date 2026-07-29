import { useNavigate } from "react-router";

import RecordForm from "../components/RecordForm";
import MainLayout from "../layouts/MainLayout";
import RecordsService from "../services/records.service";

const recordsService = new RecordsService();

export default function RecordCreatePage() {
  const navigate = useNavigate();

  const createRecord = async (minutes: string, date: string): Promise<void> => {
    const result = await recordsService.createRecord({minutes: Number(minutes), date});
    if (result)
      navigate('/records');
  }
  
  return (
    <MainLayout>
      <div className="grid place-items-center h-screen">
        <RecordForm 
          type="create"
          onSubmit={createRecord}  
        />
      </div>
    </MainLayout>
  )
}