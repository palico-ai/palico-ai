import React, { useEffect, useMemo } from 'react'

export interface ChatInputProps {
  onSend: (message: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  placeholder = 'Type a message'
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    try {
      setLoading(true)
      await onSend(message)
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value)
  }
  const enableInput = useMemo(() => !loading && !disabled, [loading, disabled])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }, [inputRef, enableInput])

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
        autoComplete='off'
        disabled={!enableInput}
        placeholder={placeholder}
        ref={inputRef}
        type="text"
        value={message}
        onChange={handleChange}
      />
    </form>
  )
}
