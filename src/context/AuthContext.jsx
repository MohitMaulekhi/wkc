import  { useState, useEffect } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { AuthContext } from "./UseAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../services/firebase";



export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await initializeUser(user);
    });

    return () => unsubscribe();
  }, []);

  const initializeUser = async (user) => {
    setLoading(true);
    if (user) {
      try {
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...userData,
          });
        } else {
          // User exists in Auth but not in Firestore - create basic profile
          console.warn("User exists in Auth but not in Firestore, creating basic profile");
          const basicUserData = {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || 'User',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            userType: 'seller', // Default to seller
            companyName: 'Individual Seller',
            phone: user.phoneNumber || '',
            address: '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "users", user.uid), basicUserData);
          
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...basicUserData,
          });
        }
        setUserLoggedIn(true);
      } catch (error) {
        console.error("Error initializing user:", error);
        // Set basic user data even if Firestore fails
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || 'User',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          userType: 'seller',
          companyName: 'Individual Seller',
        });
        setUserLoggedIn(true);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const { email, password, ...additionalData } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      const userProfileData = {
        email: user.email,
        ...additionalData,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userProfileData);

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        ...userProfileData,
      });

      setUserLoggedIn(true);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          ...userData,
        });
      } else {
        console.warn("User document not found in Firestore, creating basic profile");
        // Create basic profile if document doesn't exist
        const basicUserData = {
          email: user.email,
          firstName: 'User',
          lastName: '',
          userType: 'seller',
          companyName: 'Individual Seller',
          phone: '',
          address: '',
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", user.uid), basicUserData);
        
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          ...basicUserData,
        });
      }
      setUserLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (userType) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        // User exists, just update the data
        const userData = userDoc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          ...userData,
        });
      } else {
        // New user, create profile
        const userData = {
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || 'User',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          userType: userType,
          companyName: userType === 'walmart' ? 'Walmart' : 'Individual Seller',
          phone: user.phoneNumber || '',
          address: '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", user.uid), userData);
        
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          ...userData,
        });
      }

      setUserLoggedIn(true);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
      setUserLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear the local state
      setCurrentUser(null);
      setUserLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };
  const value = {
    currentUser,
    userLoggedIn,
    setCurrentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};