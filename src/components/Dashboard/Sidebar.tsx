// src/components/Dashboard/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { getSidebarForRole } from "@/config/sidebarConfig";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import LogoutConfirmModal from "@/components/Modals/LogoutConfirmModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const sidebarSections = getSidebarForRole(user.role);

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[250px] bg-sidebar border-r border-border flex flex-col shadow-xl z-9999 transition-transform duration-300 md:z-auto md:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between border-b border-border px-6">
          <div className="flex justify-start items-center gap-2">
            <img
              src="/logo.png"
              alt="Foodie Logo"
              className="w-20 h-16 object-contain"
            />
            {/* <p className="font-semibold text-xl">JVAI</p> */}
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-foreground hover:text-primary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-6 px-4">
          <div className="space-y-6">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Title */}
                {section.title && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}

                {/* Section Items */}
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
