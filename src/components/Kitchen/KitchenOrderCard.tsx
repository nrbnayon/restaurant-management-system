import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import type { Order, OrderStatus, OrderItem } from "@/types/order";
import { RoleGuard } from "../RoleGuard";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface KitchenOrderCardProps {
  order: Order;
  currentStatus: OrderStatus;
  onItemStatusChange: (
    orderId: string,
    itemId: string,
    newStatus: OrderStatus
  ) => void;
}

export default function KitchenOrderCard({
  order,
  currentStatus,
  onItemStatusChange,
}: KitchenOrderCardProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Receive":
        return "bg-[#2294C5]";
      case "Preparing":
        return "bg-[#B8860B]";
      case "Ready":
        return "bg-[#22C55E]";
      case "Served":
        return "bg-[#00A789]";
      default:
        return "bg-primary";
    }
  };

  const getStatusTextColor = (status: OrderStatus) => {
    switch (status) {
      case "Receive":
        return "text-[#2294C5]";
      case "Preparing":
        return "text-[#B8860B]";
      case "Ready":
        return "text-[#22C55E]";
      case "Served":
        return "text-[#00A789]";
      default:
        return "text-primary";
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      Receive: "Preparing",
      Preparing: "Ready",
      Ready: "Served",
      Served: null,
    };
    return statusFlow[currentStatus];
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalItems = order.items.length;
    const statusWeights = {
      Receive: 0,
      Preparing: 33.33,
      Ready: 66.66,
      Served: 100,
    };

    const totalProgress = order.items.reduce(
      (sum, item) => sum + statusWeights[item.status],
      0
    );

    return Math.round(totalProgress / totalItems);
  };

  const progress = calculateProgress();

  const handleItemStatusUpdate = async (item: OrderItem) => {
    const nextStatus = getNextStatus(item.status);
    if (!nextStatus) return;

    setUpdatingItemId(item.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onItemStatusChange(order.id, item.id, nextStatus);
    setUpdatingItemId(null);
  };

  const handleViewDetails = () => {
    navigate(`/dashboard/orders/${order.id}`);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div
        className={`${getStatusColor(
          currentStatus
        )} text-white py-2 px-4 flex items-center justify-between`}
      >
        <span className="font-semibold">Order No: {order.id}</span>
        <span className="text-sm font-medium">{currentStatus}</span>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Progress Bar Section - Only for Chef */}
        <RoleGuard allowedRoles={["chef"]}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Progress</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </RoleGuard>

        {/* Admin Progress View - Read Only */}
        <RoleGuard allowedRoles={["admin"]}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Progress</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground italic">
              View only - Chef controls order progress
            </p>
          </div>
        </RoleGuard>

        {/* Table Number */}
        <div className="text-sm">
          <span className="font-semibold text-foreground">Table No: </span>
          <span className="text-foreground">{order.tableNo}</span>
        </div>

        {/* Order Items Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Items ({order.items.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2 hover:bg-accent"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {!isExpanded && (
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="text-sm text-foreground flex items-center justify-between"
                >
                  <span>
                    <span className="font-medium">{item.quantity}</span> *{" "}
                    {item.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      getStatusTextColor(item.status)
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          )}

          {/* Expanded Items View - Chef Only */}
          {isExpanded && (
            <RoleGuard allowedRoles={["chef"]}>
              <div className="space-y-3 pt-2">
                {order.items.map((item, index) => {
                  const nextStatus = getNextStatus(item.status);
                  const isUpdating = updatingItemId === item.id;

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="p-3 bg-accent/30 rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            <span className="font-semibold">
                              {item.quantity}
                            </span>{" "}
                            * {item.name}
                          </p>
                          {item.size && (
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size}
                            </p>
                          )}
                          {item.note && (
                            <p className="text-xs text-muted-foreground">
                              Note: {item.note}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-1 rounded",
                            getStatusTextColor(item.status)
                          )}
                        >
                          {item.status}
                        </span>
                      </div>

                      {nextStatus && (
                        <Button
                          onClick={() => handleItemStatusUpdate(item)}
                          disabled={isUpdating}
                          className={`w-full ${getStatusColor(
                            nextStatus
                          )} hover:opacity-90 text-white h-8 text-xs`}
                        >
                          {isUpdating ? "Updating..." : `Mark as ${nextStatus}`}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </RoleGuard>
          )}

          {/* Expanded Items View - Admin (Read Only) */}
          {isExpanded && (
            <RoleGuard allowedRoles={["admin"]}>
              <div className="space-y-2 pt-2">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-3 bg-accent/30 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          <span className="font-semibold">{item.quantity}</span>{" "}
                          * {item.name}
                        </p>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-xs text-muted-foreground">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-1 rounded",
                          getStatusTextColor(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </RoleGuard>
          )}
        </div>

        {/* Time Left */}
        <div className="flex justify-between items-center ">
          <RoleGuard allowedRoles={["admin", "chef"]}>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleViewDetails}
                className="flex-1 hover:bg-accent h-8 text-sm"
              >
                <Eye className="h-4 w-4 text-foreground" />
                View Details
              </Button>
            </div>
          </RoleGuard>
          <p className="text-sm font-semibold text-muted-foreground">
            Time Left: {order.timeLeft}
          </p>
        </div>

        {/* Actions */}
      </div>
    </div>
  );
}
