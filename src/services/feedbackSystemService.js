import { db } from "../firebase";
import { collection, addDoc, getDocs, query, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

export const feedbackSystemService = {
    // Get all feedback posts
    async getFeedbackPosts() {
        try {
            const q = query(collection(db, "feedback_posts"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error reading feedback posts from Firestore:', error);
            return [];
        }
    },

    // Get feedback post by ID
    async getFeedbackPostById(id) {
        try {
            // For simplicity, fetching all or using getDoc if we had efficient way to know paths
            const docRef = doc(db, "feedback_posts", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return undefined;
        } catch (error) {
            console.error('Error getting feedback post:', error);
            return undefined;
        }
    },

    // Get feedback posts visible to a specific student
    async getFeedbackPostsForStudent(studentId) {
        try {
            const posts = await this.getFeedbackPosts();
            return posts.filter(post => {
                // Show if targeted to all students or specifically to this student
                return post.targetAudience === 'all' ||
                    (post.targetAudience === 'specific' && post.targetStudentIds && post.targetStudentIds.includes(studentId));
            }).sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA;
            });
        } catch (error) {
            return [];
        }
    },

    // Create new feedback post (admin only)
    async createFeedbackPost(postData) {
        try {
            const newPost = {
                ...postData,
                ratings: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                statistics: {
                    totalRatings: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                }
            };
            const docRef = await addDoc(collection(db, "feedback_posts"), newPost);
            return { id: docRef.id, ...newPost };
        } catch (error) {
            console.error('Error creating feedback post:', error);
            throw error;
        }
    },

    // Update feedback post (admin only)
    async updateFeedbackPost(id, updateData) {
        try {
            const postRef = doc(db, "feedback_posts", id);
            await updateDoc(postRef, {
                ...updateData,
                updatedAt: new Date().toISOString()
            });
            return { id, ...updateData }; // Approximation
        } catch (error) {
            console.error('Error updating feedback post:', error);
            throw error;
        }
    },

    // Delete feedback post (admin only)
    async deleteFeedbackPost(id) {
        try {
            await deleteDoc(doc(db, "feedback_posts", id));
        } catch (error) {
            console.error('Error deleting feedback post:', error);
            throw error;
        }
    },

    // Check if student has already rated a post
    async hasStudentRated(postId, studentId) {
        const post = await this.getFeedbackPostById(postId);
        if (!post || !post.ratings) return false;
        return post.ratings.some(r => r.studentId === studentId);
    },

    // Get student's rating for a post
    async getStudentRating(postId, studentId) {
        const post = await this.getFeedbackPostById(postId);
        if (!post || !post.ratings) return null;
        return post.ratings.find(r => r.studentId === studentId);
    },

    // Submit or update rating (student only)
    async submitRating(postId, studentId, studentName, rating, comment = '') {
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        try {
            // In firestore, we should probably have a subcollection for ratings to be scalable,
            // but to minimize schema change drift from localstorage implementation where it was embedded array:
            // We will try to update the array. Note: Firestore has limit on document size (1MB).
            // If ratings are many, this crashes.
            // BETTER APPROACH: Use a subcollection `ratings` under the post doc.
            // However, that changes the Read logic significantly (need to fetch subcollection).
            // Given this is a prototype/mvp, we will stick to array if small, OR BETTER:
            // Let's use array for now to match `getFeedbackPostById` logic which expects `ratings` in the object.
            // To do this atomically, we need a transaction or get-modify-update.

            const postRef = doc(db, "feedback_posts", postId);
            const postSnap = await getDoc(postRef);

            if (!postSnap.exists()) throw new Error("Post not found");

            const postData = postSnap.data();
            const ratings = postData.ratings || [];

            const existingRatingIndex = ratings.findIndex(r => r.studentId === studentId);

            const ratingData = {
                studentId,
                studentName,
                rating,
                comment,
                ratedAt: new Date().toISOString()
            };

            if (existingRatingIndex !== -1) {
                ratings[existingRatingIndex] = ratingData;
            } else {
                ratings.push(ratingData);
            }

            // Recalculate stats
            const statistics = this.calculateStatistics(ratings);

            await updateDoc(postRef, {
                ratings,
                statistics,
                updatedAt: new Date().toISOString()
            });

            return { ...postData, ratings, statistics };

        } catch (error) {
            console.error('Error submitting rating:', error);
            throw error;
        }
    },

    // Calculate statistics from ratings array
    calculateStatistics(ratings) {
        if (!ratings || ratings.length === 0) {
            return {
                totalRatings: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;

        ratings.forEach(r => {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
            totalRating += r.rating;
        });

        return {
            totalRatings: ratings.length,
            averageRating: (totalRating / ratings.length).toFixed(1),
            ratingDistribution: distribution
        };
    },

    // Get statistics for a specific post
    async getPostStatistics(postId) {
        const post = await this.getFeedbackPostById(postId);
        if (!post) return null;
        return post.statistics;
    }
};
