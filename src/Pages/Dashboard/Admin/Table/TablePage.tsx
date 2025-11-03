// src/Pages/Dashboard/Table/TablePage.tsx
import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, SlidersHorizontal, Plus, Eye, SquarePen } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import DeactivateModal from "@/components/Modals/DeactivateModal";
import AddTableModal from "@/components/Table/AddTableModal";
import EditTableModal from "@/components/Table/EditTableModal";
import ViewTableModal from "@/components/Table/ViewTableModal";
import { mockTables } from "@/data/mockTables";
import type { Table } from "@/types/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RoleGuard } from "@/components/RoleGuard";
import { Pagination } from "@/components/Shared/Pagination";

export default function TablePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch = table.tableNo
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && table.isActive) ||
        (statusFilter === "deactivate" && !table.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, tables, statusFilter]);

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
  const paginatedTables = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTables.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTables, currentPage, itemsPerPage]);

  // Unified toggle handler: always opens modal for both activate & deactivate
  const handleStatusToggle = (table: Table) => {
    setSelectedTable(table);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!selectedTable) return;

    const willBeActive = !selectedTable.isActive;

    setTables((prev) =>
      prev.map((t) =>
        t.id === selectedTable.id ? { ...t, isActive: willBeActive } : t
      )
    );

    // Show correct toast based on final state
    if (willBeActive) {
      toast.success("Table activated successfully", {
        description: `Table ${selectedTable.tableNo} is now active`,
      });
    } else {
      toast.warning("Table deactivated", {
        description: `Table ${selectedTable.tableNo} has been deactivated`,
      });
    }

    // Close modal
    setIsDeactivateModalOpen(false);
    setSelectedTable(null);
  };

  const handleView = (table: Table) => {
    setSelectedTable(table);
    setIsViewModalOpen(true);
  };

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (
    newTable: Omit<Table, "id" | "createdAt" | "updatedAt">
  ) => {
    const table: Table = {
      ...newTable,
      id: `table-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTables((prev) => [table, ...prev]);
    setIsAddModalOpen(false);
    toast.success("Table added successfully", {
      description: `Table ${table.tableNo} has been created`,
    });
  };

  const handleSaveEdit = (updatedTable: Table) => {
    setTables((prev) =>
      prev.map((table) => (table.id === updatedTable.id ? updatedTable : table))
    );
    setIsEditModalOpen(false);
    setSelectedTable(null);
    toast.success("Table updated successfully", {
      description: `Table ${updatedTable.tableNo} has been updated`,
    });
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
        title="Table Management"
        subtitle="Track Your Restaurant Table Management"
      />

      <main className="p-3 md:p-8 space-y-3 md:space-y-6">
        {/* Table Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm pb-5">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Table's</h2>
            <RoleGuard allowedRole="manager">
              <Button
                onClick={handleAdd}
                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl rounded-md px-4 py-2.5 text-white transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Table
              </Button>
            </RoleGuard>
          </div>

          {/* Search */}
          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Table..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 md:pl-10 h-10 md:h-12 bg-card text-sm md:text-base"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 border-input">
                <SlidersHorizontal className="h-5 w-5" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deactivate">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-thin mx-auto md:mx-5 border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-center p-4 font-semibold">Table No</th>
                  <th className="text-center p-4 font-semibold">Capacity</th>
                  <th className="text-center p-4 font-semibold">Location</th>
                  <th className="text-center p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={4} />
                ) : paginatedTables.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-2 md:p-5 text-center">
                      <p className="text-muted-foreground">No tables found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedTables.map((table, index) => (
                    <tr
                      key={table.id}
                      className={`border-b border-border text-center ${
                        index % 2 === 0 ? "bg-background" : "bg-card"
                      } hover:bg-accent/50 transition-colors`}
                    >
                      <td className="p-2 text-sm text-foreground">
                        {table.tableNo}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {table.capacity}
                      </td>
                      <td className="p-2 text-sm text-foreground">
                        {table.location}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={() => handleView(table)}
                          >
                            <Eye className="h-5 w-5 text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                            onClick={() => handleEdit(table)}
                          >
                            <SquarePen className="h-5 w-5 text-foreground" />
                          </Button>
                          <Switch
                            checked={table.isActive}
                            onCheckedChange={() => handleStatusToggle(table)}
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
        {!isLoading && paginatedTables.length > 0 && (
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

      {/* Reusable Deactivate/Activate Modal */}
      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setSelectedTable(null);
        }}
        onConfirm={handleConfirmToggle}
        title={
          selectedTable?.isActive
            ? `Are you sure you want to deactivate Table ${selectedTable.tableNo}?`
            : `Are you sure you want to activate Table ${selectedTable?.tableNo}?`
        }
        buttonText={selectedTable?.isActive ? `Deactivate` : `Activate`}
      />

      <AddTableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
      />

      <EditTableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTable(null);
        }}
        table={selectedTable}
        onSave={handleSaveEdit}
      />

      <ViewTableModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTable(null);
        }}
        table={selectedTable}
      />
    </>
  );
}
