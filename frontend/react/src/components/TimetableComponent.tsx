import clsx from "clsx"
import { RecordsService, type TimesheetsRecord } from "../services/records.service";
import { useEffect, useState } from "react";
import TasksService, { type TimesheetsTask } from "../services/tasks.service";
import { minutesToString, parseTime } from "../utils/time";
import type { DropdownItem } from "./Dropdown";
import { NavLink } from "react-router";
import { X } from 'lucide-react';
import Dropdown from "./Dropdown";
import InputComponent from "./InputComponent";
import TextareaComponent from "./TextareaComponent";


const recordsService = new RecordsService();
const tasksService = new TasksService();

interface weekDay {
  title: string;
  date: number;
  month: number;
  year: number;
  dateObj: Date;
  index: number;
  records: TimesheetsRecord[];
  isToday: boolean;
  totalMinutes: number;
}

export default function TimetableComponent() {
  const [globalWeekDays, setGlobalWeekDays] = useState<weekDay[]>([]);
  const [weekDaysPeriodString, setWeekDaysPeriodString] = useState<string>('');
  const [records, setRecords] = useState<TimesheetsRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<TimesheetsRecord | undefined>();
  const [time, setTime] = useState<string>('');
  const [timeErrors, setTimeErrors] = useState<string[]>([]);
  const [date, setDate] = useState<string>('');
  const [dateErrors, setDateErrors] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<DropdownItem | undefined>();
  const [taskErrors, setTaskErrors] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [taskOptions, setTaskOptions] = useState<DropdownItem[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const initializeWeekdays = function(startDay: Date) {
    const today = new Date();
    const weekDays: weekDay[] = [];
    const dayOfWeek = startDay.getDay();// starting from Sunday = 0, Saturday = 6
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() - daysToSubtract + i)// remove the daysToSubtract term to start from Sunday
      weekDays.push({
        title: date.toLocaleDateString('en-US', { weekday: 'long' }), 
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        dateObj: new Date(date),
        index: i,
        records: [],
        isToday: today.toLocaleDateString('en-CA') == date.toLocaleDateString('en-CA'),
        totalMinutes: 0,
      });
    }
    setGlobalWeekDays(weekDays);
    setWeekDaysPeriodString( 
      (weekDays[0]?.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) || '')
      + ' - ' +
      (weekDays[weekDays.length - 1]?.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) || ''));

    return weekDays;
  }

  const refreshRecords = async function(weekDays: weekDay[]): Promise<void> {
    for (let i = 0; i < weekDays.length; i++) {
      const weekDay = weekDays[i];
      if (weekDay) {
        weekDay.records = [];
        weekDay.totalMinutes = 0;
      }
    }
    const startDate = weekDays[0]?.dateObj.toLocaleDateString('en-CA');
    const endDate = weekDays[weekDays.length - 1]?.dateObj.toLocaleDateString('en-CA');
    if (startDate && endDate) {
      setRecords(await recordsService.getRecordsForPeriod(startDate, endDate));
    }
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const weekDay = weekDays.find(wd => wd.dateObj.toLocaleDateString('en-CA') == record!.date);
      if (weekDay && record) {
        weekDay.records.push(record);
        weekDay.totalMinutes += record.minutes;
      }
    }
    setGlobalWeekDays(weekDays);
  }

  const onEdit = function(recordId: number) {
    const record = records.find(r => r.id === recordId);
    setEditingRecord(record);
    console.log('record', record);
    if (record) {
      setTime(minutesToString(record?.minutes));
      setDate(String(record?.date));
      setComment(record?.comment);
      setSelectedTask(taskOptions.find(to => to.id === record?.task_id));
      setModalOpen(true);
    }
  }

  const closeModal = function() {
    setModalOpen(false);
  }

  const onSave = async function () {
    if (!editingRecord)
      return;

    if (!isValid)
      return;

    const result = await recordsService.updateRecord({
      task_id: editingRecord.task_id,
      record_id: editingRecord.id,
      minutes: parseTime(time), 
      date: date,
      comment: comment,
    });
    if (result) {
      await refreshRecords(globalWeekDays);
      setModalOpen(false);
    }
  }

  const onDelete = async function() {
    const recordId = editingRecord?.id;
    if (recordId) {
      const result = await recordsService.deleteRecord(recordId);
      if (result) {
        await refreshRecords(globalWeekDays);
        setModalOpen(false);
      }
    }
  }

  const goToPreviousWeek = async function() {
    currentDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(currentDate)
    const weekDays = initializeWeekdays(currentDate);
    await refreshRecords(weekDays);
  }

  const goToNextWeek = async function() {
    currentDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(currentDate)
    const weekDays = initializeWeekdays(currentDate);
    await refreshRecords(weekDays);
  }

  const onTaskSelect = function(item: DropdownItem | undefined) {
    setSelectedTask(item);
  }

  const onDateInput = function(str: string) {
    setDate(str);
  }

  const onTimeInput = function(str: string) {
    setTime(str);
  } 

  
  const onCommentInput = function(str: string) {
    setComment(str);
  }

  useEffect(() => {
    const onInit = async (): Promise<void> => {
      const weekDays = initializeWeekdays(currentDate);
      await refreshRecords(weekDays);
      const tasks = await tasksService.getAll();
      setTaskOptions(tasks.map(t => ({id: t.id, title: t.title})));
    };

    onInit();
  }, []);


    return (
<>
  <div>
    <div className="hidden sm:flex  justify-between">
      <div>
        <div className="p-2 text-2xl">{ weekDaysPeriodString }</div>
      </div>
      <div className="flex flex-row-reverse pb-4 gap-4 items-end">
        <NavLink
          to="/record-create"
          className="underline"
        >Add a record
        </NavLink>
        <div 
          className="cursor-pointer select-none underline"
          onClick={goToNextWeek}  
        >Later</div>
        <div 
          className="cursor-pointer select-none underline"
          onClick={goToPreviousWeek}  
        >Earlier</div>
      </div>
    </div>
    <div className="sm:hidden">
      <div>
        <div className="p-2 text-2xl">{ weekDaysPeriodString }</div>
      </div>
      <div className="flex flex-row-reverse pb-4 gap-2">
        <NavLink
          to="/record-create"
          className="cursor-pointer p-2 underline select-none"
        >Add a record
        </NavLink>
        <div 
          className="cursor-pointer p-2 select-none underline"
          onClick={goToNextWeek}  
        >Later</div>
        <div 
          className="cursor-pointer p-2 select-none underline"
          onClick={goToPreviousWeek}  
        >Earlier</div>
      </div>
    </div>

    <div className="flex w-full overflow-x-auto">
      { globalWeekDays.map(weekDay => 
      <div 
        key={weekDay.index}
        className={clsx("p-2 border-gray-200 min-h-[60vh] w-[225px] min-w-[225px]", {
          'border-r-2': weekDay.index !== 6,
          'bg-gray-100': weekDay.isToday
        })}
      >
        <div className="flex justify-between gap-8 mb-2">
          <div className="flex gap-4">
            <div>{ weekDay.title }</div>
            <div>{ weekDay.date }</div>
          </div>
          <div>{ minutesToString(weekDay.totalMinutes) }</div>
        </div>

        <div className="flex flex-col gap-2">
          { weekDay.records.map(record => 
          <div 
            key={record.id}
            className="p-2 rounded-xl cursor-pointer border-gray-200 border-2 bg-white"
            onClick={() => onEdit(record.id)}  
          >
            <div>{ record.task_title }</div>
            <div>{ minutesToString(record.minutes) }</div>
            <div>{ record.comment }</div>
          </div>
          ) }
        </div>
      </div> 
      ) }
  

    </div>
  </div>


  <div className={clsx("flex items-center justify-center z-50 fixed inset-0", modalOpen ? 'block' : 'hidden')}
    onClick={closeModal}
  >
    <div className="fixed inset-0 transition-opacity backdrop-blur-md"></div>
    <div 
      onClick={(event) => event.stopPropagation()}
      className="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center z-10 relative w-[360px] sm:w-[400px]">
      <X 
        className="cursor-pointer absolute top-2 right-2"
        onClick={closeModal}
      />
      <div>Update record</div>
      <Dropdown
        label="Task"
        options={taskOptions}
        errors={taskErrors}
        onInputChange={onTaskSelect}
        value={selectedTask}
      />
      <InputComponent
        type="date"
        label="Date"
        errors={dateErrors}
        onInputChange={onDateInput}
        value={date}
      />
      <InputComponent
        type="text"
        label="Spent time"
        errors={timeErrors}
        spellcheck={false}
        onInputChange={onTimeInput}
        value={time}
      />
      <TextareaComponent
        label="Comment"
        value={comment}
        onChange={onCommentInput}
      />
      <div className="flex gap-4 justify-between w-full">
        <div 
          className="underline cursor-pointer select-none"
          onClick={onDelete}
        >Delete</div>
        <div 
          className={clsx("select-none", {
            'underline': isValid,
            'cursor-pointer': isValid,
          })}
          onClick={onSave}
        >Update</div>
      </div>
    </div>
  </div>
</>
  );
}