"use client";

import { useEffect, useState } from "react";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import BackHeader from "@/components/common/BackHeader";
import { XCircle, Calendar, AlertCircle } from "lucide-react";
import { ordersAPI } from "@/services/api";

interface CancelledProduct {
  id: string;
  orderNumber: string;
  product?: {
    name: string;
    image: string;
  };
  service?: {
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  customization?: {
    name: string;
    image: string;
  };
  cancellationReason: string;
  refundAmount: number;
  pointsDeducted: number;
  cancelledAt: string;
  processedBy: string;
}

export default function CancelledOrdersPage() {
  const [cancelledProducts, setCancelledProducts] = useState<CancelledProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCancelledProducts = async () => {
    setIsLoading(true);
    try {
      const response = await ordersAPI.getCancelledProducts();
      setCancelledProducts(response.cancelledProducts || []);
    } catch (error) {
      console.error("Failed to fetch cancelled products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelledProducts();
  }, []);

  const getProductName = (product: CancelledProduct) => {
    return product.customization?.name || 
           product.product?.name || 
           product.service?.name || 
           'Unknown Product';
  };

  const getProductImage = (product: CancelledProduct) => {
    return product.customization?.image || 
           product.product?.image || 
           product.service?.image || 
           '/placeholder-product.jpg';
  };

  return (
    <DashboardContainer>
      <BackHeader title="Cancelled Orders" />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a017] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cancelled orders...</p>
          </div>
        </div>
      ) : cancelledProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <XCircle size={64} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cancelled Orders</h3>
          <p className="text-gray-500">You haven't cancelled any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cancelledProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <img
                  src={getProductImage(product)}
                  alt={getProductName(product)}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {getProductName(product)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Order: {product.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(product.cancelledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ¥{product.refundAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {product.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Cancellation Details */}
                  <div className="bg-red-50 rounded-lg p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Reason for cancellation:
                        </p>
                        <p className="text-sm text-red-700">
                          {product.cancellationReason}
                        </p>
                        {product.pointsDeducted > 0 && (
                          <p className="text-xs text-red-600 mt-2">
                            Points deducted: {product.pointsDeducted}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardContainer>
  );
}
