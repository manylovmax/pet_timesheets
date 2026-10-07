import clsx from 'clsx';
import { useEffect, useRef, useState, type InputEvent } from 'react';


export interface DropdownItem {
    id: number;
    title: string;
}


interface onInputChangeCallback {
  (value: DropdownItem | undefined): void
}


interface componentProps {
  label?: string,
  options: DropdownItem[],
  errors?: string[],
  value: DropdownItem | undefined;
  onInputChange: onInputChangeCallback;
} 


export default function Dropdown({label, onInputChange, options, errors, value} : componentProps) {
  const editableRef = useRef<HTMLDivElement>(null);
  const getItemHTML = (title) => {
    return '<div class="rounded bg-gray-200 px-1 w-fit">' + title + '</div>'
  }

  const [listVisible, setListVisible] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState(options);
  
  useEffect(() => {
    setVisibleOptions(options);
  }, [options]);

  useEffect(() => {
    if (editableRef.current) {
      if (value) {
        editableRef.current.innerHTML = getItemHTML(value.title); 
      } else {
        editableRef.current.innerHTML = '';
      }
    }
  }, [value]);


  function onInput(event: InputEvent<HTMLDivElement>) {
    event.stopPropagation(); 
    const element = event.target as HTMLDivElement;
    let newValue = String(element.innerText);
    if (value) {
      onInputChange(undefined);
      element.innerHTML = '';
      newValue = '';
    }
    const cleanString = newValue.replace(/[\r\n]/g, "");

    if (cleanString.length)
      setVisibleOptions(options.filter(o => o.title.includes(cleanString)));
    else
      setVisibleOptions(options)

    setListVisible(true);
  }

  function onBlur() {
    setListVisible(false);
  }

  function onFocus() {
    if (!value)
      setListVisible(true);
  }

  function onSelect(id: number) {
    const selected = options.find(o => o.id === id);
    if (selected) {
      onInputChange(selected);
      const htmlString = getItemHTML(selected.title)
      if (editableRef.current)
        editableRef.current.innerHTML = htmlString;
    }
    setListVisible(false);
  }

  return (
<div className="flex flex-col relative w-full">
  { label && <div className='pl-2'>{ label }</div>}
  <div className="relative w-full">
    <div 
      ref={editableRef}
      contentEditable="true" 
      suppressContentEditableWarning={true}
      className="bg-white rounded-2xl px-2 mb-1 w-full h-6 min-w-[247px]"
      onInput={onInput}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={event => {
        if (event.key === 'Enter')
          event.preventDefault()
      }}
    ></div>

    <div className={clsx("absolute z-10 flex-col bg-white rounded top-6 left-0 w-full", {
        'hidden': !listVisible,
        'flex': listVisible 
      })}
    >
      { visibleOptions.map(option => 
      <div 
        key={option.id}
        className="hover:bg-gray-100 px-2 cursor-pointer"
        onMouseDown={() => onSelect(option.id)}>{ option.title }</div>
      )}
    </div>
      { errors && errors?.length > 0 && 
        <div
          className="flex flex-col" >
          {errors.map((error, i) => 
          <div 
            key={i}
            className="text-red-400 px-2">{ error }</div>
          )}
        </div>
      }
  </div>
</div>
  )
}