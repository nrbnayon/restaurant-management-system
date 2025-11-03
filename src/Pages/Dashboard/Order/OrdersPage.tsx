// src/Pages/Dashboard/Chef/OrdersPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatCard from "@/components/Shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import { getStatusColor } from "@/lib/utils";
import { mockOrders } from "@/data/mockOrders";
import type { OrderStatus } from "@/types/order";
import { Pagination } from "@/components/Shared/Pagination";

import orderIcon from "@/assets/icons/order.svg";
import processIcon from "@/assets/icons/process.svg";
import deliverIcon from "@/assets/icons/deliver.svg";
import { RoleGuard } from "@/components/RoleGuard";

interface OrdersPageProps {
  basePath?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export default function OrdersPage({
  basePath = "/dashboard/orders",
  headerTitle = "Order Management",
  headerSubtitle = "Manage your orders",
}: OrdersPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<
    Record<string, OrderStatus>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const total = mockOrders.length;
    const inProgress = mockOrders.filter(
      (o) => o.status.toLowerCase() === "preparing"
    ).length;
    const delivered = mockOrders.filter(
      (o) =>
        o.status.toLowerCase() === "ready" ||
        o.status.toLowerCase() === "served"
    ).length;

    return { total, inProgress, delivered };
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
    toast.success("Order status updated successfully");
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`${basePath}/${orderId}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      <DashboardHeader title={headerTitle} subtitle={headerSubtitle} />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Order"
            value={stats.total.toString()}
            image={orderIcon}
          />
          <StatCard
            title="Order In Progress"
            value={stats.inProgress.toString()}
            image={processIcon}
          />
          <StatCard
            title="Total Delivered"
            value={stats.delivered.toString()}
            image={deliverIcon}
          />
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Orders</h2>
            <RoleGuard allowedRole="manager">
              <Link
                to="/dashboard/order/create"
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-3 py-2 text-white"
              >
                <Plus className="w-5 h-5" />
                Create Order
              </Link>
            </RoleGuard>
          </div>

          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Order"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40 h-12! border-input">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="receive">Receive</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="served">Served</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">Date</th>
                  <th className="text-center p-4 font-semibold">Order ID</th>
                  <th className="text-center p-4 font-semibold">Table No</th>
                  <th className="text-center p-4 font-semibold">Items</th>
                  <th className="text-center p-4 font-semibold">Time Left</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-2 md:p-5 text-center">
                      <p className="text-muted-foreground">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-b border-border text-center ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-2 text-sm text-foreground">
                        {order.date}
                      </td>
                      <td className="p-2 text-sm font-medium text-foreground">
                        {order.id}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {order.tableNo}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {order.items.map((item) => item.name).join(", ")}
                      </td>
                      <td className="p-2 text-sm font-medium text-foreground">
                        {order.timeLeft}
                      </td>
                      <td className="p-2 flex justify-center items-center">
                        <RoleGuard
                          allowedRoles={["admin", "manager", "chef"]}
                          canTrigger={["manager", "chef"]}
                        >
                          <Select
                            value={selectedStatus[order.id] || order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value as OrderStatus)
                            }
                          >
                            <SelectTrigger
                              className={`w-32 border-0 ${getStatusColor(
                                selectedStatus[order.id] || order.status
                              )}`}
                              iconClassName="text-white"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Receive">Receive</SelectItem>
                              <SelectItem value="Preparing">
                                Preparing
                              </SelectItem>
                              <SelectItem value="Ready">Ready</SelectItem>
                              <SelectItem value="Served">Served</SelectItem>
                            </SelectContent>
                          </Select>
                        </RoleGuard>
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-accent"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="h-5 w-5 text-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && paginatedOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            showPrevNext={true}
            showIfSinglePage={false}
          />
        )}
      </main>
    </>
  );
}
