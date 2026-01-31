import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";

export const authService = {
  // Initialize default admin user if not exists
  async initializeDefaultAdmin() {
    try {
      // PATH CHANGED: users/admins/accounts
      const q = query(collection(db, "users", "admins", "accounts"), where("role", "==", "admin"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const defaultAdmin = {
          email: 'admin@svu.edu',
          password: 'admin123', // In production, this should be hashed
          role: 'admin',
          name: 'Administrator',
          adminId: 'admin-1',
          createdAt: new Date().toISOString()
        };
        // PATH CHANGED: users/admins/accounts
        await addDoc(collection(db, "users", "admins", "accounts"), defaultAdmin);
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
    }
  },

  async getAllStudents() {
    try {
      // PATH CHANGED: users/students/accounts
      const q = query(collection(db, "users", "students", "accounts"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting students:", error);
      return [];
    }
  },

  async register(userData) {
    try {
      // Check if user exists in students subsection
      // PATH CHANGED: users/students/accounts
      const q = query(collection(db, "users", "students", "accounts"), where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('User already exists with this email');
      }

      const newUser = {
        email: userData.email,
        password: userData.password, // In production, hash this
        role: 'student',
        name: userData.name,
        studentId: userData.studentId,
        course: userData.course,
        gender: userData.gender,
        createdAt: new Date().toISOString()
      };

      // PATH CHANGED: users/students/accounts
      const docRef = await addDoc(collection(db, "users", "students", "accounts"), newUser);
      const userWithId = { id: docRef.id, ...newUser };

      // Auto login after registration
      this.setCurrentUser(userWithId);
      return userWithId;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async registerAdmin(userData) {
    try {
      // Check if user exists in admins subsection
      // PATH CHANGED: users/admins/accounts
      const q = query(collection(db, "users", "admins", "accounts"), where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('User already exists with this email');
      }

      const newAdmin = {
        email: userData.email,
        password: userData.password, // In production, hash this
        role: 'admin',
        name: userData.name,
        adminId: userData.adminId,
        gender: userData.gender,
        createdAt: new Date().toISOString()
      };

      // PATH CHANGED: users/admins/accounts
      const docRef = await addDoc(collection(db, "users", "admins", "accounts"), newAdmin);
      return { id: docRef.id, ...newAdmin };
    } catch (error) {
      console.error('Error registering admin:', error);
      throw error;
    }
  },

  async login(email, password) {
    await this.initializeDefaultAdmin(); // Ensure admin exists
    try {
      // Check students first
      // PATH CHANGED: users/students/accounts
      const studentQuery = query(collection(db, "users", "students", "accounts"), where("email", "==", email), where("password", "==", password));
      const studentSnapshot = await getDocs(studentQuery);

      if (!studentSnapshot.empty) {
        const userDoc = studentSnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        this.setCurrentUser(user);
        return user;
      }

      // Check admins if not found in students
      // PATH CHANGED: users/admins/accounts
      const adminQuery = query(collection(db, "users", "admins", "accounts"), where("email", "==", email), where("password", "==", password));
      const adminSnapshot = await getDocs(adminQuery);

      if (!adminSnapshot.empty) {
        const userDoc = adminSnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        this.setCurrentUser(user);
        return user;
      }

      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  setCurrentUser(user) {
    try {
      // Don't store password in session
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading current user from localStorage:', error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  // Reset all data for testing purposes
  async clearAllData() {
    try {
      localStorage.clear();
      console.log("LocalStorage cleared");

      // Helper to delete all docs in a collection/query
      const deleteAllInQuery = async (q, name) => {
        const snapshot = await getDocs(q);
        const deletions = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletions);
        console.log(`Deleted all ${name}`);
      };

      // 1. Delete Students (users/students/accounts)
      await deleteAllInQuery(query(collection(db, "users", "students", "accounts")), "students");

      // 2. Delete Admins (users/admins/accounts)
      await deleteAllInQuery(query(collection(db, "users", "admins", "accounts")), "admins");

      // 3. Delete Complaints
      await deleteAllInQuery(query(collection(db, "complaints")), "complaints");

      // 4. Delete Feedback Posts
      await deleteAllInQuery(query(collection(db, "feedback_posts")), "feedback posts");

      console.log("All Firebase data reset successfully");
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  }
};
