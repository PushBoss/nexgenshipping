import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { reviewsService, Review } from '../utils/reviewsService';
import { authService } from '../utils/authService';
import { userService } from '../utils/userService';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  productId: string;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onRatingUpdated?: () => void; // Callback to refresh rating
}

// Helper to get user initials for avatar fallback
const getInitials = (name: string = 'Customer'): string => {
  const parts = name.split(' ');
  return parts
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'C';
};

export function ReviewsSection({ productId, isLoggedIn, onLoginPrompt, onRatingUpdated }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    if (isLoggedIn) {
      checkUserReview();
    } else {
      setUserReview(null);
    }
  }, [productId, isLoggedIn]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getByProductId(productId);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const review = await reviewsService.getUserReview(productId, user.id);
        setUserReview(review);
      }
    } catch (error) {
      console.error('Failed to check user review:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onLoginPrompt();
      return;
    }

    try {
      setSubmitting(true);
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not found');

      const newReview = await reviewsService.addReview({
        product_id: productId,
        user_id: user.id,
        rating,
        comment,
        user_name: user.user_metadata?.first_name || 'Customer'
      });

      if (newReview) {
        setReviews([newReview, ...reviews]);
        setUserReview(newReview);
        setComment('');
        toast.success('Review submitted successfully!');
        onRatingUpdated?.(); // Refresh parent rating
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    try {
      await reviewsService.deleteReview(userReview.id);
      setReviews(reviews.filter(r => r.id !== userReview.id));
      setUserReview(null);
      toast.success('Review deleted');
      onRatingUpdated?.(); // Refresh parent rating
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Customer Reviews</h2>

      {/* Write a Review Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        {!isLoggedIn ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please sign in to share your experience with this product.</p>
            <Button onClick={onLoginPrompt} variant="outline" className="border-[#003366] text-[#003366]">
              Sign In to Write a Review
            </Button>
          </div>
        ) : userReview ? (
          <div className="bg-white p-4 rounded border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-700 font-medium mb-1">You reviewed this product on {new Date(userReview.created_at).toLocaleDateString()}</p>
                <div className="flex text-[#FF9900] mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < userReview.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700">{userReview.comment}</p>
              </div>
              <Button onClick={handleDelete} variant="ghost" className="text-red-500 hover:text-red-700 h-auto p-0 text-sm">
                Delete Review
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-colors"
                  >
                    <Star 
                      className={`h-8 w-8 ${star <= rating ? 'fill-[#FF9900] text-[#FF9900]' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Review</label>
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                rows={4}
                required
                className="bg-white"
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-[#FF9900] hover:bg-[#F08000] text-white"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10 border border-gray-200 flex-shrink-0">
                  <AvatarImage src={review.user_avatar || undefined} alt={review.user_name || 'Customer'} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 font-medium text-sm">
                    {getInitials(review.user_name || 'Customer')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-gray-900 block">{review.user_name || 'Customer'}</span>
                  <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex text-[#FF9900] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              {review.comment && <p className="text-gray-700">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
