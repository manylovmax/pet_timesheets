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
  openObjectPageColumnAttribute?: string;
  onDelete?: onActionCallback;
  onUpdate?: onActionCallback;
  onOpen?: onActionCallback;
} 

export default function TableComponent({onDelete, onUpdate, onOpen, columns = [], rows = [], openObjectPageColumnAttribute = ''}: TableComponentProps) {  
  const [colspan, setColspan] = useState(columns.length + (onDelete || onUpdate ? 1 : 0));
  useEffect(() => {
    setColspan(columns.length + (onDelete || onUpdate ? 1 : 0));
  }, [rows, onDelete, onUpdate]);

  return columns.length && 
  <div className="w-full overflow-auto">
    <table className='w-full min-w-[600px] py-2'>{
      <thead>
        <tr>
          { columns.map(c => 
            <th key={c.attribute}>{c.label}</th>)
          }
          { (onUpdate || onDelete) && <th key='actions'>Actions</th>}
        </tr>
      </thead>}
      <tbody>
      {rows.map((row, rowIndex) => <tr key={rowIndex}>
        {columns.map(c =>  c.attribute === openObjectPageColumnAttribute ? 
        <td key={c.attribute}>
          <div 
            className='underline cursor-pointer'
            onClick={() => onOpen ? onOpen(rowIndex) : {}}  
          >{row[c.attribute]}</div>
        </td>  :
        <td key={c.attribute}>{row[c.attribute]}</td>
      )}
        { Boolean(onUpdate || onDelete) && 
        <td key='actions'>
          <div className='flex gap-2 w-full justify-center'>
            { Boolean(onUpdate) && onUpdate && <div className='underline cursor-pointer' onClick={() => onUpdate(rowIndex)}>Update</div> }
            { Boolean(onDelete) && onDelete && <div className='underline cursor-pointer' onClick={() => onDelete(rowIndex)}>Delete</div> }
          </div>
        </td>}
      </tr>)}
      { !rows.length && <tr><td colSpan={colspan}>No data</td></tr>}
      </tbody>
    </table>
  </div>;
}