import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
const auth = getAuth();

// ✅ Define History Type
interface History {
    id: string;
    matchUp: string;
    date: Date | null;
    result: string;
    move: number;
    TimeControl: string | null;
    action: string | null;
  }

/**
 * Create a new user document in Firestore
 */
export const createUserProfile = async (uid: string, name: string, email: string) => {
  try {
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      rating: 0, // User selects later
    });
    console.log("User profile created successfully.");
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

/**
 * Set the user's rating in Firestore
 */
export const setUserRating = async (uid: string, ratingScore: number) => {
    try {
      console.log(`Saving rating score "${ratingScore}" for user ${uid}`);
  
      await setDoc(doc(db, "users", uid), { rating: ratingScore }, { merge: true });
  
      console.log("Firestore: Course saved successfully!");
    } catch (error) {
      console.error("Firestore: Error saving course:", error);
    }
  };

/**
 * Add a history for a user
 */
export const addUserHistory = async (uid: string, historyData: Omit<History, 'id'>) => {
  try {
    const historyCollectionRef = collection(db, "users", uid, "history");
    await addDoc(historyCollectionRef, historyData);
    console.log("User history added successfully.");
  } catch (error) {
    console.error("Error adding user history:", error);
  }
}

/**
 * Update history proficiency
 */
export const updateHistoryProficiency = async (uid: string, historyId: string, updatedData: Partial<History>) => {
  try {
    await updateDoc(doc(db, "users", uid, "history", historyId), updatedData);
    console.log("History proficiency updated successfully.");
  } catch (error) {
    console.error("Error updating history proficiency:", error);
  }
};

/**
 * Get user profile details from Firestore
 */
export const getUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data(); // Returns { name: "Tomás", email: "tomas@example.com", ... }
      } else {
        return null; // User does not exist
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  /**
 * Get the user's rating and histories from Firestore
 */
export const getUserRatingAndHistories = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        return null; // User does not exist
      }
  
      const userData = userDoc.data();
      const rating = userData?.rating || 0;
  
      const historiesSnapshot = await getDocs(collection(db, "users", uid, "history"));
      const histories: History[] = [];
  
      historiesSnapshot.forEach((doc) => {
        histories.push({ id: doc.id, ...(doc.data() as Omit<History, 'id'>) });
      });
  
      return { rating, histories };
    } catch (error) {
      console.error("Error fetching user rating and histories:", error);
      return null;
    }
  };

  /**
 * Get history by ID for a user
 */
export const getHistoryById = async (uid: string, historyId: string) => {
    try {
      const historyDoc = await getDoc(doc(db, "users", uid, "history", historyId));
      if (historyDoc.exists()) {
        return { id: historyDoc.id, ...(historyDoc.data() as Omit<History, 'id'>) };
      } else {
        return null; // History does not exist
      }
    } catch (error) {
      console.error("Error fetching history by ID:", error);
      return null;
    }
  }
  
/**
 * Update history description for a user
 */
export const updateHistoryDescription = async (uid: string, historyId: string, description: string) => {
  try {
    await updateDoc(doc(db, "users", uid, "history", historyId), { description });
    console.log("History description updated successfully.");
  } catch (error) {
    console.error("Error updating history description:", error);
  }
};
  