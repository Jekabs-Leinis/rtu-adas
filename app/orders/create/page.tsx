"use client";

import { useState, useEffect } from "react";
import { Supplier, Product, Order, OrderItem } from "../orderModels";
import {
  fetchSuppliers,
  fetchProducts,
  saveOrder,
  sendOrder,
} from "../orderServices";
import Select from "react-select";
import "@/app/orders/orders.css";
import { useRouter } from "next/navigation";
import customSelectStyles from "@/app/styles/selectStyleConfig";

export default function CreateOrderPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [productOptions, setProductOptions] = useState<
    { label: string; value: Product }[]
  >([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const supplierData = await fetchSuppliers();
      setSuppliers(supplierData);
    }

    loadData();
  }, []);

  const handleProductSearch = async (inputValue: string) => {
    if (!selectedSupplierId) return [];
    setIsLoadingProducts(true);
    const products = await fetchProducts(inputValue, selectedSupplierId);
    setIsLoadingProducts(false);
    return products.map((product) => ({ label: product.name, value: product }));
  };

  const handleProductSelect = (
    selectedOption: { label: string; value: Product } | null | any,
  ) => {
    if (selectedOption) {
      setOrderItems((prev) => [
        ...prev,
        new OrderItem(selectedOption.value, 1, 0),
      ]);

      setSearchQuery("");
    }
  };

  const handleSaveOrder = async () => {
    const orderData = new Order(
      suppliers.find((s) => s.id === selectedSupplierId)!,
      notes,
      orderItems,
    );
    await saveOrder(orderData).then(() => router.push("/orders/list"));
  };

  const handleSendOrder = async () => {
    await handleSaveOrder();
    await sendOrder();
  };

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--color-text)] min-h-screen orders">
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Select Supplier
        </label>
        <select
          className="w-full p-2 border rounded bg-[var(--color-bg-dark)] text-[var(--color-text)] border-[var(--color-border)]"
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
        >
          <option value="" disabled>
            Select a supplier
          </option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Search Products
        </label>
        <Select
          instanceId="product-select"
          className="w-full"
          placeholder="Search for products..."
          isClearable
          isLoading={isLoadingProducts}
          isDisabled={!selectedSupplierId} // Disable when no supplier is selected
          onInputChange={(value) => setSearchQuery(value)}
          onMenuOpen={async () => {
            const options = await handleProductSearch(searchQuery);
            setProductOptions(options);
          }}
          options={productOptions}
          onChange={handleProductSelect}
          inputValue={searchQuery} // Prevent resetting input value
          styles={customSelectStyles}
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Order Items</h2>
        <table className="w-full border-collapse border border-[var(--color-border)]">
          <thead>
            <tr>
              <th className="border p-2 text-[var(--color-text)] w-full">
                Product
              </th>
              <th className="border p-2 text-[var(--color-text)] max-w-[128px] min-w-[128px]">
                Quantity
              </th>
              <th className="border p-2 text-[var(--color-text)] max-w-[128px] min-w-[128px]">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 text-[var(--color-text)] w-full">
                  {item.product.name}
                </td>
                <td className="border p-2 max-w-[128px] min-w-[128px]">
                  <input
                    type="number"
                    className="w-full p-1 border rounded bg-[var(--color-bg-dark)] text-[var(--color-text)] border-[var(--color-border)]"
                    value={item.quantity}
                    onChange={(e) =>
                      setOrderItems((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? new OrderItem(p.product, +e.target.value, p.price)
                            : p,
                        ),
                      )
                    }
                  />
                </td>
                <td className="border p-2 max-w-[128px] min-w-[128px]">
                  <input
                    type="number"
                    className="w-full p-1 border rounded bg-[var(--color-bg-dark)] text-[var(--color-text)] border-[var(--color-border)]"
                    value={item.price}
                    onChange={(e) =>
                      setOrderItems((prev) =>
                        prev.map((p, i) =>
                          i === index
                            ? new OrderItem(
                                p.product,
                                p.quantity,
                                +e.target.value,
                              )
                            : p,
                        ),
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Notes</label>
        <textarea
          className="w-full p-2 border rounded bg-[var(--color-bg-dark)] text-[var(--color-text)] border-[var(--color-border)]"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          className="px-8 py-2 bg-yellow-700 text-[var(--color-text)] rounded hover:bg-yellow-900"
          onClick={handleSaveOrder}
          disabled={orderItems.length === 0}
        >
          Save
        </button>
        <button
          className="px-8 py-2 bg-[var(--color-accent)] text-[var(--color-text)] rounded hover:bg-[var(--color-accent-hover)]"
          onClick={handleSendOrder}
          disabled={orderItems.length === 0}
        >
          Save & Send
        </button>
      </div>
    </div>
  );
}
