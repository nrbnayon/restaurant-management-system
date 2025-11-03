// src/Pages/Settings/SettingsPage.tsx
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { RoleGuard } from "@/components/RoleGuard";
import { ChevronRight, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import DayManagementModal from "@/components/Modals/DayManagementModal";
import ChangePasswordModal from "@/components/Modals/ChangePasswordModal";

interface DayStatus {
  isOpen: boolean;
  openingTime: string;
  openingDate: string;
  closingTime?: string;
  closingDate?: string;
}

export default function SettingsPage() {
  const [showDayManagementModal, setShowDayManagementModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [dayStatus, setDayStatus] = useState<DayStatus | null>(null);

  // Get user name from localStorage
  const getUserName = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.name || user.email?.split("@")[0] || "User";
    }
    return "User";
  };

  const userName = getUserName();

  // Load day status
  useEffect(() => {
    const loadDayStatus = () => {
      const savedStatus = localStorage.getItem("dayStatus");
      if (savedStatus) {
        setDayStatus(JSON.parse(savedStatus));
      } else {
        setDayStatus({
          isOpen: false,
          openingTime: "",
          openingDate: "",
        });
      }
    };

    loadDayStatus();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadDayStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("dayStatusUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dayStatusUpdate", handleStorageChange);
    };
  }, []);

  const handleDayStatusUpdate = (newStatus: DayStatus) => {
    setDayStatus(newStatus);
  };

  return (
    <>
      <DashboardHeader
        title={`Welcome, ${userName}`}
        subtitle="Have a good day"
      />
      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        <RoleGuard allowedRole="admin">
          <div>
            {/* Day Management */}
            <div
              onClick={() => setShowDayManagementModal(true)}
              className="bg-card flex justify-between items-center rounded-md shadow-md p-3 hover:shadow-xl transition-all border border-border cursor-pointer"
            >
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-lg font-medium text-foreground">
                  Day Management
                </span>
                {dayStatus && (
                  <div className="flex items-center gap-2">
                    <Circle
                      className={`w-2.5 h-2.5 fill-current ${
                        dayStatus.isOpen ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        dayStatus.isOpen ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {dayStatus.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </RoleGuard>

        <div>
          {/* Personal Information */}
          <Link to="/dashboard/settings/profile">
            <div className="bg-card flex justify-between items-center rounded-md shadow-md p-3 hover:shadow-xl transition-all border border-border cursor-pointer">
              <span className="text-lg font-medium text-foreground">
                Personal Information
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </div>

        <div>
          {/* Change Password */}
          <div
            onClick={() => setShowChangePasswordModal(true)}
            className="bg-card flex justify-between items-center rounded-md shadow-md p-3 hover:shadow-xl transition-all border border-border cursor-pointer"
          >
            <span className="text-lg font-medium text-foreground">
              Change Password
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </main>

      {/* Day Management Modal */}
      {showDayManagementModal && (
        <DayManagementModal
          isOpen={showDayManagementModal}
          onClose={() => setShowDayManagementModal(false)}
          onStatusUpdate={handleDayStatusUpdate}
        />
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
}
