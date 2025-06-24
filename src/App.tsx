import { useState } from 'react'
import './App.css'
import MultiDropdownSelect, { type DropdownOption } from './components/MultiDropdownSelect';

function App() {
  const [options, setOptions] = useState<DropdownOption[]>([
    { key: 'education', value: 'Education 🎓' },
    { key: 'science', value: 'Yeeeah, science! 🧪' },
    { key: 'art', value: 'Art 🎭' },
    { key: 'sport', value: 'Sport ⚽' },
    { key: 'games', value: 'Games 🎮' },
    { key: 'health', value: 'Health 🏥' }
  ]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['science']);

  const addNewItem = (newItem: string) => {
    const newKey = `key-${Date.now()}`;
    setOptions(prev => [...prev, { key: newKey, value: newItem }]);
  };

  return (
    <>
      <MultiDropdownSelect
        options={options}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onAddNewItem={addNewItem}
      />
    </>
  )
}

export default App
