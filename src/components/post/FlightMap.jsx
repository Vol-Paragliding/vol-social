import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import localforage from 'localforage'

const MapWrapper = styled.div`
  .leafletMap {
    height: 300px;
    width: 100%;
    z-index: 1;
  }
`

const FitBounds = ({ flightPath }) => {
  const map = useMap()
  useEffect(() => {
    if (flightPath.length > 0) {
      map.fitBounds(flightPath)
    }
  }, [flightPath, map])
  return null
}

const cacheTile = async (url, blob) => {
  try {
    await localforage.setItem(url, blob)
  } catch (err) {
    console.error('Error caching tile:', err)
  }
}

const getCachedTile = async (url) => {
  try {
    return await localforage.getItem(url)
  } catch (err) {
    console.error('Error getting cached tile:', err)
    return null
  }
}

const fetchTile = async (tileUrl, done) => {
  const cachedTile = await getCachedTile(tileUrl)

  if (cachedTile) {
    done(null, cachedTile)
  } else {
    fetch(tileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        cacheTile(tileUrl, url)
        done(null, url)
      })
      .catch((err) => {
        console.error('Tile fetch error:', err)
        done(err, null)
      })
  }
}

const CachedTileLayer = ({ urlTemplate, ...props }) => {
  return (
    <TileLayer
      {...props}
      url={urlTemplate}
      getTileUrl={(coords) => {
        const tileUrl = urlTemplate
          .replace('{z}', coords.z)
          .replace('{x}', coords.x)
          .replace('{y}', coords.y)
        return tileUrl
      }}
      createTile={(coords, done) => {
        const tile = document.createElement('img')
        tile.onload = () => done(null, tile)
        tile.onerror = () => done('Error loading tile', null)
        const tileUrl = urlTemplate
          .replace('{z}', coords.z)
          .replace('{x}', coords.x)
          .replace('{y}', coords.y)
        fetchTile(tileUrl, (err, url) => {
          if (err) {
            done(err, null)
          } else {
            tile.src = url
          }
        })
        return tile
      }}
    />
  )
}

const FlightMap = ({ flightPath }) => {
  return (
    <MapWrapper>
      <MapContainer
        className="leafletMap"
        center={[0, 0]}
        zoom={13}
        zoomSnap={0.5}
        zoomDelta={0.5}
        zoomControl={false}
      >
        <CachedTileLayer
          attribution="Maps © Thunderforest, Data © OpenStreetMap"
          urlTemplate="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=45ac3fefb46044158060be660e86b1bb"
          // attribution="&copy; OSM"
          // urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={flightPath}
          color="rgb(119, 119, 119)"
          weight={7}
        />
        <Polyline positions={flightPath} color="#fc5200" weight={2} />
        <Polyline positions={flightPath} color="#d9fe74" weight={1} />
        <FitBounds flightPath={flightPath} />
      </MapContainer>
    </MapWrapper>
  )
}

export default FlightMap
