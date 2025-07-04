import { useEffect, useState } from 'react'
import socket from 'src/socket'

interface UseSocketStatusProps {
  onReconnect?: () => void
}

export const useSocketStatus = ({ onReconnect }: UseSocketStatusProps = {}) => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected)

  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected')
      setIsConnected(true)
      onReconnect?.()
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [onReconnect])

  return isConnected
}
