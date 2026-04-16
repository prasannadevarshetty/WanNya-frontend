"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  totalAmount?: number;
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
}: BookingSuccessModalProps) {
  const router = useRouter();

  const handleViewOrders = () => {
    onClose();
    router.push("/dashboard/profile/orders");
  };

  const handleContinueShopping = () => {
    onClose();
    router.push("/dashboard");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Successful! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Your order has been placed successfully. Since this is a cash on delivery order, you'll pay when you receive your items.
          </p>
          
          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-semibold text-gray-900">{orderNumber}</p>
            </div>
          )}

          {totalAmount && (
            <div className="bg-yellow-50 rounded-lg p-3">
              <p className="text-sm text-yellow-600">Total Amount (Cash on Delivery)</p>
              <p className="text-xl font-bold text-yellow-700">¥{totalAmount.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewOrders}
            className="w-full bg-[#d4a017] hover:bg-[#c9940f] text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            View Orders
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Next Steps:</strong> Go to your orders page in the profile section to track your order details and delivery status.
          </p>
        </div>
      </div>
    </div>
  );
}
