import type { TableColumn } from "../components/TableComponent";
import { useState, useEffect } from 'react';
import TableComponent from "../components/TableComponent";
import RecordsService, { type TimesheetsRecord } from "../services/records.service";
import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout";

const recordsService = new RecordsService();
const columns: Array<TableColumn> = [
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

export default function RecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<TimesheetsRecord[]>([]);
  const mapRecords = (records: TimesheetsRecord[]): Record<string, string>[] => {
      return records.map(r => ({
      'id': `${r.id}`,
      'user_id': `${r.user_id}`,
      'date': r.date,
      'minutes': `${r.minutes}`,
    }));
  };
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  
  useEffect(() => {
    let isMounted = true; 
    const onInit = async (): Promise<void> => {
      if (isMounted) {
        const result = await recordsService.getAllRecords();
        setRecords(result);
        setRows(mapRecords(result));
      }
    };

    onInit();

    return () => {
      isMounted = false;
    }
  }, []);

  const deleteRecord = async (index: number): Promise<void> => {
    if (await recordsService.deleteRecord(records[index].id)) {
      const records = await recordsService.getAllRecords();
      setRecords(records);
      setRows(mapRecords(records));
    }
  }

  const updateRecord = (index: number): void => {
    navigate(`/record-update/${records[index].id}`);
  }


  const goToCreate = (): void => {
    navigate('/record-create');
  }

  return (
    <MainLayout>
      <div className="flex flex-col">
        <div className="flex">
          <div className="uppercase cursor-pointer p-2 bg-gray-100 rounded-2xl"
            onClick={goToCreate}
          >Create</div>
        </div>
        <TableComponent 
          columns={columns} 
          rows={rows}
          onDelete={deleteRecord}
          onUpdate={updateRecord}
        />
      </div>
    </MainLayout>
  );
}