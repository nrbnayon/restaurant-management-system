// src/Routers/Router.tsx
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/Layouts/DashboardLayout";
import SignIn from "@/Pages/Authentication/SignIn";
import ForgetPassword from "@/Pages/Authentication/ForgetPassword";
import ResetPassword from "@/Pages/Authentication/ResetPassword";

// Admin Pages
import AdminDashboardPage from "@/Pages/Dashboard/Admin/DashboardPage";

// Manager Pages
import ManagerDashboardPage from "@/Pages/Dashboard/Manager/DashboardPage";
import StaffPage from "@/Pages/Dashboard/Manager/StaffPage";
import InventoryPage from "@/Pages/Dashboard/Inventory/InventoryPage";

// Chef Pages
import OrdersPage from "@/Pages/Dashboard/Order/OrdersPage";
import OrderDetailPage from "@/Pages/Dashboard/Order/OrderDetailPage";

// Shared Pages
import NotificationPage from "@/components/Shared/NotificationPage";
import SettingsPage from "@/Pages/Settings/SettingsPage";
import ProfilePage from "@/components/Settings/ProfilePage";
import ChangePasswordPage from "@/components/Settings/ChangePasswordPage";
import CreateOrderPage from "@/Pages/Dashboard/Order/CreateOrderPage";
import AuthLayout from "@/Layouts/AuthLayout";
import DashboardRedirect from "@/components/DashboardRedirect";
import RootRedirect from "@/components/RootRedirect";
import MenuPage from "@/Pages/Dashboard/Menu/MenuPage";
import AddMenuPage from "@/Pages/Dashboard/Menu/AddMenuPage";
import EditMenuPage from "@/Pages/Dashboard/Menu/EditMenuPage";
import SalesPage from "@/Pages/Dashboard/Admin/Sales/SalesPage";
import SalesDetailsPage from "@/Pages/Dashboard/Admin/Sales/SalesDetailsPage";
import KitchenPage from "@/Pages/Dashboard/Admin/Kitchen/KitchenPage";
import TablePage from "@/Pages/Dashboard/Admin/Table/TablePage";
import CategoryPage from "@/Pages/Dashboard/Admin/Category/CategoryPage";
import IngredientsPage from "@/Pages/Dashboard/Admin/Ingredients/IngredientsPage";
import UserPage from "@/Pages/Dashboard/Admin/User/UserPage";
import UserRolesPage from "@/Pages/Dashboard/Admin/UserRole/UserRolesPage";
import PermissionPage from "@/components/UserRole/PermissionPage";
import PurchasePage from "@/Pages/Dashboard/Admin/Purchase/PurchasePage";
import AddEditPurchasePage from "@/Pages/Dashboard/Admin/Purchase/AddEditPurchasePage";
import ExpensesPage from "@/Pages/Dashboard/Admin/Expense/ExpensesPage";
import AddEditExpensePage from "@/Pages/Dashboard/Admin/Expense/AddEditExpensePage";
import ExpenseTypePage from "@/Pages/Dashboard/Admin/Expense/ExpenseTypePage";
import OverallExpenseReportPage from "@/Pages/Dashboard/Admin/Reports/OverallExpenseReportPage";
import OverallSalesReportPage from "@/Pages/Dashboard/Admin/Reports/OverallSalesReportPage";
import PurchaseReportPage from "@/Pages/Dashboard/Admin/Reports/PurchaseReportPage";
import TopSellingItemsPage from "@/Pages/Dashboard/Admin/Reports/TopSellingItemsPage";
import SupplierPage from "@/Pages/Dashboard/Admin/Supplier/SupplierPage";
import SupplierReportPage from "@/Pages/Dashboard/Admin/Reports/SupplierReportPage";
import StockPage from "@/Pages/Dashboard/Admin/Stock/StockPage";
import DayManagementPage from "@/components/Settings/DayManagementPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  // Public Routes (AuthLayout)
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  // Protected Routes (DashboardLayout)
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardRedirect />,
      },
      // Admin Routes
      {
        path: "admin",
        element: <AdminDashboardPage />,
      },
      {
        path: "sales",
        element: <SalesPage />,
      },
      {
        path: "sales/:orderId",
        element: <SalesDetailsPage />,
      },
      {
        path: "kitchen",
        element: <KitchenPage />,
      },
      {
        path: "table",
        element: <TablePage />,
      },
      // Food Management Routes
      {
        path: "category",
        element: <CategoryPage />,
      },
      {
        path: "ingredients",
        element: <IngredientsPage />,
      },
      {
        path: "stock",
        element: <StockPage />,
      },
      // User and Role Management Routes
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "user-roles",
        element: <UserRolesPage />,
      },
      {
        path: "user-roles/:roleId/permissions",
        element: <PermissionPage />,
      },
      {
        path: "supplier",
        element: <SupplierPage />,
      },
      {
        path: "purchase",
        element: <PurchasePage />,
      },
      {
        path: "purchase/add",
        element: <AddEditPurchasePage />,
      },
      {
        path: "purchase/:id",
        element: <AddEditPurchasePage />,
      },
      {
        path: "expense-type",
        element: <ExpenseTypePage />,
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
      },
      {
        path: "expenses/add",
        element: <AddEditExpensePage />,
      },
      {
        path: "expenses/:id",
        element: <AddEditExpensePage />,
      },
      {
        path: "reports/overall-sales",
        element: <OverallSalesReportPage />,
      },
      {
        path: "reports/overall-expense",
        element: <OverallExpenseReportPage />,
      },
      {
        path: "reports/most-sold-item",
        element: <TopSellingItemsPage />,
      },
      {
        path: "reports/purchase-report",
        element: <PurchaseReportPage />,
      },
      {
        path: "reports/supplier-report",
        element: <SupplierReportPage />,
      },

      // Manager Routes
      {
        path: "manager",
        element: <ManagerDashboardPage />,
      },
      {
        path: "staff",
        element: <StaffPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },

      // Chef Routes
      {
        path: "chef",
        element: <OrdersPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetailPage />,
      },
      {
        path: "order/create",
        element: <CreateOrderPage />,
      },
      // Cashier Routes
      {
        path: "cashier",
        element: <OrdersPage />,
      },
      // Shared Routes
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "menu/add",
        element: <AddMenuPage />,
      },
      {
        path: "menu/:id",
        element: <EditMenuPage />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
      // Settings Routes (Common for all roles)
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "settings/profile",
        element: <ProfilePage />,
      },
      {
        path: "settings/change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "settings/day-management",
        element: <DayManagementPage />,
      },
    ],
  },
]);

export default router;
