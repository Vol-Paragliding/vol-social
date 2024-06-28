export const sanitizeInput = (input) => {
  const trimmedInput = input.trim();
  const allowedChars = /^[a-zA-Z0-9_.-]+$/;
  if (!allowedChars.test(trimmedInput)) {
    return { sanitized: "", error: "Input contains invalid characters." };
  }
  return { sanitized: trimmedInput, error: "" };
};
