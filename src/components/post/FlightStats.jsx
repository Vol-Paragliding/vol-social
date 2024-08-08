import React, { useState } from 'react'
import styled from 'styled-components'

const StatsContainer = styled.div`
  .flight-stats {
    display: grid;
    grid-template-columns: ${(props) =>
      props.expanded
        ? 'repeat(auto-fit, minmax(120px, 1fr))'
        : 'repeat(6, auto)'};
    gap: 10px;
    color: #fff;
    margin-bottom: ${(props) => (props.expanded ? '10px' : '0')};
    transition: height 0.5s ease 0.05s;
    height: ${(props) => (props.expanded ? '175px' : '40px')};

    .stat {
      display: flex;
      flex-direction: column;
      height: fit-content;

      &-value {
        font-weight: bold;
        font-size: 16px;
      }

      &-label {
        font-size: 12px;
        color: #999;
      }
    }

    .expand-stats {
      grid-column: ${(props) => (props.expanded ? 'auto' : '6 / 7')};
      justify-self: end;
      font-size: 14px;
      color: var(--theme-color);
      background: none;
      border: none;
      cursor: pointer;
      align-self: center;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

const FlightStats = ({ igc }) => {
  const [expanded, setExpanded] = useState(false)

  if (!igc?.data) return null

  const handleToggleExpand = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded(!expanded)
  }

  const calculateRouteDistance = (score, classification) => {
    const scoringSystem = {
      'Free flight': 1.0,
      'Free triangle': 1.2,
      'FAI Triangle': 1.4,
      'Closed free triangle': 1.4,
      'Closed FAI triangle': 1.6,
    }

    return Math.floor(score / (scoringSystem[classification] || 1))
  }

  const routeDistance = calculateRouteDistance(
    igc.data.score,
    igc.data.classification
  )

  return (
    <StatsContainer expanded={expanded}>
      <div className="flight-stats" onClick={(e) => e.stopPropagation()}>
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{Math.trunc(igc.data.score)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Route distance</span>
          <span className="stat-value">{routeDistance} km</span>
        </div>
        <div className="stat">
          <span className="stat-label">Route time</span>
          <span className="stat-value">{igc.data.routeDuration}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Route avg</span>
          <span className="stat-value">
            {Math.floor(igc.data.avgSpeed)} km/h
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Flight time</span>
          <span className="stat-value">{igc.data.flightDuration}</span>
        </div>
        {expanded && (
          <>
            <div className="stat">
              <span className="stat-label">Free Distance</span>
              <span className="stat-value">
                {Math.floor(igc.data.freeDistance)} km
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Flight avg</span>
              <span className="stat-value">
                {Math.floor(igc.data.avgSpeed)} km/h
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Max climb</span>
              <span className="stat-value">{igc.data.maxClimb} m/s</span>
            </div>
            <div className="stat">
              <span className="stat-label">Max sink</span>
              <span className="stat-value">{igc.data.maxSink} m/s</span>
            </div>
            <div className="stat">
              <span className="stat-label">Max alt</span>
              <span className="stat-value">{igc.data.maxAltitude} m</span>
            </div>
            <div className="stat">
              <span className="stat-label">Max speed</span>
              <span className="stat-value">
                {Math.floor(igc.data.maxSpeed)} km/h
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Tracklog length</span>
              <span className="stat-value">
                {Math.floor(igc.data.totalDistance)} km
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Score type</span>
              <span style={{ fontSize: '12px' }} className="stat-value">
                {igc.data.classification}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Wing</span>
              <span style={{ fontSize: '12px' }} className="stat-value">
                {igc.data.gliderType}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Date</span>
              <span style={{ fontSize: '14px' }} className="stat-value">
                {igc.data.date}
              </span>
            </div>
          </>
        )}
        <button className="expand-stats" onClick={handleToggleExpand}>
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </StatsContainer>
  )
}

export default FlightStats
