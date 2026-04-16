"use client";

import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";
import { ordersAPI } from "@/services/api";

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      console.log('🔍 Fetching orders...');
      const response = await ordersAPI.getUserOrders(); // ✅ correct API method
      console.log('� Orders Response:', response);
      const ordersData = response.orders || [];
      console.log('📊 Orders Data:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error("❌ Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <OrderCard
          key={order.id}
          order={order}
          onOrderCancelled={fetchOrders} // 🔥 auto refresh after cancel
        />
      ))}
    </div>
  );
}