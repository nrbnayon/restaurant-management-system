// src/config/sidebarConfig.tsx
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Package,
  Bell,
  Settings,
  Receipt,
  ChefHat,
  Tag,
  Soup,
  UserCog,
  UserCircle,
  FileText,
  TrendingUp,
  CreditCard,
  BarChart3,
  Users2,
  DatabaseZap,
} from "lucide-react";
import type { ReactNode } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  RestaurantTableIcon,
} from "@hugeicons/core-free-icons";

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  roles: string[];
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export const sidebarConfig: Record<string, SidebarSection[]> = {
  admin: [
    {
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: "/dashboard",
          roles: ["admin"],
        },
        {
          id: "sale",
          label: "Sale",
          icon: <Receipt className="h-5 w-5" />,
          path: "/dashboard/sales",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Portals",
      items: [
        {
          id: "kitchen",
          label: "Kitchen",
          icon: <ChefHat className="h-5 w-5" />,
          path: "/dashboard/kitchen",
          roles: ["admin"],
        },
        {
          id: "table",
          label: "Table",
          icon: <HugeiconsIcon icon={RestaurantTableIcon} size={20} />,
          path: "/dashboard/table",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Foods",
      items: [
        {
          id: "category",
          label: "Category",
          icon: <Tag className="h-5 w-5" />,
          path: "/dashboard/category",
          roles: ["admin"],
        },
        {
          id: "menu",
          label: "Menu",
          icon: <UtensilsCrossed className="h-5 w-5" />,
          path: "/dashboard/menu",
          roles: ["admin"],
        },
        {
          id: "ingredients",
          label: "Ingredients",
          icon: <Soup className="h-5 w-5" />,
          path: "/dashboard/ingredients",
          roles: ["admin"],
        },
        {
          id: "stock",
          label: "Stock",
          icon: <DatabaseZap className="h-5 w-5" />,
          path: "/dashboard/stock",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "People",
      items: [
        {
          id: "user",
          label: "User",
          icon: <UserCircle className="h-5 w-5" />,
          path: "/dashboard/user",
          roles: ["admin"],
        },
        {
          id: "user-roles",
          label: "User roles",
          icon: <UserCog className="h-5 w-5" />,
          path: "/dashboard/user-roles",
          roles: ["admin"],
        },
        {
          id: "supplier",
          label: "Supplier",
          icon: <Users2 className="h-5 w-5" />,
          path: "/dashboard/supplier",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Purchases",
      items: [
        {
          id: "purchase",
          label: "Purchase",
          icon: <ShoppingBag className="h-5 w-5" />,
          path: "/dashboard/purchase",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Expenses",
      items: [
        {
          id: "expense-type",
          label: "Expense Type",
          icon: <FileText className="h-5 w-5" />,
          path: "/dashboard/expense-type",
          roles: ["admin"],
        },
        {
          id: "expenses",
          label: "Expenses",
          icon: <CreditCard className="h-5 w-5" />,
          path: "/dashboard/expenses",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          id: "overall-sales",
          label: "Overall Sales",
          icon: <TrendingUp className="h-5 w-5" />,
          path: "/dashboard/reports/overall-sales",
          roles: ["admin"],
        },
        {
          id: "overall-expense",
          label: "Overall expense",
          icon: <BarChart3 className="h-5 w-5" />,
          path: "/dashboard/reports/overall-expense",
          roles: ["admin"],
        },
        {
          id: "most-sold-item",
          label: "Most Sold Item",
          icon: <TrendingUp className="h-5 w-5" />,
          path: "/dashboard/reports/most-sold-item",
          roles: ["admin"],
        },
        {
          id: "purchase-report",
          label: "Purchase Report",
          icon: <FileText className="h-5 w-5" />,
          path: "/dashboard/reports/purchase-report",
          roles: ["admin"],
        },
        {
          id: "supplier-report",
          label: "Supplier Report",
          icon: <HugeiconsIcon icon={AnalyticsUpIcon} size={20} />,
          path: "/dashboard/reports/supplier-report",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Advance",
      items: [
        {
          id: "notification",
          label: "Notification",
          icon: <Bell className="h-5 w-5" />,
          path: "/dashboard/notification",
          roles: ["admin"],
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="h-5 w-5" />,
          path: "/dashboard/settings",
          roles: ["admin"],
        },
      ],
    },
  ],
  manager: [
    {
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: "/dashboard",
          roles: ["manager"],
        },
        {
          id: "staff",
          label: "User",
          icon: <Users className="h-5 w-5" />,
          path: "/dashboard/staff",
          roles: ["manager"],
        },
        {
          id: "orders",
          label: "Orders",
          icon: <ShoppingBag className="h-5 w-5" />,
          path: "/dashboard/orders",
          roles: ["manager"],
        },
        {
          id: "menu",
          label: "Menu",
          icon: <UtensilsCrossed className="h-5 w-5" />,
          path: "/dashboard/menu",
          roles: ["manager"],
        },
        {
          id: "inventory",
          label: "Inventory",
          icon: <Package className="h-5 w-5" />,
          path: "/dashboard/inventory",
          roles: ["manager"],
        },
        {
          id: "notification",
          label: "Notification",
          icon: <Bell className="h-5 w-5" />,
          path: "/dashboard/notification",
          roles: ["manager"],
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="h-5 w-5" />,
          path: "/dashboard/settings",
          roles: ["manager"],
        },
      ],
    },
  ],
  chef: [
    {
      items: [
        {
          id: "orders",
          label: "Orders",
          icon: <ShoppingBag className="h-5 w-5" />,
          path: "/dashboard/orders",
          roles: ["chef"],
        },
        {
          id: "notification",
          label: "Notification",
          icon: <Bell className="h-5 w-5" />,
          path: "/dashboard/notification",
          roles: ["chef"],
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="h-5 w-5" />,
          path: "/dashboard/settings",
          roles: ["chef"],
        },
      ],
    },
  ],
  cashier: [
    {
      items: [
        {
          id: "orders",
          label: "Orders",
          icon: <ShoppingBag className="h-5 w-5" />,
          path: "/dashboard/orders",
          roles: ["cashier"],
        },
        {
          id: "menu",
          label: "Menu",
          icon: <UtensilsCrossed className="h-5 w-5" />,
          path: "/dashboard/menu",
          roles: ["cashier"],
        },
        {
          id: "notification",
          label: "Notification",
          icon: <Bell className="h-5 w-5" />,
          path: "/dashboard/notification",
          roles: ["cashier"],
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="h-5 w-5" />,
          path: "/dashboard/settings",
          roles: ["cashier"],
        },
      ],
    },
  ],
};

export const getSidebarForRole = (role: string): SidebarSection[] => {
  return sidebarConfig[role.toLowerCase()] || [];
};
