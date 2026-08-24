import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface onTextareaChangeCallback {
  (value: string): void
}

interface TextareaComponentProps {
  label?: string;
  initialValue?: string;
  onChange: onTextareaChangeCallback;
} 

export default function TextareaComponent({label, onChange, initialValue = ''} : TextareaComponentProps) {
  const id = uuidv4();
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue]);
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className='flex flex-col'>
      { label && <label className='pl-2' htmlFor={id}>{label}</label>}
      
      <textarea 
        id={id}
        className='bg-white rounded-2xl px-2' 
        value={value}
        onChange={handleInputChange}  
      ></textarea>
    </div>
  )
}