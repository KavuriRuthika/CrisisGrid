import React, { createContext, useContext, useEffect, useState } from 'react';

interface EventMessage {
  type: string;
  data: any;
}

interface WebSocketContextType {
  isConnected: boolean;
  lastEvent: EventMessage | null;
  notifications: Array<{ id: string; title: string; message: string; type: string }>;
  removeNotification: (id: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<EventMessage | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; type: string }>>([]);

  const addToast = (title: string, message: string, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [{ id, title, message, type }, ...prev.slice(0, 5)]);
    setTimeout(() => {
      removeNotification(id);
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connect = () => {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const parsed: EventMessage = JSON.parse(event.data);
          setLastEvent(parsed);

          if (parsed.type === 'INCIDENT_CREATED') {
            addToast('🚨 New Incident Reported', `${parsed.data.title} (${parsed.data.severity})`, 'critical');
          } else if (parsed.type === 'EMERGENCY_ALERT_BROADCAST') {
            addToast('📢 EMERGENCY ALERT BROADCAST', parsed.data.title, 'critical');
          } else if (parsed.type === 'RESOURCE_ASSIGNED') {
            addToast('🚑 Resource Dispatched', `Assigned to Incident #${parsed.data.incident_id}`, 'info');
          } else if (parsed.type === 'SENSOR_READING_UPDATED' && parsed.data.status === 'CRITICAL') {
            addToast('⚠️ Sensor Threshold Exceeded', parsed.data.message, 'warning');
          }
        } catch (e) {
          console.error("WS message parse error:", e);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 4000);
      };

      socket.onerror = () => {
        setIsConnected(false);
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastEvent, notifications, removeNotification }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
};
