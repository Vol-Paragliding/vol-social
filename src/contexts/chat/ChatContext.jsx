import React, { createContext, useEffect, useState } from 'react'
import { StreamChat } from 'stream-chat'
import { useAuth } from '../auth/useAuth'

const apiKey = process.env.REACT_APP_API_KEY;

export const ChatContext = createContext(null)

export const ChatProvider = ({ children }) => {
  const { authState } = useAuth()
  const [chatClient, setChatClient] = useState(null)

  useEffect(() => {
    const initializeChatClient = async () => {
      if (authState.isAuthenticated && authState.authUser) {
        const client = StreamChat.getInstance(apiKey)
        if (!client.userID) {
          await client.connectUser(
            {
              id: authState.authUser.userId,
              name: authState.authUser.username,
            },
            authState.authUser.chatToken
          )
          setChatClient(client)
        } else {
          setChatClient(client)
        }
      }
    }

    initializeChatClient()

    return () => {
      if (chatClient) {
        chatClient.disconnectUser()
      }
    }
  }, [authState.isAuthenticated, authState.authUser, chatClient])

  return (
    <ChatContext.Provider value={{ chatClient }}>
      {children}
    </ChatContext.Provider>
  )
}
