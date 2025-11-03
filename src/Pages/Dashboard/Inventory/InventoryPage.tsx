// src/Pages/Dashboard/Inventory/InventoryPage.tsx
import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import StatCard from "@/components/Shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  DollarSign,
  Check,
  SquarePen,
  Plus,
} from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import DeactivateModal from "@/components/Modals/DeactivateModal";
import CreateInventoryModal from "@/components/Inventory/CreateInventoryModal";
import EditInventoryModal from "@/components/Inventory/EditInventoryModal";
import { mockInventoryItems } from "@/data/mockInventory";
import type { InventoryItem } from "@/types/inventory";
import { Switch } from "@/components/ui/switch";
import { RoleGuard } from "@/components/RoleGuard";
import { toast } from "sonner";
import { Pagination } from "@/components/Shared/Pagination";

interface InventoryPageProps {
  title?: string;
}

export default function InventoryPage({
  title = "Ingredient",
}: InventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryItems, setInventoryItems] =
    useState<InventoryItem[]>(mockInventoryItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? item.isActive
          : !item.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, inventoryItems, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const monthlySpend = 5326;
    const todaySpend = 205;
    return { monthlySpend, todaySpend };
  }, []);

  // Unified toggle – always open modal for confirmation (activate or deactivate)
  const handleStatusToggle = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!selectedItem) return;

    const willBeActive = !selectedItem.isActive;

    setInventoryItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, isActive: willBeActive } : i
      )
    );

    // Show correct toast based on final state
    if (willBeActive) {
      toast.success("Inventory item activated successfully", {
        description: `${selectedItem.name} is now active`,
      });
    } else {
      toast.warning("Inventory item deactivated", {
        description: `${selectedItem.name} has been deactivated`,
      });
    }

    // Close modal
    setIsDeactivateModalOpen(false);
    setSelectedItem(null);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveCreate = (
    newItem: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
  ) => {
    const item: InventoryItem = {
      ...newItem,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInventoryItems((prev) => [item, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (updatedItem: InventoryItem) => {
    setInventoryItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setIsEditModalOpen(false);
    setSelectedItem(null);
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
      <DashboardHeader
        title={`${title} Management`}
        subtitle={`Track Your ${title} Stock`}
      />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Monthly Spend"
            value={`$${stats.monthlySpend.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-foreground" />}
          />
          <StatCard
            title="Today's Spend"
            value={`$${stats.todaySpend}`}
            icon={<DollarSign className="h-6 w-6 text-foreground" />}
          />
        </div>

        {/* Ingredients Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          {/* Header */}
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">{title}s</h2>
            <RoleGuard allowedRole="admin">
              <Button
                onClick={handleCreate}
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-3 py-2 text-white"
              >
                <Plus className="w-5 h-5" />
                Create {title}
              </Button>
            </RoleGuard>
          </div>

          {/* Search + Filter */}
          <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${title}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                className="h-12 px-4 border-input hover:bg-accent"
                onClick={() => setShowFilter((v) => !v)}
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                {statusFilter === "all"
                  ? "All"
                  : statusFilter === "active"
                  ? "Active"
                  : "Deactivate"}
              </Button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border p-2 z-10">
                  {(["all", "active", "inactive"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setCurrentPage(1);
                        setShowFilter(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                    >
                      <span className="capitalize">
                        {opt === "inactive" ? "Deactivate" : opt}
                      </span>
                      {statusFilter === opt && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">Name</th>
                  <th className="text-center p-4 font-semibold">Sufficient</th>
                  <th className="text-center p-4 font-semibold">Low</th>
                  <th className="text-center p-4 font-semibold">
                    Out of stock
                  </th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={5} />
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-2 md:p-5 text-center">
                      <p className="text-muted-foreground">
                        No {title.toLowerCase()}s found
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border text-center ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-2 text-sm text-foreground">
                        {item.name}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {item.sufficient}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {item.low}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {item.outOfStock}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={() => handleEdit(item)}
                          >
                            <SquarePen className="h-5 w-5 text-foreground" />
                          </Button>
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleStatusToggle(item)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && paginatedItems.length > 0 && (
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

      {/* Modals */}
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

      <CreateInventoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreate}
        title={title}
      />

      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSave={handleSaveEdit}
        title={title}
      />
    </>
  );
}
