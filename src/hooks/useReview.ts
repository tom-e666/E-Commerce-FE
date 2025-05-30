import { useState } from 'react';
import { 
    getReviewsByUser, 
    getReviewsByProduct, 
    createReview, 
    updateReview, 
    deleteReview 
} from '@/services/review/endpoints';

interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export const useReview = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [productReviews, setProductReviews] = useState<Review[]>([]);

    // Fetch reviews created by the current user
    const getUserReviews = async () => {
        setLoading(true);
        try {
            const response = await getReviewsByUser();
            if (!response.data) {
                throw new Error("Không thể lấy đánh giá của bạn");
            }
            
            const { code, reviews } = response.data.getReviewsByUser;
            
            if (code === 200) {
                setReviews(reviews || []);
                return "Lấy đánh giá thành công";
            } else {
                throw new Error("Không thể lấy đánh giá của bạn");
            }
        } catch (error) {
            throw new Error("Không thể lấy đánh giá của bạn");
        } finally {
            setLoading(false);
        }
    };

    // Fetch reviews for a specific product
    const getReviewsForProduct = async (productId: string, amount: number = 10) => {
        setLoading(true);
        try {
            const response = await getReviewsByProduct(productId, amount);
            if (!response.data) {
                throw new Error("Không thể lấy đánh giá cho sản phẩm này");
            }
            
            const { code, reviews } = response.data.getReviewsByProduct;
            
            if (code === 200) {
                setProductReviews(reviews || []);
                return "Lấy đánh giá sản phẩm thành công";
            } else {
                throw new Error("Không thể lấy đánh giá cho sản phẩm này");
            }
        } catch (error) {
            throw new Error("Không thể lấy đánh giá cho sản phẩm này");
        } finally {
            setLoading(false);
        }
    };

    // Submit a new review
    const submitReview = async (orderItemId: string, rating?: number, comment?: string) => {
        setLoading(true);
        try {
            const response = await createReview(orderItemId, rating, comment);
            if (!response.data) {
                throw new Error("Không thể gửi đánh giá");
            }
            
            const { code } = response.data.createReview;
            
            if (code === 200) {
                // After successful submission, refresh the user's reviews
                await getUserReviews();
                return "Đánh giá của bạn đã được gửi";
            } else {
                throw new Error("Không thể gửi đánh giá");
            }
        } catch  {
            throw new Error("Không thể gửi đánh giá");
        } finally {
            setLoading(false);
        }
    };

    // Update an existing review
    const editReview = async (reviewId: string, rating?: number, comment?: string) => {
        setLoading(true);
        try {
            const response = await updateReview(reviewId, rating, comment);
            if (!response.data) {
                throw new Error("Không thể cập nhật đánh giá");
            }
            
            const { code } = response.data.updateReview;
            
            if (code === 200) {
                // Update local state
                setReviews(prevReviews => 
                    prevReviews.map(review => 
                        review.id === reviewId 
                            ? { 
                                ...review, 
                                rating: rating !== undefined ? rating : review.rating,
                                comment: comment !== undefined ? comment : review.comment,
                                updated_at: new Date().toISOString()
                              } 
                            : review
                    )
                );
                
                // If this review might be in the product reviews list
                setProductReviews(prevReviews => 
                    prevReviews.map(review => 
                        review.id === reviewId 
                            ? { 
                                ...review, 
                                rating: rating !== undefined ? rating : review.rating,
                                comment: comment !== undefined ? comment : review.comment,
                                updated_at: new Date().toISOString() 
                              } 
                            : review
                    )
                );
                
                return "Đánh giá đã được cập nhật";
            } else {
                throw new Error("Không thể cập nhật đánh giá");
            }
        } catch  {
            throw new Error("Không thể cập nhật đánh giá");
        } finally {
            setLoading(false);
        }
    };

    // Remove a review
    const removeReview = async (reviewId: string) => {
        setLoading(true);
        try {
            const response = await deleteReview(reviewId);
            if (!response.data) {
                throw new Error("Không thể xóa đánh giá");
            }
            
            const { code } = response.data.deleteReview;
            
            if (code === 200) {
                // Update local state by removing the review
                setReviews(prevReviews => 
                    prevReviews.filter(review => review.id !== reviewId)
                );
                
                // If this review might be in the product reviews list
                setProductReviews(prevReviews => 
                    prevReviews.filter(review => review.id !== reviewId)
                );
                
                return "Đánh giá đã được xóa";
            } else {
                throw new Error("Không thể xóa đánh giá");
            }
        } catch  {
            throw new Error("Không thể xóa đánh giá");
        } finally {
            setLoading(false);
        }
    };
    // Calculate average rating for a product based on loaded reviews
    const getAverageRating = () => {
        if (productReviews.length === 0) return 0;
        
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / productReviews.length;
    };

    // Get rating distribution (for displaying in a histogram)
    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0]; // 5 elements for 1-5 stars
        
        productReviews.forEach(review => {
            const rating = Math.min(Math.max(Math.floor(review.rating), 1), 5);
            distribution[rating - 1]++;
        });
        
        return distribution;
    };

    return {
        loading,
        reviews,             // User's own reviews
        productReviews,      // Reviews for a specific product
        getUserReviews,
        getReviewsForProduct,
        submitReview,
        editReview,
        removeReview,
        getAverageRating,
        getRatingDistribution
    };
};

export default useReview;