export const sanitizeInput = (input) => {
  const trimmedInput = input.trim()

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput)

  if (isEmail) {
    return { sanitized: trimmedInput, error: '', isEmail: true }
  } else {
    const allowedChars = /^[a-zA-Z0-9_.-]+$/
    if (!allowedChars.test(trimmedInput)) {
      return {
        sanitized: '',
        error: 'Input contains invalid characters.',
        isEmail: false,
      }
    }
    return { sanitized: trimmedInput, error: '', isEmail: false }
  }
}
