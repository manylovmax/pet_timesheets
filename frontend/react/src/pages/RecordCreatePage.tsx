import { useNavigate } from "react-router";

import MainLayout from "../layouts/MainLayout";
import RecordsService from "../services/records.service";
import InputComponent from "../components/InputComponent";
import { useEffect, useState } from "react";
import { parseTime, validateTimeString } from "../utils/time";
import TextareaComponent from "../components/TextareaComponent";
import type { DropdownItem } from "../components/Dropdown";
import Dropdown from "../components/Dropdown";
import TasksService from "../services/tasks.service";
import clsx from "clsx";

const recordsService = new RecordsService();
const tasksService = new TasksService();

export default function RecordCreatePage() {
  const navigate = useNavigate();


  const [comment, setComment] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [dateErrors, setDateErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!date)
      errors.push('Date is required');
  
    setDateErrors(errors);
  }, [date]);

  const [time, setTime] = useState<string>('');
  const [timeErrors, setTimeErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!time)
      errors.push('Spent time is required');

    if (!validateTimeString(time))
      errors.push('Input time in format "Xh Ym", where X and Y are integers, and first or second group is optional.');
  
    setTimeErrors(errors);
  }, [time]);


  const [selectedTask, setSelectedTask] = useState<DropdownItem | undefined>();
  const [taskErrors, setTaskErrors] = useState<string[]>([]);
  useEffect(() => {
    const errors: string[] = [];
    if (!selectedTask)
      errors.push('Task is required');
  
    setTaskErrors(errors);
  }, [selectedTask]);
  const [taskOptions, setTaskOptions] = useState<DropdownItem[]>([]);

  useEffect(() => {
    const onInit = async (): Promise<void> => {
      const tasks = await tasksService.getAll();
      setTaskOptions(tasks.map(t => ({id: t.id, title: t.title})));
    };

    onInit();
  }, []);

  const [isValid, setIsValid] = useState<boolean>(false);
  useEffect(() => {
    setIsValid(!(taskErrors.length || dateErrors.length || timeErrors.length));
  }, [taskErrors, dateErrors, timeErrors]);

  const createRecord = async (): Promise<void> => {
    if (!isValid)
      return;

    const result = await recordsService.createRecord({
        task_id: selectedTask!.id,
        minutes: parseTime(time), 
        date: date,
        comment: comment,
      });
    if (result)
      navigate('/timesheet');
  }
  
  return (
    <MainLayout>
      <div className="grid place-items-center h-screen">
        <div className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center w-[360px] sm:w-[400px]">
          <div>Create record</div>
          <Dropdown
            label="Task"
            options={taskOptions}
            errors={taskErrors}
            onInputChange={value => setSelectedTask(value)}
            value={selectedTask}
          />
          <InputComponent
            label="Date"
            type="date"
            onInputChange={value => setDate(value)}  
            value={date}
            errors={dateErrors}
          />
          <InputComponent 
            label="Spent time"
            type="number"
            onInputChange={value => setTime(value)}
            value={time}  
            errors={timeErrors}
          />
          <TextareaComponent 
            label="Comment"
            value={comment}
            onChange={value => setComment(value)}
          />

          <div className="flex gap-4 justify-between w-full flex-row-reverse">
            <div 
              className={clsx("select-none", {
                'underline': isValid,
                'cursor-pointer': isValid,
              })}
              onClick={createRecord}
            >Update</div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}