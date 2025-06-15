import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'Admin' | 'Roaster' | 'Staff';
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData): Promise<User> => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = userCredential.user;

    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: data.name
    });

    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email: data.email,
      name: data.name,
      role: data.role || 'Staff',
      phone: data.phone,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: userData.createdAt.toISOString(),
      lastLogin: userData.lastLogin?.toISOString()
    });

    return userData;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
};

export const signIn = async (data: SignInData): Promise<User> => {
  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();
    
    // Update last login
    const updatedUserData: User = {
      id: firebaseUser.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      isActive: userData.isActive,
      createdAt: new Date(userData.createdAt),
      lastLogin: new Date()
    };

    // Update last login in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      lastLogin: new Date().toISOString()
    }, { merge: true });

    return updatedUserData;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;
  
  if (!firebaseUser) {
    return null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    
    return {
      id: firebaseUser.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      isActive: userData.isActive,
      createdAt: new Date(userData.createdAt),
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : null
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};