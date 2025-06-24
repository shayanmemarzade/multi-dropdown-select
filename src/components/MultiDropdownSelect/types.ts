export interface DropdownOption {
  key: string;
  value: string;
}

export interface MultiDropdownSelectProps {
  options: DropdownOption[];
  selectedKeys: string[];
  onSelectionChange: (selectedKeys: string[]) => void;
  onAddNewItem?: (newItem: string) => void;
}