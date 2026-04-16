"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type Notification = {
  id: string;
  title: string;
  content: string;
  expiryDate?: string;
  read: boolean;
  timestamp?: Date;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
};

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      
      const newNotifications = [newNotification, ...state.notifications];
      const unreadCount = newNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: newNotifications,
        unreadCount,
      };
    }
    
    case 'REMOVE_NOTIFICATION': {
      const newNotifications = state.notifications.filter(n => n.id !== action.payload);
      const unreadCount = newNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: newNotifications,
        unreadCount,
      };
    }
    
    case 'MARK_AS_READ': {
      const newNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      const unreadCount = newNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: newNotifications,
        unreadCount,
      };
    }
    
    case 'MARK_ALL_AS_READ': {
      const newNotifications = state.notifications.map(n => ({ ...n, read: true }));
      
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: 0,
      };
    }
    
    case 'CLEAR_ALL':
      return { notifications: [], unreadCount: 0 };
    
    default:
      return state;
  }
}

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
} | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// Export convenience functions that match the old Zustand interface
export function useNotificationStore() {
  const { state, dispatch } = useNotification();
  
  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    markAsRead: (id: string) => dispatch({ type: 'MARK_AS_READ', payload: id }),
    markAllAsRead: () => dispatch({ type: 'MARK_ALL_AS_READ' }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    
    // For backward compatibility with the existing code that uses getState()
    getState: () => ({
      notifications: state.notifications,
      unreadCount: state.unreadCount,
      addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => 
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    }),
  };
}
