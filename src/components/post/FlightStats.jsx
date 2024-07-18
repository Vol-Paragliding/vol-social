import React, { useState } from 'react'
import styled from 'styled-components'

const StatsContainer = styled.div`
  .flight-stats {
    display: flex;
    justify-content: space-between;
    align-content: space-around;
    flex-wrap: wrap;
    min-height: ${(props) => (props.expanded ? '140px' : '40px')};
    color: #fff;
    margin-bottom: 10px;
    transition: min-height 0.5s ease;

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

    .expand-stats {
      font-size: 14px;
      color: var(--theme-color);
      background: none;
      border: none;
      cursor: pointer;
      margin-top: 10px;

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

  return (
    <StatsContainer expanded={expanded}>
      <div className="flight-stats" onClick={(e) => e.stopPropagation()}>
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
          <span className="stat-value">
            {Math.round(igc.data.avgSpeed)} km/h
          </span>
        </div>
        {expanded && (
          <>
            <div className="stat">
              <span className="stat-label">Date</span>
              <span className="stat-value">{igc.data.date}</span>
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
