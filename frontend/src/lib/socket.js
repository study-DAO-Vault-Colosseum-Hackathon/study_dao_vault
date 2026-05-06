import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// We initialize the socket once to avoid multiple connections
export const socket = io(SOCKET_URL, {
  autoConnect: false, // Better for performance; connect manually in hooks
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});