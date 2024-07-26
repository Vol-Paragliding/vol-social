import React, { useState } from 'react'
import styled from 'styled-components'

const ListContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
const FormLabel = styled.label`
  color: var(--theme-color);
  font-size: 18px;
`

const ListInput = styled.input`
  width: calc(100% - 36px);
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-right: 8px;
  font-size: 16px;
  font-weight: bold;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const AddButton = styled.button`
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: var(--theme-color);
  color: black;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`

const RemoveButton = styled.button`
  padding: 10px 12px;
  border: none;
  background: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;
`

const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const ProfileList = ({ label, items = [], setItems, placeholder }) => {
  const [newItem, setNewItem] = useState('')

  const handleItemChange = (event, index) => {
    const newItems = items.slice()
    newItems[index] = event.target.value
    setItems(newItems)
  }

  const handleAddItem = () => {
    if (newItem) {
      setItems([...items, newItem])
      setNewItem('')
    }
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddItem()
    }
  }

  return (
    <ListContainer>
      <FormLabel>{label}</FormLabel>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListInput
            type="text"
            value={item}
            onChange={(e) => handleItemChange(e, index)}
            placeholder={placeholder}
          />
          <RemoveButton onClick={() => handleRemoveItem(index)}>✕</RemoveButton>
        </ListItem>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <ListInput
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Add a new ${placeholder.toLowerCase()}`}
        />
        <AddButton onClick={handleAddItem}>Add</AddButton>
      </div>
    </ListContainer>
  )
}

export default ProfileList
