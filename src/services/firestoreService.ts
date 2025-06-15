import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GreenBean, RoastingProfile, RoastingSession, Sale, Notification } from '../types';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  if (timestamp && typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

// Green Beans
export const addGreenBean = async (greenBean: Omit<GreenBean, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'greenBeans'), {
      ...greenBean,
      entryDate: Timestamp.fromDate(greenBean.entryDate)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding green bean:', error);
    throw error;
  }
};

export const updateGreenBean = async (id: string, greenBean: Partial<GreenBean>): Promise<void> => {
  try {
    const docRef = doc(db, 'greenBeans', id);
    const updateData = { ...greenBean };
    
    if (greenBean.entryDate) {
      updateData.entryDate = Timestamp.fromDate(greenBean.entryDate);
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating green bean:', error);
    throw error;
  }
};

export const deleteGreenBean = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'greenBeans', id));
  } catch (error) {
    console.error('Error deleting green bean:', error);
    throw error;
  }
};

export const getGreenBeans = async (): Promise<GreenBean[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'greenBeans'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      entryDate: convertTimestamp(doc.data().entryDate)
    })) as GreenBean[];
  } catch (error) {
    console.error('Error getting green beans:', error);
    throw error;
  }
};

// Roasting Profiles
export const addRoastingProfile = async (profile: Omit<RoastingProfile, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'roastingProfiles'), {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding roasting profile:', error);
    throw error;
  }
};

export const updateRoastingProfile = async (id: string, profile: Partial<RoastingProfile>): Promise<void> => {
  try {
    const docRef = doc(db, 'roastingProfiles', id);
    const updateData = { ...profile };
    
    if (profile.createdAt) {
      updateData.createdAt = Timestamp.fromDate(profile.createdAt);
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating roasting profile:', error);
    throw error;
  }
};

export const deleteRoastingProfile = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'roastingProfiles', id));
  } catch (error) {
    console.error('Error deleting roasting profile:', error);
    throw error;
  }
};

export const getRoastingProfiles = async (): Promise<RoastingProfile[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'roastingProfiles'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt)
    })) as RoastingProfile[];
  } catch (error) {
    console.error('Error getting roasting profiles:', error);
    throw error;
  }
};

// Roasting Sessions
export const addRoastingSession = async (session: Omit<RoastingSession, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'roastingSessions'), {
      ...session,
      roastDate: Timestamp.fromDate(session.roastDate)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding roasting session:', error);
    throw error;
  }
};

export const getRoastingSessions = async (): Promise<RoastingSession[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'roastingSessions'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      roastDate: convertTimestamp(doc.data().roastDate)
    })) as RoastingSession[];
  } catch (error) {
    console.error('Error getting roasting sessions:', error);
    throw error;
  }
};

// Sales
export const addSale = async (sale: Omit<Sale, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'sales'), {
      ...sale,
      saleDate: Timestamp.fromDate(sale.saleDate)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
};

export const getSales = async (): Promise<Sale[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      saleDate: convertTimestamp(doc.data().saleDate)
    })) as Sale[];
  } catch (error) {
    console.error('Error getting sales:', error);
    throw error;
  }
};

// Notifications
export const addNotification = async (notification: Omit<Notification, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      timestamp: Timestamp.fromDate(notification.timestamp)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: convertTimestamp(doc.data().timestamp)
    })) as Notification[];
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};