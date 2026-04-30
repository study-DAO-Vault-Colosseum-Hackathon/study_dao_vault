import { useState, useEffect } from "react";
import { socket } from "../lib/socket";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [vaultEvents, setVaultEvents] = useState([]);

  useEffect(() => {
    // 1. Manually connect
    socket.connect();

    // 2. Define internal event handlers
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onVaultUpdate(data) {
      // Functional update to ensure we have the latest state without closure issues
      setVaultEvents((prev) => [...prev, data]);
    }

    // 3. Register listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("vault_update", onVaultUpdate);

    // 4. Cleanup: Remove listeners when component unmounts
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("vault_update", onVaultUpdate);
      socket.disconnect();
    };
  }, []);

  // Logic to send data back to server
  const emitEvent = (eventName, payload) => {
    socket.emit(eventName, payload);
  };

  return { isConnected, vaultEvents, emitEvent };
};