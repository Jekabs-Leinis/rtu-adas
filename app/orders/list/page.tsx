"use client";

import React, { useEffect, useState } from "react";
import { fetchOrders } from "../orderServices";
import { Order } from "../orderModels";

export default function OrdersTablePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const fetchedOrders = await fetchOrders();
        console.log(fetchedOrders);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)] text-[var(--color-text)]">
        <h1 className="text-3xl font-bold">Loading orders...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--color-text)] min-h-screen orders">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Supplier</th>
            <th className="border border-gray-300 px-4 py-2">Notes</th>
            <th className="border border-gray-300 px-4 py-2">Product</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, orderIndex) => (
            <React.Fragment key={orderIndex}>
              {order.items.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  {itemIndex === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={order.items.length}
                      >
                        {order.supplier.name}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={order.items.length}
                      >
                        {order.notes}
                      </td>
                    </>
                  )}
                  <td className="border border-gray-300 px-4 py-2">
                    {item.product.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.price}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
