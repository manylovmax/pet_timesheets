import RecordForm from "../components/RecordForm";
import MainLayout from "../layouts/MainLayout";
import RecordsService from "../services/records.service";

const recordsService = new RecordsService();

export default function RecordCreatePage() {
  const createRecord = async (minutes: string, date: string): Promise<void> => {
    await recordsService.createRecord({minutes: Number(minutes), date});
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