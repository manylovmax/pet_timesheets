import { Pencil, Trash } from 'lucide-react';
import './TableComponent.css';
import { useEffect, useState } from 'react';

interface onActionCallback {
  (id: number): void;
}

export interface TableColumn {
  label: string; 
  attribute: string;
}

interface TableComponentProps {
  columns?: TableColumn[];
  rows?: Record<string, string>[];
  onDelete?: onActionCallback;
  onUpdate?: onActionCallback;
} 

export default function TableComponent({onDelete, onUpdate, columns = [], rows = []}: TableComponentProps) {  
  const [colspan, setColspan] = useState(columns.length + (onDelete || onUpdate ? 1 : 0));
  useEffect(() => {
    setColspan(columns.length + (onDelete || onUpdate ? 1 : 0));
  }, [rows, onDelete, onUpdate]);

  return columns.length && 
  <div className="w-full overflow-x-scroll">
    <table className='w-full min-w-[600px] py-2'>{
      <thead>
        <tr>
          {columns.map(c => <th key={c.attribute}>{c.label}</th>)}
          { (onUpdate || onDelete) && <th key='actions'>Actions</th>}
        </tr>
      </thead>}
      <tbody>
      {rows.map((r, i) => <tr key={i}>
        {columns.map(c => <td key={c.attribute}>{r[c.attribute]}</td>)}
        {<td key='actions'>
          <div className='flex gap-2 w-full justify-center'>
            { onUpdate && <Pencil size={32} color="black" strokeWidth={1} onClick={() => onUpdate(i)}>Update</Pencil> }
            { onDelete && <Trash size={32} color="black" strokeWidth={1} onClick={() => onDelete(i)}>Delete</Trash> }
          </div>
        </td>}
      </tr>)}
      { !rows.length && <tr><td colSpan={colspan}>No data</td></tr>}
      </tbody>
    </table>
  </div>;
}