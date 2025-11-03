// src/Pages/Dashboard/Manager/DashboardPage.tsx
import { useState } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatCard from "@/components/Shared/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, Eye } from "lucide-react";

import processIcon from "@/assets/icons/process.svg";
import deliverIcon from "@/assets/icons/deliver.svg";
import { getStatusColor } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
// import { UserRoleDisplay } from "@/components/UserRoleDisplay";
import { topItems } from "@/data/mockTopItem";
import { chartData, mockOrders } from "@/data/mockOrders";
import CustomAreaChart from "@/components/Charts/AreaChart";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState("Day");

  const handleViewDetails = (orderId: string) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  return (
    <>
      <DashboardHeader title="Dashboard" />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        {/* Role-based Demo */}
        {/* <UserRoleDisplay /> */}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Staff"
            value="26"
            icon={<Users className="h-6 w-6 text-foreground" />}
          />
          <StatCard title="Order In Progress" value="80" image={processIcon} />
          <StatCard title="Total Delivered" value="77" image={deliverIcon} />
        </div>

        {/* Chart and Top Items Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Overview Chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Order Overview
              </h2>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-28 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Day</SelectItem>
                  <SelectItem value="Week">Week</SelectItem>
                  <SelectItem value="Month">Month</SelectItem>
                  <SelectItem value="Years">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CustomAreaChart
              data={chartData[timeFilter as keyof typeof chartData]}
              xDataKey="month"
              yDataKey="orders"
              strokeColor="#07AC5E"
              gradientId="orderGradient"
              gradientStart="rgba(7, 172, 94, 0.1)"
              gradientEnd="rgba(7, 172, 94, 0.02)"
            />
          </div>

          {/* Top Performing Items */}
          <div className="bg-background p-3 md:p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Top Performing Items
            </h2>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-md bg-card hover:bg-secondary transition-colors shadow-lg"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden  bg-linear-to-br from-primary to-orange-600">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sold}</p>
                  </div>
                  <p className="font-bold text-foreground">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-2xl shadow-md">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Orders</h2>
          </div>

          <div className="overflow-x-auto rounded-b-xl">
            <table className="w-full rounded-b-xl">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">Order ID</th>
                  <th className="text-center p-4 font-semibold">Date</th>
                  <th className="text-center p-4 font-semibold">Table No</th>
                  <th className="text-center p-4 font-semibold">Items</th>
                  <th className="text-center p-4 font-semibold">Time Left</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-border text-center ${
                      index % 2 === 0 ? "bg-background" : "bg-card"
                    } hover:bg-accent/50 transition-colors`}
                  >
                    <td className="p-3 text-sm font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="p-3 text-sm text-foreground">
                      {order.date}
                    </td>
                    <td className="p-3 text-sm text-foreground">
                      {order.tableNo}
                    </td>
                    <td className="p-3 text-sm text-foreground">
                      {order.items.map((item) => item.name).join(", ")}
                    </td>
                    <td className="p-3 text-sm font-medium text-foreground">
                      {order.timeLeft}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
