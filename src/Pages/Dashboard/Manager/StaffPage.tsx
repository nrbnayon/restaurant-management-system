// src/Pages/Dashboard/Manager/StaffPage.tsx
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import UserManagementPage from "@/components/Shared/UserManagementPage";

export default function StaffPage() {
  return (
    <>
      <DashboardHeader
        title="User Management"
        subtitle="Manage Your Restaurant User"
      />
      <UserManagementPage />
    </>
  );
}
