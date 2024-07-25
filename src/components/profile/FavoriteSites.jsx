import React, { useState } from 'react'
import styled from 'styled-components'

const FavoriteSitesContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
`

const FavoriteSiteInput = styled.input`
  width: calc(100% - 36px);
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: black;
  color: #fff;
  margin-right: 8px;
  font-size: 16px;

  &:focus {
    outline: 2px solid var(--theme-color);
  }
`

const AddSiteButton = styled.button`
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

const RemoveSiteButton = styled.button`
  padding: 10px;
  border: none;
  background: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;
`

export const FavoriteSites = ({ favoriteSites, setFavoriteSites }) => {
  const [newFavoriteSite, setNewFavoriteSite] = useState('')

  const handleFavoriteSiteChange = (event) => {
    setNewFavoriteSite(event.target.value)
  }

  const handleFavoriteSiteKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addFavoriteSite()
    }
  }

  const addFavoriteSite = () => {
    if (newFavoriteSite) {
      setFavoriteSites([...favoriteSites, newFavoriteSite])
      setNewFavoriteSite('')
    }
  }

  const removeFavoriteSite = (index) => {
    const updatedSites = favoriteSites.filter((_, i) => i !== index)
    setFavoriteSites(updatedSites)
  }

  return (
    <FavoriteSitesContainer>
      <label>Favorite Flying Sites</label>
      {favoriteSites.map((site, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <FavoriteSiteInput
            value={site}
            onChange={(e) => {
              const updatedSites = favoriteSites.slice()
              updatedSites[index] = e.target.value
              setFavoriteSites(updatedSites)
            }}
            placeholder="Favorite Flying Site"
          />
          <RemoveSiteButton onClick={() => removeFavoriteSite(index)}>
            ✕
          </RemoveSiteButton>
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <FavoriteSiteInput
          value={newFavoriteSite}
          onChange={handleFavoriteSiteChange}
          onKeyPress={handleFavoriteSiteKeyPress}
          placeholder="Add a new favorite site"
        />
        <AddSiteButton onClick={addFavoriteSite}>Add</AddSiteButton>
      </div>
    </FavoriteSitesContainer>
  )
}
