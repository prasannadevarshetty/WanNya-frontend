"use client";

import { useState, useEffect } from "react";
import {
Star,
ThumbsUp,
MessageSquare,
User as UserIcon,
ChevronUp,
ChevronDown,
} from "lucide-react";
import Button from "../ui/Button";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTranslations } from "next-intl";

type Review = {
id: string;
userId: string;
userName: string;
userAvatar?: string;
rating: number;
comment: string;
date: string;
helpful: number;
verified: boolean;
};

type Props = {
productId: string;
initialRating?: number;
};

export default function ProductReviews({
productId,
initialRating = 0,
}: Props) {
const [reviews, setReviews] = useState<Review[]>([]);
const [loadingReviews, setLoadingReviews] = useState(true);
const [isOpen, setIsOpen] = useState(true);
const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
const [submittingReview, setSubmittingReview] = useState(false);

const { addNotification } = useNotificationStore();
const t = useTranslations("reviews");

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchReviews = async () => {
if (!productId) return;
setLoadingReviews(true);

try {
  const response = await fetch(
    `${API_URL}/api/reviews/product/${productId}`
  );
  const data = await response.json();

  if (data.success) {
    setReviews(data.reviews || []);
  }
} catch (error) {
  console.error("Failed to fetch reviews:", error);
} finally {
  setLoadingReviews(false);
}

};

useEffect(() => {
fetchReviews();
}, [productId]);

const handleSubmitReview = async () => {
if (!newReview.comment.trim()) {
addNotification({
title: t("error"),
message: t("writeReview"),
type: "error",
read: false,
});
return;
}

setSubmittingReview(true);

try {
  const response = await fetch(`${API_URL}/api/reviews/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        typeof window !== "undefined"
          ? localStorage.getItem("wanya_token")
          : null
      }`,
    },
    body: JSON.stringify({
      productId,
      rating: newReview.rating,
      comment: newReview.comment,
    }),
  });

  const data = await response.json();

  if (data.success) {
    addNotification({
      title: t("reviewSubmitted"),
      message: t("thankYou"),
      type: "success",
      read: false,
    });

    setNewReview({ rating: 5, comment: "" });
    fetchReviews();
  } else {
    throw new Error(data.message || t("submitFailed"));
  }
} catch (error) {
  console.error("Submit review error:", error);

  addNotification({
    title: t("error"),
    message:
      error instanceof Error ? error.message : t("submitFailed"),
    type: "error",
    read: false,
  });
} finally {
  setSubmittingReview(false);
}
};

const renderStars = (rating: number, size = "small") => {
const starSize = size === "small" ? 14 : size === "medium" ? 18 : 24;

return Array.from({ length: 5 }, (_, i) => (
  <Star
    key={i}
    size={starSize}
    className={
      i < rating
        ? "text-yellow-500 fill-yellow-500"
        : "text-gray-300"
    }
  />
));

};

return ( <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
<button
onClick={() => setIsOpen(!isOpen)}
className="w-full p-6 flex items-center justify-between hover:bg-gray-50 text-left"
> <div> <h3 className="font-semibold text-gray-900">
{t("customerReviews")} </h3>

      <p className="text-sm text-gray-500 mt-1">
        `${reviews.length} ${t("reviewsCount")} • ${t("avg")} ${initialRating.toFixed(1)} ${t("stars")}`
      </p>
    </div>

    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>

  {isOpen && (
    <div className="px-6 pb-6 space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {initialRating.toFixed(1)}
          </div>

          <div className="flex justify-center my-1">
            {renderStars(initialRating, "medium")}
          </div>

          <p className="text-sm text-gray-500">
            `${reviews.length} ${t("reviewsCount")}`
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(
              (r) => r.rating === stars
            ).length;

            const percentage =
              reviews.length > 0
                ? (count / reviews.length) * 100
                : 0;

            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-3">
                  {stars}
                </span>

                <Star
                  size={14}
                  className="text-yellow-500 fill-yellow-500"
                />

                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-sm text-gray-500 w-8">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">
          {t("writeAReview")}
        </h4>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              {t("rating")}
            </label>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setNewReview({ ...newReview, rating: star })
                  }
                >
                  <Star
                    size={24}
                    className={
                      star <= newReview.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              {t("yourReview")}
            </label>

            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({
                  ...newReview,
                  comment: e.target.value,
                })
              }
              placeholder={t("placeholder")}
              className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-[#d4a017]"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            loading={submittingReview}
          >
            {t("submitReview")}
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 border-t pt-6">
        {loadingReviews ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500">
              {t("loading")}
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare
              size={48}
              className="text-gray-300 mx-auto mb-2"
            />
            <p className="text-gray-500">
              {t("noReviews")}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b last:border-0 pb-4"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {review.userName}
                      </span>

                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          {t("verified")}
                        </span>
                      )}
                    </div>

                    <span className="text-sm text-gray-500">
                      {review.date}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-2">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-600">
                    {review.comment}
                  </p>

                  <button className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <ThumbsUp size={14} />
                    `${t("helpful")} (${review.helpful})`
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>


);
}
