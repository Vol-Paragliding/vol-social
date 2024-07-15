import { createElement } from 'react'

const MAX_LINK_LENGTH = 150

export function formatStringWithLink(text, linkClass, noLink = false) {
  const regex = /((https?:\/\/\S*)|(#\S*)|(@\S*))/gi
  const parts = []
  let lastIndex = 0

  let match
  while ((match = regex.exec(text)) !== null) {
    const { index } = match

    if (index > lastIndex) {
      const plainText = text.substring(lastIndex, index)
      const plainTextParts = plainText.split('\n')
      plainTextParts.forEach(((lastIndex) => {
        return (part, idx) => {
          if (idx > 0) {
            parts.push(createElement('br', { key: `br-${lastIndex}-${idx}` }))
          }
          parts.push(part)
        }
      })(lastIndex))
    }

    let url, label
    if (match[0].startsWith('#')) {
      // it is a hashtag
      url = match[0]
      label = match[0]
    } else if (match[0].startsWith('@')) {
      // it is a mention
      url = `/${match[0].replace('@', '')}`
      label = match[0]
    } else {
      // it is a link
      url = match[0]
      label = url.replace('https://', '')

      if (label.length > MAX_LINK_LENGTH) {
        label = `${label.slice(0, MAX_LINK_LENGTH)}...`
      }
    }

    const tag = noLink ? 'span' : 'a'

    parts.push(
      createElement(
        tag,
        {
          className: noLink ? '' : linkClass,
          href: !noLink ? url : undefined,
          key: index,
        },
        label
      )
    )

    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex)
    const remainingTextParts = remainingText.split('\n')
    remainingTextParts.forEach((part, idx) => {
      if (idx > 0) {
        parts.push(createElement('br', { key: `br-${lastIndex}-${idx}` }))
      }
      parts.push(part)
    })
  }

  return parts
}
