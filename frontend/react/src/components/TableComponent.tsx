import './TableComponent.css';

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
  return columns.length && 
    <table className='w-full'>{
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
            { onUpdate && <div onClick={() => onUpdate(i)}>Update</div> }
            { onDelete && <div onClick={() => onDelete(i)}>Delete</div> }
          </div>
        </td>}
      </tr>)}
      </tbody>
    </table>;
}