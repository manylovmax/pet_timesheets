import { v4 as uuidv4 } from 'uuid';

interface onInputChangeCallback {
  (value: string): void
}

interface InputComponentProps {
  value: string;
  label?: string;
  type: 'text' | 'password' | 'email' | 'number' | 'date';
  onInputChange: onInputChangeCallback;
  errors?: string[];
  spellcheck?: boolean;
} 

export default function InputComponent({label, type = 'text', onInputChange, errors, spellcheck = true, value} : InputComponentProps) {
  const id = uuidv4();
  console.log('InputComponent', value);

  return (
    <div className='flex flex-col'>
      { label && <label className='pl-2' htmlFor={id}>{label}</label>}
      
      <input 
        id={id}
        className='bg-white rounded-2xl px-2' 
        type={type} 
        value={value}
        onChange={(e) => onInputChange(e.target.value)}  
        spellCheck={spellcheck}
      />

      { errors && errors?.length > 0 && 
        <div
          className="flex flex-col" >
          { errors.map((error, i) => 
          <div 
            key={i}
            className="text-red-400 px-2">{ error }</div>
          ) }
        </div>
      }
    </div>
  )
}