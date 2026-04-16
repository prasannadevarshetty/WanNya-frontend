"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import BackHeader from "@/components/common/BackHeader";
import EmptyOrders from "@/components/profile/orders/EmptyOrders";
import OrderCard from "@/components/profile/orders/OrderCard";
import { useProfileStore } from "@/store/useProfileStore";
import { ordersAPI } from "@/services/api";
import { XCircle } from "lucide-react";

export default function OrdersPage() {
  const { orders, setOrders } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "cancelled">("orders");
  const [cancelledProducts, setCancelledProducts] = useState<any[]>([]);
  const [isLoadingCancelled, setIsLoadingCancelled] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await ordersAPI.getUserOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCancelledProducts = async () => {
    setIsLoadingCancelled(true);
    try {
      const response = await ordersAPI.getCancelledProducts();
      setCancelledProducts(response.cancelledProducts || []);
    } catch (error) {
      console.error("Failed to fetch cancelled products:", error);
      setCancelledProducts([]);
    } finally {
      setIsLoadingCancelled(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCancelledProducts(); // Fetch cancelled products on initial load
  }, []);

  useEffect(() => {
    if (activeTab !== "cancelled") return;
    if (cancelledProducts.length > 0) return;
    fetchCancelledProducts();
  }, [activeTab, cancelledProducts.length]);

  const handleOrderCancelled = () => {
    fetchOrders(); // Refresh orders after cancellation
  };

  const hasCancelledOrders = orders.some(order => order.status === 'cancelled');

  const getCancelledName = (product: any) => {
    return (
      product?.customization?.name ||
      product?.product?.name ||
      product?.service?.name ||
      product?.title ||
      "Cancelled Item"
    );
  };

  const getCancelledImage = (product: any) => {
    return (
      product?.customization?.image ||
      product?.product?.image ||
      product?.service?.image ||
      product?.image ||
      "/placeholder-product.jpg"
    );
  };

  return (
    <DashboardContainer>
      <BackHeader title="Orders" />

      <div className="mb-5 flex items-center gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "orders"
              ? "bg-[#d4a017] text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cancelled")}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
            activeTab === "cancelled"
              ? "bg-red-600 text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <XCircle size={16} />
          Cancelled
          {cancelledProducts.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "cancelled"
                  ? "bg-white/20 text-white"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {cancelledProducts.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "orders" ? (
        isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a017] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOrderCancelled={handleOrderCancelled}
              />
            ))}
          </div>
        )
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Your cancelled items and refunds.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard/profile/orders/cancelled')}
              className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Details
            </button>
          </div>

          {isLoadingCancelled ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cancelled orders...</p>
              </div>
            </div>
          ) : cancelledProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <XCircle size={56} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cancelled Orders</h3>
              <p className="text-gray-500">You haven't cancelled any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cancelledProducts.map((product: any, idx: number) => (
                <div key={product.id || product._id || idx} className="bg-white rounded-2xl shadow-md p-4">
                  <div className="flex gap-4">
                    <img
                      src={getCancelledImage(product)}
                      alt={getCancelledName(product)}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {getCancelledName(product)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Order: {product.orderNumber || product.orderId || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ¥{(product.refundAmount ?? product.price ?? 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {product.quantity ?? 1}
                          </p>
                        </div>
                      </div>

                      {product.cancellationReason && (
                        <div className="bg-red-50 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-red-800 mb-1">
                            Reason:
                          </p>
                          <p className="text-sm text-red-700">
                            {product.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardContainer>
  );
}