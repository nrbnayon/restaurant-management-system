import { KitchenColumnSkeleton } from "@/components/Skeleton/KitchenSkeleton";
import type { Order, OrderStatus } from "@/types/order";
import KitchenOrderCard from "./KitchenOrderCard";

interface KitchenColumnProps {
  title: string;
  orders: Order[];
  status: OrderStatus;
  bgColor: string;
  isLoading: boolean;
  onItemStatusChange: (
    orderId: string,
    itemId: string,
    newStatus: OrderStatus
  ) => void;
}

export function KitchenColumn({
  title,
  orders,
  status,
  bgColor,
  isLoading,
  onItemStatusChange,
}: KitchenColumnProps) {
  return (
    <div className="space-y-4">
      {/* Column Header */}
      <div
        className={`${bgColor} text-white rounded-t-2xl py-3 px-4 font-semibold text-center`}
      >
        {title}
      </div>

      {/* Orders Container */}
      <div className="space-y-4 min-h-[200px]">
        {isLoading ? (
          <KitchenColumnSkeleton />
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No orders
          </div>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              currentStatus={status}
              onItemStatusChange={onItemStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
