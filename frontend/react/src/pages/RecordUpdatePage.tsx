import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import RecordForm from "../components/RecordForm";
import MainLayout from "../layouts/MainLayout";
import RecordsService, { type TimesheetsRecord } from "../services/records.service";

const recordsService = new RecordsService();

export default function RecordUpdatePage() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [record, setRecord] = useState<TimesheetsRecord | null>(null);
  useEffect(() => {
    let isMounted = true; 
    const onInit = async (): Promise<void> => {
      if (isMounted) {
        const result = await recordsService.getRecord(Number(id));
        setRecord(result);
      }
    };

    onInit();

    return () => {
      isMounted = false;
    }
  }, []);

  const updateRecord = async (minutes: string, date: string): Promise<void> => {
    const result = await recordsService.updateRecord({minutes: Number(minutes), date, recordId: Number(id)});
    if (result)
      navigate('/records');
  }
  
  return (
    <MainLayout>
      <div className="grid place-items-center h-screen">
        <RecordForm 
          type="update"
          onSubmit={updateRecord}
          minutesInitial={record?.minutes}
          dateInitial={record?.date}
        />
      </div>
    </MainLayout>
  )
}