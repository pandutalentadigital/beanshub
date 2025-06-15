import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getCurrentUser } from '../services/authService';
import { 
  getGreenBeans, 
  getRoastingProfiles, 
  getRoastingSessions, 
  getSales, 
  getNotifications 
} from '../services/firestoreService';
import { User, GreenBean, RoastingProfile, RoastingSession, Sale, Notification } from '../types';

interface AppState {
  user: User | null;
  users: User[];
  greenBeans: GreenBean[];
  roastingProfiles: RoastingProfile[];
  roastingSessions: RoastingSession[];
  sales: Sale[];
  notifications: Notification[];
  loading: boolean;
  initialized: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_GREEN_BEANS'; payload: GreenBean[] }
  | { type: 'SET_ROASTING_PROFILES'; payload: RoastingProfile[] }
  | { type: 'SET_ROASTING_SESSIONS'; payload: RoastingSession[] }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_GREEN_BEAN'; payload: GreenBean }
  | { type: 'UPDATE_GREEN_BEAN'; payload: GreenBean }
  | { type: 'DELETE_GREEN_BEAN'; payload: string }
  | { type: 'ADD_ROASTING_PROFILE'; payload: RoastingProfile }
  | { type: 'UPDATE_ROASTING_PROFILE'; payload: RoastingProfile }
  | { type: 'DELETE_ROASTING_PROFILE'; payload: string }
  | { type: 'ADD_ROASTING_SESSION'; payload: RoastingSession }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

const initialState: AppState = {
  user: null,
  users: [],
  greenBeans: [],
  roastingProfiles: [],
  roastingSessions: [],
  sales: [],
  notifications: [],
  loading: true,
  initialized: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    case 'SET_GREEN_BEANS':
      return { ...state, greenBeans: action.payload };
    case 'SET_ROASTING_PROFILES':
      return { ...state, roastingProfiles: action.payload };
    case 'SET_ROASTING_SESSIONS':
      return { ...state, roastingSessions: action.payload };
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'ADD_GREEN_BEAN':
      return { ...state, greenBeans: [...state.greenBeans, action.payload] };
    case 'UPDATE_GREEN_BEAN':
      return {
        ...state,
        greenBeans: state.greenBeans.map(bean =>
          bean.id === action.payload.id ? action.payload : bean
        )
      };
    case 'DELETE_GREEN_BEAN':
      return {
        ...state,
        greenBeans: state.greenBeans.filter(bean => bean.id !== action.payload)
      };
    case 'ADD_ROASTING_PROFILE':
      return { ...state, roastingProfiles: [...state.roastingProfiles, action.payload] };
    case 'UPDATE_ROASTING_PROFILE':
      return {
        ...state,
        roastingProfiles: state.roastingProfiles.map(profile =>
          profile.id === action.payload.id ? action.payload : profile
        )
      };
    case 'DELETE_ROASTING_PROFILE':
      return {
        ...state,
        roastingProfiles: state.roastingProfiles.filter(profile => profile.id !== action.payload)
      };
    case 'ADD_ROASTING_SESSION':
      return { ...state, roastingSessions: [...state.roastingSessions, action.payload] };
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        if (firebaseUser) {
          // User is signed in
          const user = await getCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
          
          // Load user data from Firestore
          if (user) {
            await loadUserData(user.id);
          }
        } else {
          // User is signed out
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load all data in parallel
      const [greenBeans, roastingProfiles, roastingSessions, sales, notifications] = await Promise.all([
        getGreenBeans(),
        getRoastingProfiles(),
        getRoastingSessions(),
        getSales(),
        getNotifications(userId)
      ]);

      dispatch({ type: 'SET_GREEN_BEANS', payload: greenBeans });
      dispatch({ type: 'SET_ROASTING_PROFILES', payload: roastingProfiles });
      dispatch({ type: 'SET_ROASTING_SESSIONS', payload: roastingSessions });
      dispatch({ type: 'SET_SALES', payload: sales });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}