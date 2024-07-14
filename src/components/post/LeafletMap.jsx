import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import localforage from 'localforage'

import { parseIgcFile } from '../../utils/igcParser'

const Container = styled.div`
  .flight-stats {
    display: flex;
    justify-content: space-between;
    align-content: space-around;
    flex-wrap: wrap;
    height: 100px;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    p {
      margin: 0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 75px;

      &-value {
        font-weight: bold;
        font-size: 16px;
      }

      &-label {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .leafletMap {
    height: 300px;
    width: 100%;
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

const LeafletMap = ({ igc }) => {
  const [flightPath, setFlightPath] = useState([])

  useEffect(() => {
    const fetchAndDisplayFlightPath = async () => {
      try {
        console.log('Fetching IGC file')
        const response = await fetch(igc?.url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const igcContent = await response.text()
        if (igcContent.startsWith('<!doctype html>')) {
          throw new Error('Received HTML content instead of IGC file')
        }
        const flightData = parseIgcFile(igcContent)
        const path = flightData.fixes.map((fix) => [
          fix.latitude,
          fix.longitude,
        ])
        setFlightPath(path)
        const attributionControl = document.querySelector(
          '.leaflet-control-attribution'
        )
        if (attributionControl) {
          attributionControl.style.opacity = '0.5'
          attributionControl.style.fontSize = '10px'
          attributionControl.querySelectorAll('a').forEach((a) => {
            a.style.color = 'rgba(0, 0, 0, 0.5)'
            a.style.textDecoration = 'none'
          })
          const leafletLink = attributionControl.querySelector(
            'a[href="https://leafletjs.com"]'
          )
          const spanSeparator = attributionControl.querySelector(
            'span[aria-hidden="true"]'
          )
          if (leafletLink && spanSeparator) {
            leafletLink.style.display = 'none'
            spanSeparator.style.display = 'none'
          }
        }
      } catch (error) {
        console.error('Error in fetchAndDisplayFlightPath:', error)
      }
    }

    fetchAndDisplayFlightPath()
  }, [igc?.url])

  return (
    <Container>
      {igc.data && (
        <div className="flight-stats">
          <div className="stat">
            <span className="stat-label">Date</span>
            <span className="stat-value">{igc.data.date}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{Math.trunc(igc.data.score)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{igc.data.flightDuration}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Distance</span>
            <span className="stat-value">
              {igc.data.freeDistance.toFixed(2)} km
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg. speed</span>
            <span className="stat-value">{igc.data.avgSpeed} km/h</span>
          </div>
          <div className="stat">
            <span className="stat-label">Wing</span>
            <span className="stat-value">{igc.data.gliderType}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Max alt.</span>
            <span className="stat-value">{igc.data.maxAltitude} m</span>
          </div>
          <div className="stat">
            <span className="stat-label">Max alt. gain</span>
            <span className="stat-value">{igc.data.maxAltitudeGain} m</span>
          </div>
          <div className="stat">
            <span className="stat-label">Max climb</span>
            <span className="stat-value">{igc.data.maxClimb} m/s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Max sink</span>
            <span className="stat-value">{igc.data.maxSink} m/s</span>
          </div>
        </div>
      )}
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
    </Container>
  )
}

export default LeafletMap
