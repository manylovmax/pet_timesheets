import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface onInputChangeCallback {
  (value: string): void
}

interface InputComponentProps {
  label?: string;
  type: 'text' | 'password' | 'email' | 'number' | 'date';
  initialValue?: string;
  onInputChange: onInputChangeCallback;
  errors?: string[];
} 

export default function InputComponent({label, type = 'text', onInputChange, initialValue = '', errors} : InputComponentProps) {
  const id = uuidv4();
  const [value, setValue] = useState(initialValue);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onInputChange(event.target.value);
  };

  return (
    <div className='flex flex-col'>
      { label && <label className='pl-2' htmlFor={id}>{label}</label>}
      
      <input 
        id={id}
        className='bg-white rounded-2xl px-2' 
        type={type} 
        value={value}
        onChange={handleInputChange}  
      />

      { errors && errors.length && 
        <div
          className="flex flex-col gap-4" >
          {errors.map((error, i) => 
          <div 
            key={i}
            className="text-red-400 px-2">{ error }</div>
          )}
        </div>
      }
    </div>
  )
}