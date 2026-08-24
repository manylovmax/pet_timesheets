import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import InputComponent from "./InputComponent";
import TextareaComponent from "./TextareaComponent";

interface onSubmitCallback {
  (minutes: string, date: string, comment: string): void;
}

interface RecordFormComponentProps {
  type: 'create' | 'update';
  onSubmit: onSubmitCallback;
  minutesInitial?: number;
  dateInitial?: string;
  commentInitial?: string;
} 


export default function RecordForm({type = 'create', onSubmit, minutesInitial = 1, dateInitial = '', commentInitial = ''}: RecordFormComponentProps) {
  const [minutes, setMinutes] = useState(String(minutesInitial));
  useEffect(() => {
    setMinutes(String(minutesInitial))
  }, [minutesInitial]);
  const onMinutesChange = (value: string) => {
    setMinutes(value);
  };
  const [date, setDate] = useState(dateInitial);
  useEffect(() => {
    setDate(dateInitial)
  }, [dateInitial]);
  const onDateChange = (value: string) => {
    setDate(value);
  };
  const [comment, setComment] = useState(commentInitial);
  useEffect(() => {
    setComment(commentInitial)
  }, [commentInitial]);
  const onCommentChange = (value: string) => {
    setComment(value);
  };
  
  return (
    <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
      <div>Record</div>
      <InputComponent 
        label="Date"
        type="date"
        onInputChange={onDateChange}  
        initialValue={date}
      />
      <InputComponent 
        label="Minutes"
        type="number"
        onInputChange={onMinutesChange}
        initialValue={minutes}  
      />
      <TextareaComponent 
        label="Comment"
        initialValue={comment}
        onChange={onCommentChange}
      />
      <button 
        className="bg-green-300 rounded-2xl px-2 uppercase"
        onClick={() => onSubmit(minutes, date, comment)}
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