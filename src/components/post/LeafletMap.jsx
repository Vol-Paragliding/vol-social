import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { parseIgcFile } from '../../utils/igcParser'
import FlightStats from './FlightStats'
import FlightMap from './FlightMap'

const Container = styled.div`
  .leafletMap {
    height: 400px;
    z-index: 1;
    // width: calc(100% + 30px);
    // margin-left: -30px;
    border-radius: 10px;
  }
`

const LeafletMap = ({ igc }) => {
  const [flightPath, setFlightPath] = useState([])
  const attributionRef = useRef(null)

  useEffect(() => {
    const fetchAndDisplayFlightPath = async () => {
      try {
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

        if (attributionRef.current) {
          const attributionControl = attributionRef.current.querySelector(
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
        }
      } catch (error) {
        console.error('Error in fetchAndDisplayFlightPath:', error)
      }
    }

    fetchAndDisplayFlightPath()
  }, [igc?.url])

  return (
    <Container ref={attributionRef}>
      <FlightStats igc={igc} />
      <FlightMap flightPath={flightPath} />
    </Container>
  )
}

export default LeafletMap
