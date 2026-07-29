import { useState } from "react";
import { NavLink } from "react-router";

import InputComponent from "./InputComponent";

interface onSubmitCallback {
  (minutes: string, date: string): void;
}

interface RecordFormComponentProps {
  type: 'create' | 'update';
  onSubmit?: onSubmitCallback;
} 


export default function RecordForm({type = 'create', onSubmit}: RecordFormComponentProps) {
  const [minutes, setMinutes] = useState('');
  const onMinutesChange = (value: string) => {
    setMinutes(value);
  }
  const [date, setDate] = useState('');
  const onDateChange = (value: string) => {
    setDate(value);
  }
  
  return (
    <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
      <div>Record</div>
      <InputComponent 
        label="Date"
        type="date"
        onInputChange={onDateChange}  
      />
      <InputComponent 
        label="Minutes"
        type="number"
        onInputChange={onMinutesChange}  
      />
      <button 
        className="bg-green-300 rounded-2xl px-2 uppercase"
        onClick={() => {if (onSubmit) onSubmit(minutes, date)}}
      >{ type === 'create' ? 'Create' : 'Update'}
      </button>
      <NavLink
        to="/records"
        className="underline"
      >To records
      </NavLink>
    </div>
  )
}