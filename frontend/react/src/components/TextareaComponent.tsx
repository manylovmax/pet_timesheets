import { v4 as uuidv4 } from 'uuid';

interface onTextareaChangeCallback {
  (value: string): void
}

interface TextareaComponentProps {
  label?: string;
  value: string;
  onChange: onTextareaChangeCallback;
} 

export default function TextareaComponent({label, onChange, value} : TextareaComponentProps) {
  const id = uuidv4();

  return (
    <div className='flex flex-col'>
      { label && <label className='pl-2' htmlFor={id}>{label}</label>}
      
      <textarea 
        id={id}
        className='bg-white rounded-2xl px-2' 
        value={value}
        onChange={e => onChange(e.target.value)}  
      ></textarea>
    </div>
  )
}