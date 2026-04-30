// frontend/src/QA.jsx
import React from "react";
import { useSocket } from "../hooks/useSocket";

const QA = () => {
  const { isConnected, vaultEvents, emitEvent } = useSocket();

  const handlePing = () => {
    emitEvent("ping_vault", { 
      user: "Samit", 
      timestamp: new Date().toISOString() 
    });
  };

  return (
    <div>
      <h1>Study DAO Vault: Live Feed</h1>
      
      {/* Connection Status Indicator */}
      <div>
        Status: <strong>{isConnected ? "Connected" : "Disconnected"}</strong>
      </div>

      <button onClick={handlePing}>
        Send Test Signal to Backend
      </button>

      <hr />

      <section>
        <h2>Real-Time Logs</h2>
        {vaultEvents.length === 0 ? (
          <p>No activity detected yet...</p>
        ) : (
          <ul>
            {vaultEvents.map((event, index) => (
              <li key={index}>
                <pre>{JSON.stringify(event, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default QA;