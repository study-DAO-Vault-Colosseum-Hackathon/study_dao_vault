import React, { createContext, useEffect, useState } from 'react';
import { socket } from '../lib/socket';

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
  vaultEvents: [],
  emitEvent: () => {},
});

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [vaultEvents, setVaultEvents] = useState([]);

  useEffect(() => {
    // Connect to server
    socket.connect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onVaultUpdate(data) {
      setVaultEvents((prev) => [data, ...prev]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("vault_update", onVaultUpdate);

    // CLEANUP: Essential to prevent memory leaks in React 19
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("vault_update", onVaultUpdate);
      socket.disconnect();
    };
  }, []);

  const emitEvent = (eventName, data) => {
    if (socket.connected) {
      socket.emit(eventName, data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, vaultEvents, emitEvent }}>
      {children}
    </SocketContext.Provider>
  );
};