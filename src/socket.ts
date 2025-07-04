import { io } from 'socket.io-client'

const socket = io('http://localhost:3002', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 5000,
})

export default socket
