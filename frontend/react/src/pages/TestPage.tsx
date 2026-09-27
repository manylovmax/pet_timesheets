import Dropdown, { type DropdownItem } from "../components/Dropdown";
import InputComponent from "../components/InputComponent";

export default function TestPage() {

  const dropdownOptions: DropdownItem[] = [
    {id: 1, title: "1"},
    {id: 2, title: "2"},
    {id: 3, title: "3"},
    {id: 4, title: "4"},
  ];
  return (
    <div className="flex flex-col gap-4 bg-gray-300 w-[360px]">
      <InputComponent 
        type="text"
        onInputChange={(input) => {
          console.log('InputComponent', input);
        }}
      />
      <Dropdown
        options={dropdownOptions}
        onInputChange={(item) => {
          console.log('Dropdown', item?.id, item?.title);
        }}
      />
    </div>
  )
}