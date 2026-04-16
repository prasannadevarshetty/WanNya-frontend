"use client";

import { useState } from "react";
import { Package, Calendar, CheckCircle, XCircle, Clock, X } from "lucide-react";
import { ordersAPI } from "@/services/api";

type Props = {
  order: {
    id: string;
    title: string;
    price: number;
    date: string;
    status: string;
  };
  onOrderCancelled?: () => void;
};

export default function OrderCard({ order, onOrderCancelled }: Props) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);
    try {
      await ordersAPI.cancelOrder(order.id, cancellationReason);
      setShowCancelModal(false);
      setCancellationReason("");
      if (onOrderCancelled) {
        onOrderCancelled();
      }
      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = order.status === 'ongoing' || order.status === 'pending';

  const getStatusIcon = () => {
    switch (order.status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={14} className="text-red-600" />;
      case 'ongoing':
      case 'pending':
        return <Clock size={14} className="text-yellow-600" />;
      default:
        return <Package size={14} className="text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'ongoing':
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <Package className="text-[#d4a017]" />

          <div>
            <h4 className="font-semibold">{order.title}</h4>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold">
            ¥{order.price.toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor()}`}>
              {getStatusIcon()}
              {order.status}
            </span>

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Order: <strong>{order.title}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Amount: <strong>¥{order.price.toLocaleString()}</strong>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation *
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Please tell us why you want to cancel this order..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cancellationReason.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancellationReason.trim()}
                className="flex-1 px py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}