import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`

const TooltipText = styled.span`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  width: max-content;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 15px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`

const TruncateTooltip = ({ text, maxLength, className }) => {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true)
    }, 1000)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  if (text.length <= maxLength) return <span>{text}</span>

  return (
    <TooltipContainer
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{text.slice(0, maxLength) + '...'}</span>
      <TooltipText className="tooltipText" visible={visible}>
        {text}
      </TooltipText>
    </TooltipContainer>
  )
}

export default TruncateTooltip
