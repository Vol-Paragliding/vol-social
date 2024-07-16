import React, { useRef, useEffect, forwardRef } from 'react'
import { StatusUpdateForm } from 'react-activity-feed'
import 'react-activity-feed/dist/index.css'
import styled from 'styled-components'

const StyledStatusUpdateForm = styled(StatusUpdateForm)`
  .raf-panel-header {
    border-bottom: 1px solid #333;
    padding: 5px;
  }

  .raf-button--primary {
    background-color: var(--theme-color);
    color: black;
    border-radius: 30px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--faded-theme-color);
    }
  }

  .rta__textarea {
    background-color: black;
    border: none;
    padding: 15px;
    font-size: 20px;
    font-weight: 500;
    color: #e0e0e0;
    resize: none; /* Prevent manual resize */
    overflow: hidden; /* Hide scrollbar initially */

    &:focus {
      background-color: black;
      outline: 2px solid var(--theme-color);
      border-radius: 3px;
    }
  }
`

const CustomTextarea = forwardRef(({ emojiData, innerRef, ...props }, ref) => {
  const textareaRef = useRef(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [])

  const handleInput = (event) => {
    adjustHeight()
    if (props.onChange) props.onChange(event)
  }

  return (
    <textarea
      {...props}
      placeholder="Share a flight!"
      className="rta__textarea"
      ref={(node) => {
        textareaRef.current = node
        if (ref) ref.current = node
      }}
      style={{ flex: 1 }}
      onInput={handleInput}
    />
  )
})

const CreatePostForm = (props) => {
  return <StyledStatusUpdateForm {...props} Textarea={CustomTextarea} />
}

export default CreatePostForm
