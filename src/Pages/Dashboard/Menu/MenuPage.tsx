// src/Pages/Dashboard/Menu/MenuPage.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatCard from "@/components/Shared/StatCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import MenuItemCard from "@/components/Menu/MenuItemCard";
import DeactivateModal from "@/components/Modals/DeactivateModal";
import { mockMenuItems, mockCategories } from "@/data/mockMenu";
import type { MenuItem } from "@/types/menu";
import { toast } from "sonner";

import menuIcon from "@/assets/icons/deliver.svg";
import categoryIcon from "@/assets/icons/deliver.svg";
import subCategoryIcon from "@/assets/icons/deliver.svg";
import { RoleGuard } from "@/components/RoleGuard";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(mockMenuItems);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesSubCategory =
        subCategoryFilter === "all" || item.subCategory === subCategoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);

      return (
        matchesSearch && matchesCategory && matchesSubCategory && matchesStatus
      );
    });
  }, [searchQuery, categoryFilter, subCategoryFilter, statusFilter, menuItems]);

  const stats = useMemo(() => {
    const totalMenu = menuItems.length;
    const totalCategory = mockCategories.length;
    const totalSubCategory = mockCategories.reduce(
      (acc, cat) => acc + cat.subCategories.length,
      0
    );

    return { totalMenu, totalCategory, totalSubCategory };
  }, [menuItems]);

  const subCategories = useMemo(() => {
    if (categoryFilter === "all") return [];
    const category = mockCategories.find((cat) => cat.name === categoryFilter);
    return category?.subCategories || [];
  }, [categoryFilter]);

  // Unified toggle: always open modal for confirmation (activate or deactivate)
  const handleStatusToggle = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!selectedItem) return;

    const willBeActive = !selectedItem.isActive;

    setMenuItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, isActive: willBeActive } : i
      )
    );

    // Show correct toast based on final state
    if (willBeActive) {
      toast.success("Menu item activated successfully", {
        description: `${selectedItem.name} is now active`,
      });
    } else {
      toast.warning("Menu item deactivated", {
        description: `${selectedItem.name} has been deactivated`,
      });
    }

    // Close modal
    setIsDeactivateModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <DashboardHeader title="Menu Management" />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Menu"
            value={stats.totalMenu.toString()}
            image={menuIcon}
          />
          <StatCard
            title="Total Category"
            value={stats.totalCategory.toString()}
            image={categoryIcon}
          />
          <StatCard
            title="Total Sub-Category"
            value={stats.totalSubCategory.toString()}
            image={subCategoryIcon}
          />
        </div>

        {/* Menu Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Menu</h2>
            <RoleGuard allowedRole="admin">
              <Link
                to="/dashboard/menu/add"
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Menu
              </Link>
            </RoleGuard>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Select your Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={subCategoryFilter}
              onValueChange={setSubCategoryFilter}
              disabled={categoryFilter === "all"}
            >
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Select your Sub-Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub-Categories</SelectItem>
                {subCategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.name}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Menu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12! border-input">
                <SlidersHorizontal className="h-5 w-5" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Deactivate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-4 gap-6">
            {filteredMenuItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No menu items found</p>
              </div>
            ) : (
              filteredMenuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onStatusToggle={handleStatusToggle}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Reusable Activate/Deactivate Modal */}
      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmToggle}
        title={
          selectedItem?.isActive
            ? `Are you sure you want to deactivate "${selectedItem.name}"?`
            : `Are you sure you want to activate "${selectedItem?.name}"?`
        }
        buttonText={selectedItem?.isActive ? `Deactivate` : `Activate`}
      />
    </>
  );
}
