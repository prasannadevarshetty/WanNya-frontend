"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import CartHeader from "@/components/cart/CartHeader";
import QuantitySelector from "@/components/cart/QuantitySelector";
import BookingSuccessModal from "@/components/ui/BookingSuccessModal";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { Star, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ordersAPI } from "@/services/api";
import { resolveImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";
import { useTranslations } from "next-intl";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const t = useTranslations('cart');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ orderNumber: string; totalAmount: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = async () => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await ordersAPI.createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        totalAmount: total,
        shippingAddress: {
          street: "Default Address",
          city: "Default City", 
          state: "Default State",
          country: "Default Country",
          zip: "00000"
        }
      });

      if (response.order) {
        setOrderDetails({
          orderNumber: response.order.orderNumber,
          totalAmount: response.order.totalAmount
        });
        setIsBookingModalOpen(true);
        clearCart(); // Clear cart after successful order
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setOrderDetails(null);
  };

  return (
    <main className="min-h-screen bg-[#f4efe6] pb-16">
      <DashboardHeader />
      <CartHeader />

      <div className="px-4 sm:px-6">
        <div className="bg-[#f8e7b8] rounded-3xl border-4 border-[#d4a017] p-4 sm:p-6">
          <h2 className="text-center text-lg sm:text-xl font-bold text-[#d4a017] mb-6">
            {t("items")}
          </h2>

          {items.length === 0 ? (
            <p className="text-center text-gray-600">
              {t("empty")}
            </p>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                     key={item.id || index}
                    className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all p-4 flex gap-4"
                  >
                    {/* Image */}
                    <img
                      src={resolveImageUrl(item.image) || PLACEHOLDER_IMAGE}
                      alt={item.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 self-start"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />

                    {/* Right side: all content */}
                    <div className="flex-1 flex flex-col min-w-0">

                      {/* Top row: title + trash */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base leading-tight truncate">
                          {item.title}
                        </h3>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-red-200 bg-red-50 hover:bg-red-100 transition"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>

                      {/* Duration */}
                      {item.duration && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.duration}
                        </p>
                      )}

                      {/* Price */}
                      <p className="text-xl font-bold mt-1">
                        ¥{item.price.toLocaleString()}
                      </p>

                      {/* Bottom row: rating + quantity */}
                      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={16} fill="currentColor" />
                          <span className="text-sm font-semibold">
                            {item.rating}
                          </span>
                        </div>

                        <QuantitySelector
                          quantity={item.quantity}
                          setQuantity={(q) => updateQuantity(item.id, q)}
                        />
                      </div>

                    </div>
                  </div> 
                ))}
              </div> 
              {/* Total Section */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#fff1b8] border-2 border-[#d4a017] rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-bold text-[#d4a017]">
                  ¥{total.toLocaleString()}
                </div>

                <Button 
                  onClick={handleBuyNow}
                  disabled={isProcessing || items.length === 0}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? t("processingOrder") : t("orderNow")}
                </Button>
              </div>
            </>
          )}

        </div> 
      </div> 

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        orderNumber={orderDetails?.orderNumber}
        totalAmount={orderDetails?.totalAmount}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4">
            <PawPrintLoader />
            <p className="text-center text-amber-600 font-semibold mt-4">
              {t("processingOrder")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
