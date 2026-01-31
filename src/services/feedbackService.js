import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";

export const feedbackService = {
  async getFeedbacks() {
    try {
      const q = query(collection(db, "complaints"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error reading feedbacks from Firestore:', error);
      return [];
    }
  },

  async getFeedbackById(id) {
    // Ideally use getDoc, but for now we can filter from all or implement getDoc if needed.
    // Given the current usage pattern, let's keep it simple or implement optimized fetch.
    // However, existing calls might expect this to be cheap. 
    // Fetching single doc is better.
    // But `id` in existing app was `feedback-timestamp`.
    // In firestore `id` is docId.
    // If we filter, we use `where` if 'id' is a field, or `doc(db, 'complaints', id)` if it's the key.
    // To match current logic:
    // If we use auto-generated ID in createFeedback, we should use that.
    // Let's assume we use doc ID.
    const feedbacks = await this.getFeedbacks();
    return feedbacks.find(f => f.id === id);
  },

  async getFeedbacksByUserId(userId) {
    try {
      const q = query(collection(db, "complaints"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const feedbacks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return feedbacks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error getting user feedbacks:', error);
      return [];
    }
  },

  async createFeedback(feedbackData) {
    try {
      const newFeedback = {
        ...feedbackData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminResponse: null
      };

      const docRef = await addDoc(collection(db, "complaints"), newFeedback);
      return { id: docRef.id, ...newFeedback };
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  },

  async updateFeedbackStatus(id, status, adminResponse = null) {
    try {
      const feedbackRef = doc(db, "complaints", id);
      await updateDoc(feedbackRef, {
        status,
        adminResponse,
        updatedAt: new Date().toISOString()
      });
      // Return updated object locally or fetch it.
      // Returning mock updated object for UI updates.
      return { id, status, adminResponse };
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  },

  async deleteFeedback(id) {
    try {
      await deleteDoc(doc(db, "complaints", id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }
};


