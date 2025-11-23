import { useState } from "react";
import { useOrders } from "../../context/OrdersContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface ReviewFormProps {
    orderId: string;
    productId: string;
    onClose: () => void;
}

export function ReviewForm({ orderId, productId, onClose }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const { submitReview } = useOrders();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitReview(orderId, productId, rating, comment);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Write a Review</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Your Review
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            placeholder="Share your thoughts about this product..."
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Submit Review
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
