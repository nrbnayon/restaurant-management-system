import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { mockOrders } from "@/data/mockOrders";
import type { Order, OrderStatus, OrderItem } from "@/types/order";
import { toast } from "sonner";
import { KitchenColumn } from "@/components/Kitchen/KitchenColumn";

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Calculate order status based on all items
  const calculateOrderStatus = (items: OrderItem[]): OrderStatus => {
    if (items.every((item) => item.status === "Served")) return "Served";
    if (items.every((item) => item.status === "Ready")) return "Ready";
    if (items.some((item) => item.status === "Preparing")) return "Preparing";
    return "Receive";
  };

  // Group orders by their calculated status
  const groupedOrders = useMemo(() => {
    const ordersWithCalculatedStatus = orders.map((order) => ({
      ...order,
      status: calculateOrderStatus(order.items),
    }));

    return {
      received: ordersWithCalculatedStatus.filter(
        (o) => o.status === "Receive"
      ),
      preparing: ordersWithCalculatedStatus.filter(
        (o) => o.status === "Preparing"
      ),
      ready: ordersWithCalculatedStatus.filter((o) => o.status === "Ready"),
      served: ordersWithCalculatedStatus.filter((o) => o.status === "Served"),
    };
  }, [orders]);

  const handleItemStatusChange = (
    orderId: string,
    itemId: string,
    newStatus: OrderStatus
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          );
          return {
            ...order,
            items: updatedItems,
            status: calculateOrderStatus(updatedItems),
          };
        }
        return order;
      })
    );
    toast.success("Item status updated successfully");
  };

  return (
    <>
      <DashboardHeader title="KITCHEN DISPLAY" />

      <main className="p-3 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Received Orders Column */}
          <KitchenColumn
            title="Received Orders"
            orders={groupedOrders.received}
            status="Receive"
            bgColor="bg-[#2294C5]"
            isLoading={isLoading}
            onItemStatusChange={handleItemStatusChange}
          />

          {/* Preparing Orders Column */}
          <KitchenColumn
            title="Preparing Orders"
            orders={groupedOrders.preparing}
            status="Preparing"
            bgColor="bg-[#B8860B]"
            isLoading={isLoading}
            onItemStatusChange={handleItemStatusChange}
          />

          {/* Ready Column */}
          <KitchenColumn
            title="Ready"
            orders={groupedOrders.ready}
            status="Ready"
            bgColor="bg-[#22C55E]"
            isLoading={isLoading}
            onItemStatusChange={handleItemStatusChange}
          />

          {/* Served Column */}
          <KitchenColumn
            title="Served"
            orders={groupedOrders.served}
            status="Served"
            bgColor="bg-[#00A789]"
            isLoading={isLoading}
            onItemStatusChange={handleItemStatusChange}
          />
        </div>
      </main>
    </>
  );
}
