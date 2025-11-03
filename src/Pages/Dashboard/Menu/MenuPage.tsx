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

  // Reset sub-category when category changes
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setSubCategoryFilter("all");
  };

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

    if (willBeActive) {
      toast.success("Menu item activated successfully", {
        description: `${selectedItem.name} is now active`,
      });
    } else {
      toast.warning("Menu item deactivated", {
        description: `${selectedItem.name} has been deactivated`,
      });
    }

    setIsDeactivateModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <DashboardHeader title="Menu Management" />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 md:p-5 space-y-4 md:space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Menu
            </h2>
            <RoleGuard allowedRole="admin">
              <Link
                to="/dashboard/menu/add"
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all text-sm md:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add Menu
              </Link>
            </RoleGuard>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Menu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>

            {/* Filters - Horizontal on desktop, stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 md:gap-4">
              {/* Category Filter */}
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10 md:h-12! bg-card text-sm md:text-base w-full sm:w-auto sm:min-w-[180px]">
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

              {/* Sub-Category Filter */}
              <Select
                value={subCategoryFilter}
                onValueChange={setSubCategoryFilter}
                disabled={categoryFilter === "all"}
              >
                <SelectTrigger className="h-10 md:h-12! bg-card text-sm md:text-base w-full sm:w-auto sm:min-w-[200px]">
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

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 md:h-12! border-input text-sm md:text-base w-full sm:w-auto sm:min-w-[120px]">
                  <SlidersHorizontal className="h-4 w-4 md:h-5 md:w-5" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Deactivate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMenuItems.length === 0 ? (
              <div className="col-span-full text-center py-8 md:py-12">
                <p className="text-muted-foreground text-sm md:text-base">
                  No menu items found
                </p>
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
