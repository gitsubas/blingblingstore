import { Star } from "lucide-react";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";

interface ProductReviewsProps {
    productId: string;
}

interface ReviewWithUser {
    productId: string;
    rating: number;
    comment: string;
    createdAt: string;
    userName: string;
    userId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const { orders } = useOrders();
    const { user } = useAuth();

    // Collect all reviews for this product from all orders
    const productReviews: ReviewWithUser[] = [];

    orders.forEach((order) => {
        if (order.reviews) {
            order.reviews.forEach((review) => {
                if (review.productId === productId) {
                    productReviews.push({
                        ...review,
                        userName: order.shippingAddress.fullName,
                        userId: order.userId,
                    });
                }
            });
        }
    });

    // Calculate average rating
    const averageRating = productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
        : 0;

    const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
        const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="mt-16 border-t border-gray-200 pt-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>

                {productReviews.length > 0 ? (
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            {renderStars(Math.round(averageRating), "lg")}
                            <span className="text-2xl font-bold text-gray-900">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-gray-500">
                            Based on {productReviews.length} {productReviews.length === 1 ? "review" : "reviews"}
                        </span>
                    </div>
                ) : (
                    <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this product!</p>
                )}
            </div>

            {/* Reviews List */}
            {productReviews.length > 0 && (
                <div className="space-y-6">
                    {productReviews
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((review, index) => (
                            <div
                                key={`${review.userId}-${review.createdAt}-${index}`}
                                className="bg-white border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-white font-semibold">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {review.userName}
                                                    {user && user.id === review.userId && (
                                                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                </div>
            )}

            {productReviews.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500">
                        Purchase this product and be the first to share your experience!
                    </p>
                </div>
            )}
        </div>
    );
}
